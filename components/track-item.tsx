import Link from "next/link"
import { Track } from "@prisma/client"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

import { TrackOperations } from "./track-operations"

// import { PostOperations } from "@/components/post-operations"

interface TrackItemProps {
  track: Pick<Track, "id" | "date">
}

export function TrackItem({ track }: TrackItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid gap-1">
        <Link
          href={`/track/edit/${track.id}`}
          className="font-semibold hover:underline"
        >
          {track.date.toDateString()}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(track.date?.toDateString())}
          </p>
        </div>
      </div>
      <TrackOperations track={{ id: track.id }} />
    </div>
  )
}

TrackItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
