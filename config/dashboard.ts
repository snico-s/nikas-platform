import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "User",
      href: "/user",
      icon: "user",
    },
    {
      title: "Tracks",
      href: "/user/tracks",
      icon: "map",
    },
    {
      title: "Timelines",
      href: "/dashboard/timelines",
      // icon: "settings",
    },
  ],
}
