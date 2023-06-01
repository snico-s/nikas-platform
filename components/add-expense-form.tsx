"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Currency, Expense, ExpenseCategory } from "@prisma/client"
import { SubmitHandler, useForm } from "react-hook-form"
import * as z from "zod"

import { createExpensesSchema } from "@/lib/validation/expenses"

import { ExpenseForm } from "./expense-form"

async function postExpense(data: FormSchema) {
  const result = await fetch("/api/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return result
}

function setDefaultValues(lastExpense: Expense | null, currencies: Currency[]) {
  if (!lastExpense)
    return {
      date: new Date(),
      categoryId: "Food and Drink",
      currencyId:
        currencies.find((currency) => currency.code === "EUR")?.id || 1,
    }
  return {
    date: new Date(lastExpense.date),
    categoryId: lastExpense.categoryId,
    currencyId: lastExpense.currencyId,
  }
}

type FormSchema = z.infer<typeof createExpensesSchema> // string

type Props = {
  currencies: Currency[]
  categories: ExpenseCategory[]
  lastExpense: Expense | null
}

export function AddExpenseForm({ currencies, categories, lastExpense }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const defaultValues = setDefaultValues(lastExpense, currencies)

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setLoading(true)

    const result = await postExpense(data)

    if (result.ok) {
      router.refresh()
      router.push("/user/expenses")
    }
  }

  return (
    <div className="rounded-sm border p-4">
      <h1 className="mb-4 text-2xl font-semibold md:text-3xl">Add Expense</h1>
      <ExpenseForm
        categories={categories}
        currencies={currencies}
        defaultValues={defaultValues}
        loading={loading}
        onSubmit={onSubmit}
      />
    </div>
  )
}
