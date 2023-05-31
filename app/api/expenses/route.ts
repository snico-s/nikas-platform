import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { createExpensesSchema } from "@/lib/validation/expenses"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    console.log("POST api/expenses/")

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session

    const json = await req.json()
    console.log(json)
    const readyToParse = { ...json, date: new Date(json.date) }
    const body = createExpensesSchema.parse(readyToParse)
    console.log("-- User ", user)
    console.log("-- Body ", body)

    const result = await db.expense.create({
      data: {
        ...body,
        // amount: body.amount,
        // date: body.date,
        // description: body.description,
        createdBy: user.id,
        // category: body.category,
        // currencyId: body.currencyId,
      },
    })

    console.log("🚀 ~ file: route.ts:38 ~ POST ~ result:", result)

    console.log(result)

    return new Response(JSON.stringify(result))
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}
