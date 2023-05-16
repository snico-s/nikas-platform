import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

interface MobileNavProps {
  items: NavItem[]
  children?: React.ReactNode
}

export function MobileNav({ items, children }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          {!open && <Icons.menu />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-4/5">
        <div
          className={cn(
            "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto bg-background/80 p-6 pb-32 md:hidden"
          )}
        >
          <div className="relative z-20 grid gap-6  p-4">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {items.map((item, index) => (
                <Link
                  key={index}
                  // href={item.disabled ? "#" : item.href}
                  href={item.href ? item.href : "/"}
                  className={cn(
                    "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                    item.disabled && "cursor-not-allowed opacity-60"
                  )}
                >
                  {item.title}
                </Link>
              ))}
              <hr className="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />
              <div>
                <ThemeToggle />
              </div>
            </nav>
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
