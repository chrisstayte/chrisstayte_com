"use client"

import { useMemo, useState } from "react"
import type { Ship, ShipSection, ShipStatus } from "@/lib/ships"

const filters = [
  { label: "All cargo", value: "all" },
  { label: "Apps", value: "apps" },
  { label: "Sites", value: "site" },
  { label: "Media", value: "media" },
  { label: "Code", value: "code" },
] as const

const sections: Array<{
  value: ShipSection
  label: string
  detail: string
}> = [
  {
    value: "professional",
    label: "Professional",
    detail: "Work apps shipped for clients, teams, and organizations.",
  },
  {
    value: "public",
    label: "Public",
    detail: "Personal apps, sites, utilities, and public artifacts.",
  },
]

function getStatusLabel(status: ShipStatus) {
  switch (status) {
    case "live":
      return "cleared"
    case "active":
      return "moving"
    case "archive":
      return "sealed"
    case "dispatch":
      return "sent"
  }
}

function getNoteParagraphs(note: string) {
  return note
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean)
}

function getShipLinks(ship: Ship) {
  if (ship.links.length > 0) {
    return ship.links
  }

  return [{ label: "Open shipment", href: ship.href }]
}

function getExternalLinkProps(href: string) {
  if (!href.startsWith("http")) {
    return {}
  }

  return {
    target: "_blank",
    rel: "noreferrer",
  }
}

function getInitialActiveShipId(ships: Ship[]) {
  for (const section of sections) {
    const firstShipInSection = ships.find((ship) => ship.section === section.value)

    if (firstShipInSection) {
      return firstShipInSection.id
    }
  }

  return ships[0]?.id ?? ""
}

type ManifestClientProps = {
  ships: Ship[]
}

export function ManifestClient({ ships }: ManifestClientProps) {
  const [activeShip, setActiveShip] = useState(() => getInitialActiveShipId(ships))
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all")

  const visibleShips = useMemo(() => {
    if (filter === "all") {
      return ships
    }

    return ships.filter((ship) => ship.type === filter)
  }, [filter, ships])

  const visibleSections = useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          ships: visibleShips.filter((ship) => ship.section === section.value),
        }))
        .filter((section) => section.ships.length > 0),
    [visibleShips],
  )

  const manifestNumber = ships.length.toString().padStart(4, "0")

  return (
    <main className="manifest-page">
      <div className="manifest-shell">
        <header className="site-header" aria-label="Site header">
          <a className="brand-mark" href="#top" aria-label="Chris Stayte home">
            <span className="brand-sigil">CS</span>
            <span>Chris Stayte</span>
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#manifest">Manifest</a>
            <a href="#professional">Professional</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <section id="top" className="hero-grid" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="route-line">Origin: build floor / destination: internet</p>
            <h1 id="page-title">Things I&apos;ve shipped.</h1>
            <p className="hero-deck">
              A compact record of the apps, sites, videos, utilities, and odd little
              artifacts I have pushed out of draft mode.
            </p>
          </div>

          <aside className="manifest-card" aria-label="Manifest summary">
            <div className="manifest-card-top">
              <span>Manifest No.</span>
              <strong>{manifestNumber}</strong>
            </div>
            <div className="stamp" aria-hidden="true">
              cleared to ship
            </div>
            <div className="barcode" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <dl className="card-stats">
              <div>
                <dt>Mode</dt>
                <dd>Static export</dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd>GitHub Pages</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section id="manifest" className="manifest-list-section" aria-labelledby="manifest-title">
          <div className="section-rule">
            <h2 id="manifest-title">The Manifest</h2>
            <p>Click an entry to inspect the crate.</p>
          </div>

          <div className="filter-bar" aria-label="Filter manifest entries">
            {filters.map((item) => (
              <button
                key={item.value}
                className="filter-button"
                data-active={filter === item.value}
                type="button"
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="manifest-groups">
            {visibleSections.map((section) => (
              <section
                key={section.value}
                id={section.value}
                className="manifest-section-group"
                aria-labelledby={`${section.value}-manifest-heading`}
              >
                <div className="manifest-section-heading">
                  <h3 id={`${section.value}-manifest-heading`}>{section.label}</h3>
                  <p>{section.detail}</p>
                </div>

                <div className="manifest-table" role="list">
                  {section.ships.map((ship) => {
                    const isActive = activeShip === ship.id

                    return (
                      <article
                        key={ship.id}
                        className="ship-row"
                        data-open={isActive}
                        role="listitem"
                      >
                        <button
                          className="ship-row-main"
                          type="button"
                          aria-expanded={isActive}
                          aria-controls={`${ship.id}-details`}
                          onClick={() => setActiveShip(isActive ? "" : ship.id)}
                        >
                          <span className="ship-code">{ship.code}</span>
                          <span className="ship-title-group">
                            <strong>{ship.title}</strong>
                            <span>{ship.summary}</span>
                          </span>
                          <span className="ship-meta">{ship.year}</span>
                          <span className="ship-type">{ship.type}</span>
                          <span className="ship-status" data-status={ship.status}>
                            {getStatusLabel(ship.status)}
                          </span>
                        </button>

                        <div id={`${ship.id}-details`} className="ship-details">
                          <div className="ship-note">
                            {getNoteParagraphs(ship.note).map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                          </div>
                          <ul aria-label={`${ship.title} cargo`}>
                            {ship.cargo.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          <div className="ship-links">
                            {getShipLinks(ship).map((link) => (
                              <a
                                key={`${ship.id}-${link.label}`}
                                className="ship-link"
                                href={link.href}
                                {...getExternalLinkProps(link.href)}
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}

            {visibleSections.length === 0 ? (
              <p className="empty-manifest">No shipments match this filter.</p>
            ) : null}
          </div>
        </section>

        <footer id="contact" className="site-footer">
          <p>
            Have a crate to inspect, a tool to compare, or a strange idea to ship?
          </p>
          <div className="footer-links">
            <a href="https://github.com/chrisstayte" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.youtube.com/@chrisstayte" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a href="https://chrisstayte.app" target="_blank" rel="noreferrer">
              Apps
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}
