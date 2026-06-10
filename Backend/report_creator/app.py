from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv
from io import BytesIO

from Backend.report_creator.services.pdf_service import generate_pdf
from Backend.report_creator.services.excel_service import generate_excel

load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL")

LAST_PDF = None
LAST_EXCEL = None


# =========================
# DB CONNECTION
# =========================
def get_connection():
    if not DATABASE_URL:
        raise Exception("DATABASE_URL no encontrada")

    db_url = DATABASE_URL.split("?")[0]
    return psycopg2.connect(db_url)


# =========================
# INSIGHTS
# =========================
def generate_insights(incomes, outflows, sales):

    total_income = sum(float(i[0]) for i in incomes) if incomes else 0
    total_expenses = sum(float(o[0]) for o in outflows) if outflows else 0
    total_sales = sum(float(s[1]) * int(s[2]) for s in sales) if sales else 0

    total_revenue = total_income + total_sales
    profit = total_revenue - total_expenses

    profit_margin = (profit / total_revenue * 100) if total_revenue > 0 else 0

    if profit <= 0:
        status = "Negative Balance"
    elif profit_margin < 10:
        status = "Low Profitability"
    elif profit_margin < 25:
        status = "Healthy Profitability"
    else:
        status = "Excellent Profitability"

    return {
        "income": round(total_income, 2),
        "expenses": round(total_expenses, 2),
        "sales": round(total_sales, 2),
        "revenue": round(total_revenue, 2),
        "profit": round(profit, 2),
        "profit_margin": round(profit_margin, 2),
        "message": status
    }


# =========================
# GENERATE REPORT
# =========================
@app.route("/generate_report", methods=["POST"])
def generate_report():

    global LAST_PDF, LAST_EXCEL

    data = request.json
    user_id = data["user_id"]
    report_type = data["report_type"]

    conn = get_connection()
    cur = conn.cursor()

    cur.execute('SELECT amount, description, income_type, date FROM "Incomes" WHERE user_id=%s', (user_id,))
    incomes = cur.fetchall()

    cur.execute('SELECT amount, description, outflow_type, date FROM "Outflows" WHERE user_id=%s', (user_id,))
    outflows = cur.fetchall()

    cur.execute('SELECT item_sold, price_of_item, quantity_of_sold_items, date FROM "Sales" WHERE user_id=%s', (user_id,))
    sales = cur.fetchall()

    cur.close()
    conn.close()

    insights = generate_insights(incomes, outflows, sales)

    rows = []

    # =========================
    # INCOMES
    # =========================
    if report_type == "incomes":
        rows = [
            {
                "type": i[2],
                "product": i[1] or "No description",
                "quantity": 1,
                "unit_price": float(i[0]),
                "amount": float(i[0]),
                "date": str(i[3])[:10]
            }
            for i in incomes
        ]

    # =========================
    # EXPENSES
    # =========================
    elif report_type == "expenses":
        rows = [
            {
                "type": o[2],
                "product": o[1] or "No description",
                "quantity": 1,
                "unit_price": float(o[0]),
                "amount": float(o[0]),
                "date": str(o[3])[:10]
            }
            for o in outflows
        ]

    # =========================
    # SALES
    # =========================
    elif report_type == "sales":
        rows = [
            {
                "type": "Sale",
                "product": s[0],
                "quantity": int(s[2]),
                "unit_price": float(s[1]),
                "amount": float(s[1]) * int(s[2]),
                "date": str(s[3])[:10]
            }
            for s in sales
        ]

    # =========================
    # PROFIT
    # =========================
    else:
        rows = [
            {"type": "Metric", "product": "Income", "quantity": "", "unit_price": "", "amount": insights["income"], "date": ""},
            {"type": "Metric", "product": "Sales", "quantity": "", "unit_price": "", "amount": insights["sales"], "date": ""},
            {"type": "Metric", "product": "Revenue", "quantity": "", "unit_price": "", "amount": insights["revenue"], "date": ""},
            {"type": "Metric", "product": "Expenses", "quantity": "", "unit_price": "", "amount": insights["expenses"], "date": ""},
            {"type": "Metric", "product": "Profit", "quantity": "", "unit_price": "", "amount": insights["profit"], "date": ""},
            {"type": "Metric", "product": "Margin", "quantity": "", "unit_price": "", "amount": insights["profit_margin"], "date": ""}
        ]

    # =========================
    # FIX CRÍTICO: COPIA BUFFER
    # =========================
    pdf_buffer = generate_pdf(rows, insights)
    excel_buffer = generate_excel(rows, insights)

    LAST_PDF = BytesIO(pdf_buffer.getvalue())
    LAST_EXCEL = BytesIO(excel_buffer.getvalue())

    return jsonify({
        "success": True,
        "pdf": request.host_url + "download/pdf",
        "excel": request.host_url + "download/excel",
        "insights": insights
    })


# =========================
# DOWNLOAD PDF
# =========================
@app.route("/download/pdf")
def download_pdf():

    global LAST_PDF

    if LAST_PDF is None:
        return jsonify({"error": "Generate report first"}), 404

    return send_file(
        BytesIO(LAST_PDF.getvalue()),
        as_attachment=True,
        download_name="financial_report.pdf",
        mimetype="application/pdf"
    )


# =========================
# DOWNLOAD EXCEL
# =========================
@app.route("/download/excel")
def download_excel():

    global LAST_EXCEL

    if LAST_EXCEL is None:
        return jsonify({"error": "Generate report first"}), 404

    return send_file(
        BytesIO(LAST_EXCEL.getvalue()),
        as_attachment=True,
        download_name="financial_report.xlsx",
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


if __name__ == "__main__":
    app.run(debug=True)