export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "nikas-journey",
  description: "A journey with the bicycle",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "User",
      href: "/user",
    },
  ],
  userNav: [
    {
      title: "Profile",
      href: "/user",
    },
    {
      title: "Tracks",
      href: "/user/tracks",
    },
  ],
}
