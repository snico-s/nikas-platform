import { ExpenseItem } from "@/components/expense-item"
import { DashboardHeader } from "@/components/header"
import { DashboardShell } from "@/components/shell"
import { TrackItem } from "@/components/track-item"

import { TrackCreateButton } from "./page"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Tracks" text="Create and manage tracks.">
        <TrackCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <TrackItem.Skeleton />
        <TrackItem.Skeleton />
        <TrackItem.Skeleton />
        <TrackItem.Skeleton />
        <TrackItem.Skeleton />
      </div>
    </DashboardShell>
  )
}
