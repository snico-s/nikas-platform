import Link from "next/link"
import { Expense } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

import { Icons } from "./icons"

// import { PostOperations } from "@/components/post-operations"

interface ExpenseItemProps {
  expense: Pick<Expense, "id" | "date" | "amount">
}

export function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/expense/edit/${expense.id}`}
          className="font-semibold hover:underline"
        >
          {expense.date.toDateString()}
        </Link>
        <div className="flex flex-wrap gap-3">
          <div className="text-sm text-muted-foreground">
            {formatDate(expense.date?.toDateString())}
          </div>
          <div className="flex gap-1 text-sm text-muted-foreground">
            <Icons.moveHorizontal className="h-5 w-5" />
            <div>{expense.amount.toFixed(2)} km</div>
          </div>
        </div>
      </div>
      {/* <ExpenseOperations expense={{ id: expense.id }} /> */}
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
