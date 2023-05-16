"use client"

import { signIn, signOut, useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"

import { Icons } from "./icons"

export function SiteHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className=" flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden items-center md:flex">
            {session ? (
              <Button variant={"ghost"} size={"sm"} onClick={() => signOut()}>
                <Icons.logout />
              </Button>
            ) : (
              <Button variant={"outline"} size={"sm"} onClick={() => signIn()}>
                Login
              </Button>
            )}
            <ThemeToggle />
          </nav>

          <MobileNav items={siteConfig.mainNav}></MobileNav>
        </div>
      </div>
    </header>
  )
}
