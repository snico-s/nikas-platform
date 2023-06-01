import { getServerSession } from "next-auth"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const routeContextSchema = z.object({
  params: z.object({
    expenseId: z.string(),
  }),
})

export async function DELETE(
  _req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  console.log("DELETE /api/expenses/[expensedId]")
  try {
    console.log(context)
    console.log(typeof context.params.expenseId)
    const { params } = routeContextSchema.parse(context)
    console.log("🚀 ~ file: route.ts:20 ~ params:", params)

    if (!(await verifyCurrentUserHasAccessToPost(+params.expenseId))) {
      return new Response(null, { status: 403 })
    }

    await prisma.expense.delete({
      where: {
        id: +params.expenseId,
      },
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }

    return new Response(null, { status: 500 })
  }
}

async function verifyCurrentUserHasAccessToPost(expenseId: number) {
  const session = await getServerSession(authOptions)
  console.log(
    "🚀 ~ file: route.ts:43 ~ verifyCurrentUserHasAccessToPost ~ session:",
    session
  )
  const count = await prisma.expense.count({
    where: {
      id: expenseId,
      createdBy: session?.user.id,
    },
  })

  return count > 0
}