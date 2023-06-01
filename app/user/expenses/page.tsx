import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Button, ButtonProps } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { ExpenseItem } from "@/components/expense-item"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

interface ExpenseCreateButtonProps extends ButtonProps {}

export const ExpenseCreateButton = ({
  autoFocus,
}: ExpenseCreateButtonProps) => (
  <Link href={"/expense/add"} passHref>
    <Button autoFocus={autoFocus}>
      <Icons.add className="mr-2 h-4 w-4" />
      Expense
    </Button>
  </Link>
)

export default async function ExpensesPages() {
  const user = await getCurrentUser()
  const headersList = headers()
  const referer = headersList.get("referer")

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login")
  }

  const expenses = await prisma.expense.findMany({
    where: { createdBy: user.id },
    include: {
      Currency: true,
    },
  })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Expenses"
        text="Create and manage your expenses."
      >
        <ExpenseCreateButton autoFocus={referer?.endsWith("/expense/add")} />
      </DashboardHeader>
      <div>
        {expenses?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {expenses.map((expense) => (
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
