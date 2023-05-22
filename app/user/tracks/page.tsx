import Link from "next/link"

export default function TrackPages() {
  return (
    <section className="container pb-8 pt-6">
      <Link href={"/user/tracks/add"}>Add Track</Link>
    </section>
  )
}
