"use client"

import { SessionProvider } from "next-auth/react"

import { Toaster } from "@/components/ui/toaster"

interface Props {
  children: React.ReactNode
}

const Providers = ({ children }: Props) => {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  )
}

export default Providers
