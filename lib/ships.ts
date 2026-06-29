import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { z } from "zod"

export const shipTypes = ["apps", "site", "media", "code"] as const
export const shipStatuses = ["live", "active", "archive", "dispatch"] as const
export const shipSections = ["public", "professional"] as const

export type ShipType = (typeof shipTypes)[number]
export type ShipStatus = (typeof shipStatuses)[number]
export type ShipSection = (typeof shipSections)[number]

const shipLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

const shipFrontmatterSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  code: z.string().min(1),
  title: z.string().min(1),
  year: z.coerce.string().min(1),
  type: z.enum(shipTypes),
  status: z.enum(shipStatuses),
  section: z.enum(shipSections).optional().default("public"),
  href: z.string().min(1),
  links: z.array(shipLinkSchema).optional().default([]),
  summary: z.string().min(1),
  cargo: z.array(z.string().min(1)).min(1),
  order: z.coerce.number().int().nonnegative(),
  draft: z.boolean().optional().default(false),
})

type ShipFrontmatter = z.infer<typeof shipFrontmatterSchema>

export type Ship = Omit<ShipFrontmatter, "draft"> & {
  note: string
  slug: string
}

const shipsDirectory = path.join(process.cwd(), "content", "ships")
const shipFilePattern = /\.mdx?$/

function formatZodIssues(issues: z.ZodIssue[]) {
  return issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join(".") : "frontmatter"

      return `- ${field}: ${issue.message}`
    })
    .join("\n")
}

function getShipFiles() {
  if (!fs.existsSync(shipsDirectory)) {
    throw new Error("Missing content directory: content/ships")
  }

  return fs
    .readdirSync(shipsDirectory)
    .filter((filename) => shipFilePattern.test(filename))
    .filter((filename) => !filename.startsWith("_"))
    .sort()
}

function assertUniqueShips(ships: Ship[]) {
  const seenIds = new Map<string, string>()
  const seenCodes = new Map<string, string>()

  for (const ship of ships) {
    const idSource = seenIds.get(ship.id)
    const codeSource = seenCodes.get(ship.code)

    if (idSource) {
      throw new Error(
        `Duplicate ship id "${ship.id}" in ${ship.slug}. First seen in ${idSource}.`,
      )
    }

    if (codeSource) {
      throw new Error(
        `Duplicate ship code "${ship.code}" in ${ship.slug}. First seen in ${codeSource}.`,
      )
    }

    seenIds.set(ship.id, ship.slug)
    seenCodes.set(ship.code, ship.slug)
  }
}

function getShipYearRank(year: string) {
  const normalizedYear = year.trim().toLowerCase()

  if (normalizedYear === "now" || normalizedYear === "ongoing") {
    return Number.MAX_SAFE_INTEGER
  }

  const parsedYear = Number.parseInt(normalizedYear, 10)

  if (Number.isNaN(parsedYear)) {
    return 0
  }

  return parsedYear
}

export function getShips() {
  const ships = getShipFiles()
    .flatMap((filename) => {
      const filePath = path.join(shipsDirectory, filename)
      const source = fs.readFileSync(filePath, "utf8")
      const { content, data } = matter(source)
      const parsed = shipFrontmatterSchema.safeParse(data)

      if (!parsed.success) {
        throw new Error(
          `Invalid ship frontmatter in content/ships/${filename}:\n${formatZodIssues(
            parsed.error.issues,
          )}`,
        )
      }

      const note = content.trim()

      if (!note) {
        throw new Error(`Missing markdown body note in content/ships/${filename}.`)
      }

      const { draft, ...ship } = parsed.data

      if (draft) {
        return []
      }

      return [
        {
          ...ship,
          note,
          slug: filename.replace(shipFilePattern, ""),
        },
      ]
    })
    .sort(
      (a, b) =>
        getShipYearRank(b.year) - getShipYearRank(a.year) ||
        a.order - b.order ||
        a.code.localeCompare(b.code),
    )

  assertUniqueShips(ships)

  return ships
}
