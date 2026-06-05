import os
import re
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from prisma import Prisma
from dotenv import load_dotenv

# Carga las variables de entorno desde el archivo .env de la raíz
load_dotenv(override=True)

# Asegura que Prisma Python use el esquema correcto
os.environ.setdefault("PRISMA_SCHEMA_PATH", "prisma/schema.python.prisma")

app = Flask(__name__)

# Permite peticiones desde el dev server de Next.js y producción
CORS(app, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", ""),
])

# Lee la API key desde la variable de entorno
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("Falta la variable de entorno GROQ_API_KEY en el archivo .env")

# Inicializa el cliente oficial de Groq
client = Groq(api_key=GROQ_API_KEY)

CALC_PATTERN = re.compile(
    r'(\d+)\s*[+-]\s*(\d+)\s*=\s*(\d+)|(\d+)\s*[+-]\s*(\d+)\s*=\s*\$(\d+)',
    re.IGNORECASE
)
LATEX_PATTERN = re.compile(
    r'\\\[\s*\\text\{.+\}\s*=\s*(\d+\s*-\s*\d+\s*=\s*\d+)\s*\]'
)

async def obtener_contexto_bd():
    """Lee usuarios, ventas, ingresos y egresos usando el nuevo esquema de Prisma de Python."""
    prisma = Prisma()
    await prisma.connect()
    try:
        # Se consultan los nuevos modelos definidos en tu archivo prisma
        usuarios = await prisma.user.find_many(
            include={'sales': True, 'incomes': True, 'outflows': True}
        )

        contexto = "=== DATOS DE LA APLICACIÓN FINANCIERA KUALI ===\n\n"
        contexto += "RESUMEN DE FLUJO POR USUARIO:\n"

        for u in usuarios:
            total_ventas = sum(float(s.price_of_item * s.quantity_of_sold_items) for s in u.sales)
            total_ingresos = sum(float(i.amount) for i in u.incomes)
            total_egresos = sum(float(o.amount) for o in u.outflows)
            cantidad_ventas = len(u.sales)
            
            contexto += (
                f"- {u.name} ({u.email}): {cantidad_ventas} venta(s), "
                f"Total en Ventas: ${total_ventas:.2f}, "
                f"Otros Ingresos: ${total_ingresos:.2f}, "
                f"Egresos/Gastos: ${total_egresos:.2f}\n"
            )

        contexto += "\nVENTAS RECIENTES REGISTRADAS:\n"
        ventas = await prisma.sales.find_many(
            include={'user': True},
            order={'date': 'desc'},
            take=20
        )
        for s in ventas:
            fecha_str = s.date.strftime('%Y-%m-%d') if s.date else 'N/A'
            total_item = s.quantity_of_sold_items * s.price_of_item
            contexto += (
                f"- {s.user.name} vendió {s.quantity_of_sold_items}x '{s.item_sold}' "
                f"por un total de ${total_item:.2f} el {fecha_str}\n"
            )

        return contexto
    finally:
        await prisma.disconnect()

def construir_system_prompt(contexto_bd: str) -> str:
    return f"""Eres Kuali, un asistente financiero inteligente.

Tu especialidad es:
- Analizar las compras, ventas, ingresos y egresos de los usuarios.
- Dar consejos sobre finanzas personales y del negocio.
- Responder preguntas analizando las transacciones existentes de la base de datos.

REGLAS:
1. Usa SIEMPRE los datos reales de abajo cuando pregunten sobre usuarios, finanzas, ingresos o ventas.
2. Si te preguntan algo fuera de finanzas, responde brevemente pero aclara que tu área son las finanzas del negocio.
3. Responde en el mismo idioma que usa el usuario.
4. Sé preciso con los números y cálculos monetarios.

{contexto_bd}"""

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_question = data.get("question")

    if not user_question:
        return jsonify({"error": "No se proporcionó ninguna pregunta"}), 400

    try:
        contexto_bd = asyncio.run(obtener_contexto_bd())
        system_prompt = construir_system_prompt(contexto_bd)

        # Configuración corregida con el modelo oficial Llama 3 en Groq
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_question}
            ],
            model="llama-3.1-8b-instant", # <- Modelo nuevo actualizado
            temperature=0.4
        )

        response_content = chat_completion.choices[0].message.content
        response_content = LATEX_PATTERN.sub(r'\1', response_content)

        def format_calc(match):
            if match.group(1):
                return f"## **${match.group(1)} - ${match.group(2)} = ${match.group(3)}**\n\n"
            return f"## **${match.group(4)} - ${match.group(5)} = ${match.group(6)}**\n\n"

        response_content = CALC_PATTERN.sub(format_calc, response_content)

        return jsonify({"response": response_content}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()  # <- Cópialo y pégalo justo aquí, al final de la función chat()
        return jsonify({"error": str(e)}), 500

@app.route('/clientes', methods=['GET'])
def get_clientes():
    """Retorna la lista mapeando el modelo User y Sales para compatibilidad con el frontend."""
    async def fetch():
        prisma = Prisma()
        await prisma.connect()
        try:
            usuarios = await prisma.user.find_many(
                include={'sales': True}
            )
            return [
                {
                    "nombre": u.name,
                    "cantidad_compras": len(u.sales),
                    "total_gastado": sum(float(s.price_of_item * s.quantity_of_sold_items) for s in u.sales)
                }
                for u in usuarios
            ]
        finally:
            await prisma.disconnect()

    try:
        resultado = asyncio.run(fetch())
        return jsonify(resultado), 200
    except Exception as e:
        import traceback
        traceback.print_exc()  # <- Esto imprimirá todo el rastro del error en rojo en tu terminal
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    debug_mode = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    app.run(debug=debug_mode, port=5000)