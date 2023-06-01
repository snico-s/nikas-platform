"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Currency, Expense, ExpenseCategory } from "@prisma/client"
import { SubmitHandler } from "react-hook-form"

import {
  ExpenseDefaultValues,
  ExpenseForm,
  ExpenseFormSchema,
} from "./expense-form"
import { toast } from "./ui/use-toast"

async function patchExpense(data: ExpenseFormSchema, expensesId: number) {
  const result = await fetch(`/api/expenses/${expensesId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
  return result
}

function setDefaultValues(expense: Expense): ExpenseDefaultValues {
  return {
    date: new Date(expense.date),
    categoryId: expense.categoryId,
    amount: expense.amount,
    currencyId: expense.currencyId,
    description: expense.description || undefined,
  }
}

type Props = {
  currencies: Currency[]
  categories: ExpenseCategory[]
  expense: Expense
}

export function EditExpense({ currencies, categories, expense }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const defaulValues = setDefaultValues(expense)

  const onSubmit: SubmitHandler<ExpenseFormSchema> = async (data) => {
    setLoading(true)

    const response = await patchExpense(data, expense.id)

    if (!response.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      })
    }

    router.refresh()
    router.push("/user/expenses")
  }

  return (
    <div className="rounded-sm border p-4">
      <h1 className="mb-4 text-2xl font-semibold md:text-3xl">Edit Expense</h1>
      <ExpenseForm
        categories={categories}
        currencies={currencies}
        defaultValues={defaulValues}
        loading={loading}
        onSubmit={onSubmit}
      />
    </div>
  )
}
