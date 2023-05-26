import * as React from "react"
import Link from "next/link"
import { useSwipeable } from "react-swipeable"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { Icons } from "./icons"
import { ThemeToggle } from "./theme-toggle"

interface MobileNavProps {
  items: NavItem[]
  children?: React.ReactNode
}

interface SwiperProps {
  children?: React.ReactNode
  handler: React.Dispatch<React.SetStateAction<boolean>>
  setWidth: React.Dispatch<React.SetStateAction<string>>
}

const Swiper = ({ children, handler, setWidth }: SwiperProps) => {
  const handlers = useSwipeable({
    delta: {
      right: 20,
    },
    onSwiping: (eventData) => {
      const deltaX = eventData.deltaX
      if (deltaX < 10) setWidth("w-4/5")
      if (deltaX > 20) setWidth("w-2/5")
    },
    onSwipedRight: (eventData) => {
      const deltaX = eventData.deltaX
      setWidth("w-1/5")
      setTimeout(() => {
        handler(false)
        setWidth("w-4/5")
      }, 50)
    },
  })

  return <div {...handlers}>{children}</div>
}

export function MobileNav({ items, children }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)
  const [widht, setWidth] = React.useState("w-4/5")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="mr-2 rounded-md p-2 text-base ring-offset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 md:hidden">
          {!open && <Icons.menu className="z-50" />}
          <span className="sr-only">Toggle Menu</span>
        </button>
      </SheetTrigger>

      <SheetContent className={cn(widht)}>
        <Swiper handler={setOpen} setWidth={setWidth}>
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
                    onClick={() => setTimeout(() => setOpen(false), 100)}
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
        </Swiper>
      </SheetContent>
    </Sheet>
  )
}
