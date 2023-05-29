import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ExpenseItem } from "@/components/expense-item"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

const ExpenseCreateButton = () => (
  <Link
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      buttonVariants({ variant: "default" })
    )}
    href={"/expense/add"}
  >
    <Icons.add className="mr-2 h-4 w-4" />
    Expense
  </Link>
)

export default async function ExpensesPages() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const expneses = await prisma.expense.findMany({
    where: { createdBy: user.id },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Expenses"
        text="Create and manage your expenses."
      >
        <ExpenseCreateButton />
      </DashboardHeader>
      <div>
        {expneses?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {expneses.map((expense) => (
              <ExpenseItem key={expense.id} expense={expense} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="coins" />
            <EmptyPlaceholder.Title>No Expenses created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any expenses yet.
            </EmptyPlaceholder.Description>
            <ExpenseCreateButton />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
