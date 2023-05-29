import Link from "next/link"
import { Track } from "@prisma/client"

import { getTracksForDashboard } from "@/lib/db/sql/tracks"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"
import { TrackItem } from "@/components/track-item"

const TrackCreateButton = () => (
  <Link
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      buttonVariants({ variant: "default" })
    )}
    href={"/track/add"}
  >
    <Icons.add className="mr-2 h-4 w-4" />
    Track
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
