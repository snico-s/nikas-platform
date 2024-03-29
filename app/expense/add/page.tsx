import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { AddExpense } from "@/components/add-expense"

export default async function AddExpensePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const currencies = await db.currency.findMany()
  const categories = await db.expenseCategory.findMany()
  const lastExpense = await db.expense.findFirst({
    where: {
      createdBy: user.id,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mt-2 max-w-md px-0">
      <AddExpense
        currencies={currencies}
        categories={categories}
        lastExpense={lastExpense}
      />
    </div>
  )
}
