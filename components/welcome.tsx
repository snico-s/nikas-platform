"use client"

import { useSession } from "next-auth/react"

function Welcome() {
  const { data: session } = useSession()

  if (!session) return <div>NO SESSION</div>

  return <div> Hello {session.user.name}</div>
}

export default Welcome
