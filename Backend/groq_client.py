import os
from groq import Groq

def obtener_respuesta_groq(prompt: str) -> str:
    """
    Se conecta a la API de Groq utilizando la API Key del archivo .env
    y devuelve la respuesta generada por el modelo Llama 3.
    """
    # Recupera la API Key desde las variables de entorno
    api_key = os.getenv("GROQ_API_KEY")
    
    if not api_key:
        return "Error: No se encontró la configuración GROQ_API_KEY en el archivo .env."
    
    try:
        # Inicializa el cliente oficial de Groq
        client = Groq(api_key=api_key)
        
        # Realiza la petición de chat completado
        completion = client.chat.completions.create(
            model="llama3-8b-8192",  # Un modelo rápido y eficiente para finanzas
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.5,
        )
        
        # Devuelve el texto limpio de la respuesta
        return completion.choices[0].message.content

    except Exception as e:
        return f"Error al conectar con el servicio de IA (Groq): {str(e)}"