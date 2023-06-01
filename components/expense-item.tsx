import Link from "next/link"
import { Currency, Expense } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

import { ExpenseOperations } from "./expense-operations"

type ExpenseWithCurrency = Expense & {
  Currency: Currency | null
}

type ExpenseItemProps = {
  expense: ExpenseWithCurrency
}

export function ExpenseItem({ expense }: ExpenseItemProps) {
  const symbol = expense.Currency?.symbol || expense.Currency?.currency || ""
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/expense/edit/${expense.id}`}
          className="flex gap-1 font-semibold hover:underline"
        >
          {expense.amount.toFixed(2)} {symbol}
        </Link>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {/* <div>{formatDate(expense.date?.toDateString())}</div> */}
          <div>{formatDate(new Date(expense.date).toDateString())}</div>
          <div>{expense.categoryId}</div>
        </div>
      </div>
      <ExpenseOperations expense={{ id: expense.id }} />
    </div>
  )
}

ExpenseItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
