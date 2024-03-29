import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"

export default function NotFound() {
  return (
    <EmptyPlaceholder className="mx-auto mt-4 max-w-[800px]">
      <EmptyPlaceholder.Icon name="warning" />
      <EmptyPlaceholder.Title>Uh oh! Not Found</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        This Expense cound not be found. Please try again.
      </EmptyPlaceholder.Description>
      <Link
        href="/user/expenses"
        className={buttonVariants({ variant: "ghost" })}
      >
        Go to Dashboard
      </Link>
    </EmptyPlaceholder>
  )
}
