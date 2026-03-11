import {
  BsFiletypeJson,
} from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { MdOutlineCompare, MdLockReset } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { TbMarkdown, TbBrush } from "react-icons/tb";

/**
 * siteConfig – Single touchpoint for all landing-page content.
 *
 * To add a new feature:
 *  1. Add one object to the `features` array below.
 *  2. That's it — the landing page renders it automatically.
 *
 * Feature shape:
 * {
 *   id:          string   – unique slug (also used as React key)
 *   title:       string   – display name
 *   description: string   – one-liner shown on the card
 *   icon:        JSX      – any react-icons component
 *   route:       string   – React Router path
 *   accent:      string   – CSS color for the card left-border & icon bg
 *   badge:       string | null  – optional pill label e.g. "New"
 *   tags:        string[] – optional searchable tags (future use)
 * }
 */

export const siteConfig = {
  // ── Brand ─────────────────────────────────────────────────
  name: "SNCLS",
  pronunciation: "essentials",
  tagline: "Every dev tool you reach for, in one place.",
  description:
    "SNCLS (pronounced essentials) consolidates the most commonly used developer tools into a single, fast, offline-capable workspace.",

  // ── Navbar ────────────────────────────────────────────────
  ctaLabel: "Open App →",
  ctaRoute: "/jsonify",

  // ── Features ──────────────────────────────────────────────
  features: [
    {
      id: "jsonify",
      title: "JSONify",
      description:
        "Format, prettify, stringify, escape and validate JSON with a single click.",
      icon: BsFiletypeJson,
      route: "/jsonify",
      accent: "#3b82f6",   // blue
      badge: null,
      tags: ["json", "format", "validate", "prettify"],
    },
    {
      id: "blank-space",
      title: "Blank Space",
      description:
        "A distraction-free scratchpad for quick notes, code snippets, or any free-form text.",
      icon: GrNotes,
      route: "/blank-space",
      accent: "#10b981",   // emerald
      badge: null,
      tags: ["notes", "text", "scratchpad"],
    },
    {
      id: "diff-editor",
      title: "Diff Editor",
      description:
        "Side-by-side diff viewer to compare and spot differences between two blocks of text or code.",
      icon: MdOutlineCompare,
      route: "/diff-editor",
      accent: "#f59e0b",   // amber
      badge: null,
      tags: ["diff", "compare", "merge"],
    },
    {
      id: "time-forge",
      title: "Time Forge",
      description:
        "Convert epoch timestamps, switch timezones, and format dates in every standard format.",
      icon: FaRegClock,
      route: "/time-forge",
      accent: "#8b5cf6",   // violet
      badge: null,
      tags: ["time", "epoch", "timestamp", "timezone"],
    },
    {
      id: "encode-decode-zone",
      title: "Encode / Decode",
      description:
        "Encode and decode Base64, URL, HTML entities, JWT payloads, and escaped strings instantly.",
      icon: MdLockReset,
      route: "/encode-decode-zone",
      accent: "#ef4444",   // red
      badge: null,
      tags: ["encode", "decode", "base64", "url", "jwt"],
    },
    {
      id: "markdown-editor",
      title: "Markdown Editor",
      description:
        "Live split-pane markdown editor with GFM support, line numbers, and multi-tab persistence.",
      icon: TbMarkdown,
      route: "/markdown-editor",
      accent: "#0ea5e9",   // sky
      badge: null,
      tags: ["markdown", "editor", "preview", "notes"],
    },
    {
      id: "drawboard",
      title: "Drawboard",
      description:
        "Infinite canvas drawing board powered by Excalidraw — sketch diagrams, wireframes, and ideas with multi-tab support.",
      icon: TbBrush,
      route: "/drawboard",
      accent: "#ec4899",   // pink
      badge: "New",
      tags: ["draw", "canvas", "diagram", "sketch", "excalidraw"],
    },
  ],

  // ── Footer ────────────────────────────────────────────────
  footer: {
    copy: `© ${new Date().getFullYear()} SNCLS. Built for developers.`,
  },
};
