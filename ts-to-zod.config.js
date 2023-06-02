// npx ts-to-zod

module.exports = [
  {
    name: "geoTypes",
    input: "types/geo.ts",
    output: "types/zod.ts",
    jsDocTagFilter: (tags) => tags.map((tag) => tag.name).includes("toExtract"), // <= rule here
  },
]
