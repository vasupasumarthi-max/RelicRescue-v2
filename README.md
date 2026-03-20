# UNEARTHED: Relic Rescue v2

An archaeological adventure game built for the FLL Innovation Project. Dig through layers of history, discover ancient artifacts, and learn about real archaeological sites around the world!

## Features

- **5 Real Archaeological Sites**: Pompeii, Giza Workers' Village, Mesa Verde, Machu Picchu, and Mohenjo-daro — each with unique site-specific backgrounds and soil layers
- **Grid-Based Excavation**: 8x8 dig grid with 8 soil layers per site, realistic textures, and per-cell visual variation
- **4 Excavation Tools**: Pickaxe (fast but risky), Shovel (balanced), Trowel (precise), Brush (delicate) — each with different speed and damage characteristics
- **Artifact Discovery**: 34 unique artifacts across all sites with rarity grades (Common, Uncommon, Rare, Legendary) and condition grading (A-F)
- **Gem Economy**: Earn gems from artifact extraction, buy gem packs in the shop, unlock new tools and sites
- **Level-Up System**: Progress through 6 ranks — Volunteer → Intern → Student → Researcher → Expert → Professor
- **Museum Collection**: View all discovered artifacts with detailed information and collection progress
- **Fund Real Archaeology**: Links to real archaeological organizations and donation opportunities
- **Immersive Visuals**: Site-specific backgrounds (Vesuvius, Pyramids, cliff dwellings, mountain tops), rope-bordered dig grids, archaeological equipment, dust particle animations

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **Vite** for development and building
- **Framer Motion** for animations
- **canvas-confetti** for celebration effects

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/vasupasumarthi-max/RelicRescue-v2.git
cd RelicRescue-v2

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The game will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist` folder — these are static HTML/CSS/JS files that can be hosted anywhere (GitHub Pages, Netlify, Vercel, etc.).

## Game Guide

1. **Start**: Click "Start Excavation" from the title screen
2. **Select Site**: Choose an unlocked archaeological site from the world map
3. **Read Briefing**: Learn about the site's history and what artifacts to look for
4. **Dig**: Click grid cells to excavate — use the right tool for each layer!
5. **Discover**: Find artifacts hidden in the soil — be careful not to damage them!
6. **Level Up**: Earn XP from digging and discovering artifacts to unlock new sites
7. **Collect**: Visit the Museum to view your artifact collection
8. **Shop**: Spend gems to unlock better tools and new sites

## Project Structure

```
client/
  src/
    components/     # Game screens (TitleScreen, WorldMap, ExcavationScene, etc.)
    contexts/       # Game state management (GameContext)
    lib/            # Game data, constants, utilities
    pages/          # Page-level components
```

## Credits

Built for the FIRST LEGO League Innovation Project — teaching kids about archaeology through interactive gaming.

## License

MIT
