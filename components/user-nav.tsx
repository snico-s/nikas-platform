"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

import { siteConfig } from "@/config/site"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/theme-toggle"

export default function UserNav() {
  const { data: session } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="justify-center hover:border-[1px] hover:border-ring/70">
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>
            <Icons.user />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="m-2 p-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {siteConfig.userNav.map((nav, index) => (
          <DropdownMenuItem key={index}>
            <Link href={nav.href}>{nav.title}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="flex gap-1">
          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
            <ThemeToggle />
          </div>
          <DropdownMenuItem>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <Icons.logout />
            </Button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
