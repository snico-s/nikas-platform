import { PrismaClient } from "@prisma/client"

const currencies = [
  { currency: "United States Dollar", code: "USD", symbol: "$" },
  { currency: "Euro", code: "EUR", symbol: "€" },
  { currency: "Japanese Yen", code: "JPY", symbol: "¥" },
  { currency: "British Pound Sterling", code: "GBP", symbol: "£" },
  { currency: "Australian Dollar", code: "AUD", symbol: "A$" },
  { currency: "Canadian Dollar", code: "CAD", symbol: "C$" },
  { currency: "Swiss Franc", code: "CHF", symbol: "Fr" },
  { currency: "Chinese Yuan", code: "CNY", symbol: "¥" },
  { currency: "Swedish Krona", code: "SEK", symbol: "kr" },
  { currency: "New Zealand Dollar", code: "NZD", symbol: "NZ$" },
  { currency: "Mexican Peso", code: "MXN", symbol: "$" },
  { currency: "Singapore Dollar", code: "SGD", symbol: "S$" },
  { currency: "Hong Kong Dollar", code: "HKD", symbol: "HK$" },
  { currency: "Norwegian Krone", code: "NOK", symbol: "kr" },
  { currency: "South Korean Won", code: "KRW", symbol: "₩" },
  { currency: "Turkish Lira", code: "TRY", symbol: "₺" },
  { currency: "Indian Rupee", code: "INR", symbol: "₹" },
  { currency: "Russian Ruble", code: "RUB", symbol: "₽" },
  { currency: "Brazilian Real", code: "BRL", symbol: "R$" },
  { currency: "South African Rand", code: "ZAR", symbol: "R" },
]

const categories = [
  "Food and Drink",
  "Sleep",
  "Hygiene",
  "Visa",
  "Gas and Petrol",
  "Bike repair",
  "Equpiment",
  "Holiday",
  "Transportation",
  "Others",
]

const prisma = new PrismaClient()

async function main() {
  currencies.forEach(async (currency) => {
    const result = await prisma.currency.upsert({
      where: { code: currency.code },
      update: {},
      create: {
        code: currency.code,
        currency: currency.currency,
        symbol: currency.symbol,
      },
    })
    console.log("🚀 ~ file: seed.ts:40 ~ main ~ result:", result)
  })

  categories.forEach(async (category) => {
    const result = await prisma.expenseCategory.upsert({
      where: { category: category },
      update: {},
      create: {
        category: category,
      },
    })

    console.log(result)
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
