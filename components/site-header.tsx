"use client"

import { signIn, useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import UserNav from "@/components/user-nav"

export function SiteHeader() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className=" flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center">
            {status === "loading" ? (
              <Skeleton className="h-[40px] w-[40px] rounded-full bg-foreground" />
            ) : session ? (
              <UserNav />
            ) : (
              <div className="flex space-x-1">
                <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => signIn()}
                >
                  Login
                </Button>
                <div className="hidden md:flex">
                  <ThemeToggle />
                </div>
              </div>
            )}
          </nav>

          <MobileNav items={siteConfig.mainNav}></MobileNav>
        </div>
      </div>
    </header>
  )
}
