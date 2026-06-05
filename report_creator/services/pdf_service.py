from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf(data, insights=None):

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()

    elements = []

    elements.append(Paragraph("Financial Report", styles["Title"]))
    elements.append(Spacer(1, 10))

    if insights:
        elements.append(Paragraph(f"Profit: {insights['profit']}", styles["Normal"]))
        elements.append(Paragraph(insights["message"], styles["Normal"]))
        elements.append(Spacer(1, 10))

    table_data = [["Type", "Product", "Qty", "Unit Price", "Amount"]]

    if not data:
        table_data.append(["No data available", "", "", "", ""])
    else:
        for r in data:
            table_data.append([
                r.get("type", ""),
                r.get("product", ""),
                r.get("quantity", ""),
                r.get("unit_price", ""),
                r.get("amount", ""),
            ])

    table = Table(table_data)

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#010221")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
    ]))

    elements.append(table)

    doc.build(elements)
    buffer.seek(0)
    return buffer