"use client"

import { useState } from "react"

import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"

import { MobileNav } from "./mobile-nav"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className=" flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden items-center space-x-1 md:flex">
            <ThemeToggle />
          </nav>

          <MobileNav items={siteConfig.mainNav}></MobileNav>
        </div>
      </div>
    </header>
  )
}
