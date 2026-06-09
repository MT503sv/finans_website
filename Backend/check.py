import asyncio, os
from prisma import Prisma

os.environ.setdefault("PRISMA_SCHEMA_PATH", "prisma/schema.python.prisma")

async def check():
    prisma = Prisma()
    await prisma.connect()
    sales = await prisma.sales.find_many(
        where={"user_id": "user_3DicifZijd5Kp43NFgmp5ahBdbg"},
        order={"date": "desc"},
        take=10
    )
    for s in sales:
        print(s.date, "|", s.item_sold, "|", s.quantity_of_sold_items)
    await prisma.disconnect()

asyncio.run(check())