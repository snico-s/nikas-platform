import Link from "next/link"
import { Track } from "@prisma/client"

import { getTracksForDashboard } from "@/lib/db/sql/tracks"
import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { TrackItem } from "@/components/track-item"

const TrackCreateButton = () => (
  <Link
    className={buttonVariants({ variant: "default" })}
    href={"/user/tracks/add"}
  >
    Add Track
  </Link>
)

export default async function TrackPages() {
  const tracks = await getTracksForDashboard()

  return (
    <DashboardShell>
      <DashboardHeader heading="Tracks" text="Create and manage tracks.">
        <TrackCreateButton />
      </DashboardHeader>
      <div>
        {tracks?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {tracks.map((track) => (
              <TrackItem key={track.id} track={track} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="map" />
            <EmptyPlaceholder.Title>No tracks created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any tracks yet.
            </EmptyPlaceholder.Description>
            <TrackCreateButton />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  )
}
