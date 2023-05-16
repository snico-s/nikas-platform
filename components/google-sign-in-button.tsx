"use client"

import { useSearchParams } from "next/navigation"
import { signIn, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"

import { Icons } from "./icons"
import { Skeleton } from "./ui/skeleton"

const GoogleSignInButton = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")

  const { data: session, status } = useSession()

  if (status === "loading")
    return (
      <div>
        <Skeleton className="h-[40px] w-[200px] rounded-md bg-primary" />
      </div>
    )

  // if (session) return <div>Bereits eingelogt</div>

  return (
    <Button
      onClick={() =>
        signIn("google", { callbackUrl: callbackUrl ? callbackUrl : "/" })
      }
    >
      <Icons.google className="mr-2 h-4 w-4" />
      Continue with Google
    </Button>
  )
}

export default GoogleSignInButton
