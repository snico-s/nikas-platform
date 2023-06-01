import { notFound, redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { EditExpense } from "@/components/edit-expense"

type EditExpensePageProps = {
  params: { expenseId: string }
}

export default async function EditExpensePage({
  params,
}: EditExpensePageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const currencies = await db.currency.findMany()
  const categories = await db.expenseCategory.findMany()
  const expense = await db.expense.findFirst({
    where: {
      id: +params.expenseId,
      createdBy: user.id,
    },
  })

  if (!expense) notFound()

  return (
    <div className="container mt-2 max-w-md px-0">
      <EditExpense
        expense={expense}
        currencies={currencies}
        categories={categories}
      />
    </div>
  )
}
