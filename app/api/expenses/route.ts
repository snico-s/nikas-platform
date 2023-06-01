import { Currency, Expense } from "@prisma/client"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { createExpensesSchema } from "@/lib/validation/expenses"

export type getExpensesResponseType = (Expense & {
  Currency: Currency | null
})[]

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return new Response("Unauthorized", { status: 403 })
  }
  const { user } = session

  try {
    const json = await req.json()
    const readyToParse = { ...json, date: new Date(json.date) }
    const body = createExpensesSchema.parse(readyToParse)

    const result = await db.expense.create({
      data: {
        ...body,
        createdBy: user.id,
      },
    })

    return new Response(JSON.stringify(result))
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    return new Response(null, { status: 500 })
  }
}
