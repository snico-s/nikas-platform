"use client"

import { useSession } from "next-auth/react"

function Welcome() {
  const { data: session } = useSession()

  if (!session) return <div>NO SESSION</div>

  return (
    <div>
      Hello {session.user.name}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>{" "}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>{" "}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>{" "}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>{" "}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>{" "}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>{" "}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>{" "}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>{" "}
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem
        praesentium sint deleniti inventore, exercitationem quas officiis vero
        temporibus nam ab laboriosam accusamus aut voluptates alias minima
        ratione adipisci, quasi provident?
      </div>
    </div>
  )
}

export default Welcome
