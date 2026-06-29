import { ManifestClient } from "@/components/manifest-client"
import { getShips } from "@/lib/ships"

export const dynamic = "force-static"

export default function Home() {
  const ships = getShips()

  return <ManifestClient ships={ships} />
}
