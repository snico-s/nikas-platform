import { headers } from "next/headers"

import { ExpenseItem } from "@/components/expense-item"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"

import { ExpenseCreateButton } from "./page"

export default function DashboardLoading() {
  const headersList = headers()
  const referer = headersList.get("referer")

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Expenses"
        text="Create and manage your expenses."
      >
        <ExpenseCreateButton autoFocus={referer?.endsWith("/expense/add")} />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <ExpenseItem.Skeleton />
        <ExpenseItem.Skeleton />
        <ExpenseItem.Skeleton />
        <ExpenseItem.Skeleton />
        <ExpenseItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
