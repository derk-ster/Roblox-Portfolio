# Derk2104 | Roblox Developer Portfolio

A premium Roblox development portfolio built with Next.js, TypeScript, Tailwind CSS, Motion, and React Three Fiber. Add media files to folders and the site updates automatically. No React editing required.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Motion** (animations)
- **React Three Fiber + Drei** (3D hero scene)
- **Lucide React** (icons)
- **pnpm** (package manager)

## Install

```bash
pnpm install
```

## Run Development Server

```bash
pnpm dev
```

The `predev` script automatically runs `generate:assets` before starting. Open [http://localhost:3000](http://localhost:3000).

## Add New Portfolio Media

### Folder Structure

```
public/assets/
├── best-work/      # Featured / top portfolio items
├── scripting/      # Scripting projects
├── animation/      # Animation clips
├── vfx/            # VFX work
├── building/       # Maps, lobbies, environments
├── modeling/       # Blender / 3D assets
└── wip/            # Work in progress
```

### Supported Media Types

- Images: `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`
- Videos: `.mp4`, `.webm`, `.mov`

### To Add a New Animation

1. Put the file in `public/assets/animation`
2. Optional: edit `public/assets/animation/meta.json`
3. Run `pnpm dev`
4. The site updates automatically

### To Add a New Scripting Clip

1. Put the file in `public/assets/scripting`
2. Optional: edit `public/assets/scripting/meta.json`
3. Run `pnpm dev`
4. The site updates automatically

### Using meta.json

Each category folder can optionally contain a `meta.json` to customize metadata per file:

```json
{
  "blocking-up.mp4": {
    "title": "Upward Block Animation",
    "description": "Roblox blocking animation for combat guard system.",
    "tags": ["Animation", "Combat", "R6", "Commission"],
    "status": "Completed",
    "featured": true,
    "order": 1,
    "date": "2026"
  }
}
```

**Fields:**

| Field | Description |
|-------|-------------|
| `title` | Display title (auto-generated from filename if omitted) |
| `description` | Project description |
| `tags` | Array of tag strings for filtering |
| `status` | `Completed`, `WIP`, `Commission`, or `Personal` |
| `featured` | Show in featured filters (`true` by default in `best-work`) |
| `order` | Sort order (lower = first) |
| `date` | Display date string |
| `thumbnail` | Custom thumbnail path (optional) |

**Without metadata**, the script will:

- Generate a clean title from the filename
- Use the folder name as the category
- Apply default tags based on category
- Set status to `Completed` (or `WIP` for the `wip` folder)
- Set `featured` to `false` (or `true` for `best-work`)

### Video Thumbnails

For videos, you can add a thumbnail image alongside the video:

- `my-clip-thumb.png` or `my-clip.thumb.jpg`

### Regenerate Assets Manually

```bash
pnpm generate:assets
```

This scans `public/assets/` and writes `src/generated/portfolio-assets.ts`.

## Build for Production

```bash
pnpm build
pnpm start
```

## Deploy to Vercel

1. Push the project to GitHub
2. Import the repository at [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js. No extra config needed
4. Build command: `pnpm build` (runs `prebuild` and asset generation automatically)
5. Deploy

Every push triggers a new build. Add media files, commit, and push. The live site updates.

## Recommended Formats

| Type | Recommended |
|------|-------------|
| Images | `.webp` or `.png` for quality; `.jpg` for photos |
| Videos | `.mp4` (H.264) for broad compatibility; `.webm` for smaller size |
| Resolution | 1920×1080 or 1280×720 for videos |
| File size | Keep videos under ~50MB when possible for fast loading |

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/
│   ├── effects/         # Mouse glow, tilt, particles, etc.
│   ├── home/            # Hero, 3D scene, stats
│   ├── layout/          # Navbar, footer, mobile menu
│   ├── portfolio/       # Cards, grid, filters, modal
│   ├── sections/        # Page sections
│   └── ui/              # Buttons, badges, headers
├── generated/           # Auto-generated portfolio data
├── lib/                 # Asset helpers, utilities
└── types/               # TypeScript types
scripts/
└── generate-assets.mjs  # Asset scanner
public/
├── assets/              # Your portfolio media (add files here)
└── placeholder/         # Demo placeholders when folders are empty
```

## Customization

- **Contact links**: Edit `src/components/sections/ContactSection.tsx` and `src/components/home/Hero.tsx`
- **Copy / about text**: Edit section components in `src/components/sections/`
- **Colors**: Defined in `src/app/globals.css` under `@theme`

## License

Private portfolio project. All rights reserved.
