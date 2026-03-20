// ============================================================
// RELIC RESCUE - GAME DATA
// Design: Kid Explorer Adventure - Bright Cartoon Game Style
// All sites, artifacts, tools, and progression from the original game
// ============================================================

// --- IMAGES ---
export const IMAGES = {
  heroBanner: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/hero-banner-ksD4PDndAXsVRtEH4vcfLj.webp',
  worldMap: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/world-map-bg-KcwATpEtExiR9GEXhFmyDU.webp',
  gemCrystal: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/gem-crystal-mXzjj2ZNBzXdMHHWbdTr6q.webp',
  museumBg: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/museum-bg-LgJF4WyTriTU3GcrMr9kCM.webp',
};

// Site-specific excavation background images
export const SITE_BACKGROUNDS: Record<string, string> = {
  'pompeii': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/excavation-pompeii_3eeb03d4.png',
  'giza': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/excavation-giza_1b0e4677.png',
  'mesa-verde': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/excavation-mesa-verde_16af58a9.png',
  'machu-picchu': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/excavation-machu-picchu_da314ab4.png',
  'mohenjo-daro': 'https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/excavation-mohenjo-daro_cea2ab56.png',
};

// --- TOOL DEFINITIONS ---
export interface ToolDef {
  id: string;
  name: string;
  speed: number;
  precision: number;
  damageRisk: number;
  unlockLevel: number;
  description: string;
  emoji: string;
  color: string;
  gemCost: number;
}

export const TOOLS: ToolDef[] = [
  { id: 'pickaxe', name: 'Pickaxe', speed: 10, precision: 2, damageRisk: 0.8, unlockLevel: 0, description: 'Fast but destructive. High risk of damaging artifacts!', emoji: '⛏️', color: '#888888', gemCost: 0 },
  { id: 'shovel', name: 'Shovel', speed: 8, precision: 3, damageRisk: 0.6, unlockLevel: 0, description: 'Good for removing bulk soil. Moderate damage risk.', emoji: '🪏', color: '#8b6914', gemCost: 0 },
  { id: 'trowel', name: 'Trowel', speed: 5, precision: 7, damageRisk: 0.2, unlockLevel: 0, description: "The archaeologist's best friend. Balanced speed & precision.", emoji: '🔧', color: '#aaaaaa', gemCost: 0 },
  { id: 'pointing-trowel', name: 'Fine Trowel', speed: 3, precision: 8, damageRisk: 0.1, unlockLevel: 1, description: 'Smaller trowel for detailed work near artifacts.', emoji: '🗡️', color: '#bbbbbb', gemCost: 10 },
  { id: 'brush', name: 'Brush', speed: 1, precision: 10, damageRisk: 0.0, unlockLevel: 0, description: 'Gently brushes away soil. Zero artifact damage.', emoji: '🖌️', color: '#cd853f', gemCost: 0 },
  { id: 'dental-pick', name: 'Dental Pick', speed: 1, precision: 10, damageRisk: 0.05, unlockLevel: 2, description: 'Extremely precise for delicate artifact extraction.', emoji: '🪡', color: '#c0c0c0', gemCost: 25 },
];

// --- PROGRESSION ---
export const PROGRESSION = {
  XP_DIG: 1,
  XP_RECORD_FIND: 5,
  XP_PERFECT_EXTRACTION: 25,
  LEVELS: [
    { name: 'Volunteer', xpRequired: 0 },
    { name: 'Field Student', xpRequired: 50 },
    { name: 'Research Assistant', xpRequired: 150 },
    { name: 'Field Archaeologist', xpRequired: 350 },
    { name: 'Site Director', xpRequired: 600 },
    { name: 'Professor', xpRequired: 1000 },
    { name: 'World Expert', xpRequired: 2000 },
  ],
};

export const SITE_UNLOCK_LEVELS: Record<string, number> = {
  'pompeii': 0,
  'giza': 1,
  'mesa-verde': 2,
  'machu-picchu': 3,
  'mohenjo-daro': 4,
};

// --- ARTIFACT DEFINITIONS ---
export interface ArtifactDef {
  id: string;
  name: string;
  description: string;
  historicalInfo: string;
  layer: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  material: string;
  date: string;
  xpValue: number;
  count: number;
  emoji: string;
}

// --- LAYER DEFINITIONS ---
export interface LayerDef {
  name: string;
  color: string;
  depth: number;
  description: string;
}

// --- SITE DEFINITIONS ---
export interface SiteInfo {
  id: string;
  name: string;
  location: string;
  period: string;
  difficulty: number;
  description: string;
  briefing: string;
  donationOrg: string;
  donationUrl: string;
  mapPosition: { x: number; y: number };
  layers: LayerDef[];
  artifacts: ArtifactDef[];
}

const ARTIFACT_EMOJIS: Record<string, string> = {
  'Ceramic': '🏺', 'Bronze': '🔔', 'Plite/Pigment': '🎨', 'Organic (carbonized)': '🍞',
  'Stone': '🪨', 'Silver': '🪙', 'Iron': '🔩', 'Glass': '🧪', 'Copper': '🔨',
  'Clay': '📜', 'Limestone': '📝', 'Organic (bone)': '🦴', 'Flint': '🗡️',
  'Steatite': '🦄', 'Terracotta': '🐂', 'Shell': '🐚', 'Fired brick': '🧱',
  'Obsidian': '🔮', 'Granite': '⚱️', 'Organic (cotton/camelid fiber)': '🧶',
  'Organic (fiber)': '🧵', 'Sandstone': '🪨', 'Bone': '🦴', 'Organic': '🌽',
};

function getArtifactEmoji(material: string): string {
  return ARTIFACT_EMOJIS[material] || '💎';
}

// --- ALL SITES ---
export const ALL_SITES: SiteInfo[] = [
  {
    id: 'pompeii',
    name: 'Pompeii',
    location: 'Campania, Italy',
    period: '79 AD (Roman)',
    difficulty: 1,
    description: 'A Roman city frozen in time by the eruption of Mount Vesuvius in 79 AD.',
    briefing: 'In 79 AD, Mount Vesuvius erupted catastrophically, burying the thriving Roman city of Pompeii under meters of volcanic ash. The city remained hidden for nearly 1,700 years until its rediscovery in 1748. Your excavation focuses on a residential insula where everyday Romans lived. Dig carefully — the artifacts here are fragile and irreplaceable!',
    donationOrg: 'UNESCO World Heritage Fund',
    donationUrl: 'https://whc.unesco.org/en/donate/',
    mapPosition: { x: 54, y: 38 },
    layers: [
      { name: 'Surface Vegetation', color: '#5a6b45', depth: 10, description: 'Modern grass and roots.' },
      { name: 'Dark Topsoil', color: '#3d2b1f', depth: 15, description: 'Centuries of accumulated soil.' },
      { name: 'Volcanic Topsoil Mix', color: '#5c4033', depth: 20, description: 'Soil mixed with volcanic material.' },
      { name: 'Compacted Earth', color: '#6b4423', depth: 25, description: 'Dense compressed earth.' },
      { name: 'Volcanic Ash', color: '#4a4a4a', depth: 30, description: 'The deadly ash from Vesuvius — 79 AD.' },
      { name: 'Charcoal/Occupation', color: '#2c2c2c', depth: 20, description: 'Burned material. Artifacts found here!' },
      { name: 'Roman Floor Level', color: '#8b7355', depth: 15, description: 'The original Roman living surface.' },
      { name: 'Stone Pavement', color: '#d2b48c', depth: 10, description: 'Roman road paving stones.' },
    ],
    artifacts: [
      { id: 'terra-sigillata', name: 'Terra Sigillata Bowl', description: 'A fine red-gloss Roman pottery bowl.', historicalInfo: 'Terra sigillata was the finest tableware of the Roman world. These red-gloss vessels were traded across the entire empire.', layer: 5, rarity: 'common', material: 'Ceramic', date: '1st century AD', xpValue: 10, count: 3, emoji: '🏺' },
      { id: 'bronze-lamp', name: 'Bronze Oil Lamp', description: 'A small bronze lamp for lighting Roman homes.', historicalInfo: 'Oil lamps were essential in Roman life. This bronze lamp burned olive oil with a linen wick.', layer: 5, rarity: 'uncommon', material: 'Bronze', date: '1st century AD', xpValue: 20, count: 2, emoji: '🔔' },
      { id: 'fresco-fragment', name: 'Fresco Fragment', description: 'Colorful painted wall plaster from a Roman house.', historicalInfo: "Roman frescoes were painted on wet plaster. Pompeii's frescoes are famous for their vivid colors.", layer: 6, rarity: 'uncommon', material: 'Plite/Pigment', date: '1st century AD', xpValue: 20, count: 2, emoji: '🎨' },
      { id: 'carbonized-bread', name: 'Carbonized Bread Loaf', description: 'A bread loaf preserved by the eruption.', historicalInfo: 'The intense heat carbonized organic materials. This shows the typical Roman panis quadratus — round bread scored into 8 wedges.', layer: 5, rarity: 'rare', material: 'Organic (carbonized)', date: '79 AD', xpValue: 50, count: 1, emoji: '🍞' },
      { id: 'roman-coin', name: 'Roman Denarius', description: 'A silver coin of Emperor Vespasian.', historicalInfo: "The denarius was worth about a day's wage. This coin shows Emperor Vespasian (69-79 AD).", layer: 5, rarity: 'rare', material: 'Silver', date: '69-79 AD', xpValue: 50, count: 1, emoji: '🪙' },
      { id: 'glass-perfume', name: 'Glass Perfume Bottle', description: 'A delicate blown glass bottle for perfume.', historicalInfo: 'Romans perfected glass-blowing techniques. This bottle held perfume or cosmetic oils.', layer: 5, rarity: 'rare', material: 'Glass', date: '1st century AD', xpValue: 50, count: 1, emoji: '🧪' },
    ],
  },
  {
    id: 'giza',
    name: "Giza Workers' Village",
    location: 'Giza Plateau, Egypt',
    period: '~2500 BCE (Old Kingdom)',
    difficulty: 2,
    description: 'The settlement where the builders of the Great Pyramids lived.',
    briefing: "In the 1990s, archaeologist Mark Lehner discovered the Workers' Village where thousands of pyramid builders lived. These weren't slaves but skilled workers who were well-fed and received medical care. Your excavation focuses on a domestic area where workers prepared food and made tools.",
    donationOrg: 'Global Heritage Fund',
    donationUrl: 'https://globalheritagefund.org/',
    mapPosition: { x: 56, y: 42 },
    layers: [
      { name: 'Surface Sand', color: '#c2b280', depth: 10, description: 'Modern windblown desert sand.' },
      { name: 'Windblown Sand', color: '#b8a070', depth: 15, description: 'Centuries of sand deposits.' },
      { name: 'Compacted Sand', color: '#a08850', depth: 20, description: 'Dense packed sand layer.' },
      { name: 'Alluvial Deposit', color: '#8b7340', depth: 25, description: 'Ancient Nile flood deposits.' },
      { name: 'Mixed Debris', color: '#7a6530', depth: 20, description: 'Construction and domestic waste.' },
      { name: 'Cultural Fill', color: '#695820', depth: 20, description: 'Rich layer of human activity.' },
      { name: 'Occupation Layer', color: '#584a10', depth: 15, description: 'Original living surface — artifacts!' },
      { name: 'Limestone Floor', color: '#d4c4a0', depth: 10, description: 'Prepared limestone foundation.' },
    ],
    artifacts: [
      { id: 'bread-mold', name: 'Ceramic Bread Mold', description: 'A bell-shaped mold for baking bread.', historicalInfo: 'Bread was the staple food for pyramid workers — thousands of loaves were baked daily.', layer: 6, rarity: 'common', material: 'Ceramic', date: '~2500 BCE', xpValue: 10, count: 3, emoji: '🏺' },
      { id: 'copper-chisel', name: 'Copper Chisel', description: 'A copper tool for stone cutting.', historicalInfo: 'Copper was the hardest metal available. Workers used copper chisels to cut limestone blocks.', layer: 5, rarity: 'uncommon', material: 'Copper', date: '~2500 BCE', xpValue: 20, count: 2, emoji: '🔨' },
      { id: 'ostracon', name: 'Limestone Ostracon', description: 'A limestone flake with hieratic writing.', historicalInfo: 'Ostraca were the Post-it notes of ancient Egypt. Workers wrote on limestone flakes because papyrus was too expensive.', layer: 6, rarity: 'rare', material: 'Limestone', date: '~2500 BCE', xpValue: 50, count: 1, emoji: '📝' },
      { id: 'miniature-statue', name: 'Worker Figurine', description: 'A small carved figurine of a worker.', historicalInfo: 'Small figurines provide rare glimpses of how the builders saw themselves.', layer: 6, rarity: 'legendary', material: 'Limestone', date: '~2500 BCE', xpValue: 50, count: 1, emoji: '🗿' },
    ],
  },
  {
    id: 'mesa-verde',
    name: 'Mesa Verde',
    location: 'Colorado, USA',
    period: '550-1300 AD (Ancestral Puebloan)',
    difficulty: 3,
    description: 'Cliff dwellings of the Ancestral Puebloan people.',
    briefing: "Mesa Verde is home to spectacular cliff dwellings in North America. For over 700 years, the Ancestral Puebloan people lived here. Your excavation site is a midden (trash dump) near a cliff dwelling. In archaeology, trash tells us more about daily life than any treasure!",
    donationOrg: 'The Archaeological Conservancy',
    donationUrl: 'https://www.archaeologicalconservancy.org/',
    mapPosition: { x: 18, y: 40 },
    layers: [
      { name: 'Surface Vegetation', color: '#6b7a52', depth: 10, description: 'Pinyon-juniper woodland.' },
      { name: 'Sandy Topsoil', color: '#8b6d4c', depth: 15, description: 'Thin topsoil layer.' },
      { name: 'Red-Brown Earth', color: '#a0522d', depth: 20, description: 'Iron-rich soil.' },
      { name: 'Sandy Clay', color: '#cd853f', depth: 25, description: 'Mixed sand and clay.' },
      { name: 'Sandstone Rubble', color: '#d2691e', depth: 20, description: 'Collapsed building material.' },
      { name: 'Occupation Debris', color: '#8b4513', depth: 20, description: 'Rich midden layer full of artifacts.' },
      { name: 'Packed Earth Floor', color: '#a0845c', depth: 15, description: 'Prepared living surface.' },
      { name: 'Sandstone Bedrock', color: '#deb887', depth: 10, description: 'Natural sandstone formation.' },
    ],
    artifacts: [
      { id: 'bw-pottery', name: 'Black-on-White Pottery', description: 'Decorated pottery with geometric designs.', historicalInfo: 'Mesa Verde black-on-white pottery is one of the most recognizable styles in Southwestern archaeology.', layer: 5, rarity: 'common', material: 'Ceramic', date: '1100-1300 AD', xpValue: 10, count: 3, emoji: '🏺' },
      { id: 'obsidian-point', name: 'Obsidian Arrowhead', description: 'A finely knapped obsidian arrowhead.', historicalInfo: 'Obsidian makes the sharpest edges in nature — sharper than surgical steel!', layer: 5, rarity: 'rare', material: 'Obsidian', date: '900-1300 AD', xpValue: 50, count: 1, emoji: '🔮' },
      { id: 'yucca-sandal', name: 'Yucca Fiber Sandal', description: 'A woven sandal from yucca plant fibers.', historicalInfo: 'Yucca sandals were standard footwear. Weaving patterns help date archaeological sites.', layer: 6, rarity: 'uncommon', material: 'Organic (fiber)', date: '600-1300 AD', xpValue: 20, count: 2, emoji: '🩴' },
      { id: 'shell-pendant', name: 'Shell Pendant', description: 'A carved shell ornament from the Pacific coast.', historicalInfo: 'This shell came from over 800 miles away, proving long-distance trade networks!', layer: 6, rarity: 'rare', material: 'Shell', date: '1000-1300 AD', xpValue: 50, count: 1, emoji: '🐚' },
    ],
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    location: 'Cusco Region, Peru',
    period: '~1450 AD (Inca Empire)',
    difficulty: 4,
    description: 'The legendary Inca citadel high in the Andes Mountains.',
    briefing: "Machu Picchu was built around 1450 AD as a royal estate for the Inca emperor Pachacuti. Perched at 2,430 meters in the Andes, this extraordinary citadel contained temples, residences, and agricultural terraces. The Inca had no writing system, so artifacts are our primary way of understanding their civilization.",
    donationOrg: 'World Monuments Fund',
    donationUrl: 'https://www.wmf.org/',
    mapPosition: { x: 24, y: 62 },
    layers: [
      { name: 'Mountain Vegetation', color: '#4a6b42', depth: 10, description: 'Cloud forest vegetation.' },
      { name: 'Dark Mountain Soil', color: '#4a3728', depth: 15, description: 'Rich organic mountain soil.' },
      { name: 'Organic-Rich Layer', color: '#5c4033', depth: 20, description: 'Decomposed vegetation.' },
      { name: 'Decomposed Granite', color: '#6b4423', depth: 25, description: 'Weathered granite fragments.' },
      { name: 'Colluvial Deposit', color: '#7a5c3a', depth: 20, description: 'Slope-washed material.' },
      { name: 'Cultural Fill', color: '#8b6d4c', depth: 20, description: 'Inca-era construction debris.' },
      { name: 'Inca Occupation', color: '#6e5c44', depth: 15, description: 'The original Inca living surface.' },
      { name: 'Granite Bedrock', color: '#999999', depth: 10, description: 'Natural granite surface.' },
    ],
    artifacts: [
      { id: 'aryballos', name: 'Aryballos Jar', description: 'An Inca vessel for carrying chicha (corn beer).', historicalInfo: 'The aryballos is the most iconic Inca ceramic form. Its pointed bottom sat securely in soft ground.', layer: 5, rarity: 'uncommon', material: 'Ceramic', date: '~1450 AD', xpValue: 20, count: 2, emoji: '🏺' },
      { id: 'quipu-fragment', name: 'Quipu Fragment', description: 'Knotted string recording device.', historicalInfo: 'The Inca developed quipus — knotted strings — to record information. Most of the code remains undeciphered.', layer: 6, rarity: 'legendary', material: 'Organic (cotton/camelid fiber)', date: '~1450 AD', xpValue: 50, count: 1, emoji: '🧶' },
      { id: 'obsidian-knife', name: 'Obsidian Ritual Knife', description: 'A ceremonial knife from volcanic obsidian.', historicalInfo: 'This ceremonial knife (tumi) was used in rituals and offerings.', layer: 5, rarity: 'rare', material: 'Obsidian', date: '~1450 AD', xpValue: 50, count: 1, emoji: '🔮' },
      { id: 'llama-figurine', name: 'Stone Llama Figurine', description: 'A small carved stone llama offering.', historicalInfo: 'Small stone llama figurines were common ritual offerings to the mountain spirits (apus).', layer: 6, rarity: 'rare', material: 'Stone', date: '~1450 AD', xpValue: 50, count: 1, emoji: '🦙' },
    ],
  },
  {
    id: 'mohenjo-daro',
    name: 'Mohenjo-daro',
    location: 'Sindh, Pakistan',
    period: '~2500-1900 BCE (Indus Valley)',
    difficulty: 5,
    description: "One of the largest cities of the ancient Indus Valley Civilization.",
    briefing: "Mohenjo-daro was one of the world's earliest major cities, home to around 40,000 people. It featured the world's first known urban sanitation system. Despite decades of study, we still cannot read the Indus script — one of archaeology's greatest unsolved puzzles.",
    donationOrg: 'UNESCO',
    donationUrl: 'https://en.unesco.org/donations',
    mapPosition: { x: 66, y: 42 },
    layers: [
      { name: 'Dry Surface', color: '#b8a070', depth: 10, description: 'Modern dry surface with salt.' },
      { name: 'Alluvial Silt', color: '#8b7340', depth: 15, description: 'Fine silt from river flooding.' },
      { name: 'Flood Deposit', color: '#7a6530', depth: 20, description: 'Periodic Indus River floods.' },
      { name: 'Mud Brick Debris', color: '#695820', depth: 25, description: 'Collapsed mud brick structures.' },
      { name: 'Upper Occupation', color: '#584a10', depth: 20, description: 'Later period of habitation.' },
      { name: 'Lower Occupation', color: '#4a3c08', depth: 20, description: 'Earlier period — richest artifacts.' },
      { name: 'Foundation Level', color: '#3d3000', depth: 15, description: 'Original building foundations.' },
      { name: 'Fired Brick Platform', color: '#c4a882', depth: 10, description: 'Prepared brick foundation.' },
    ],
    artifacts: [
      { id: 'steatite-seal', name: 'Unicorn Seal', description: 'A carved stone seal with Indus script.', historicalInfo: 'Steatite seals are the most iconic artifacts of the Indus civilization — like ancient barcodes!', layer: 5, rarity: 'rare', material: 'Steatite', date: '~2500-1900 BCE', xpValue: 50, count: 1, emoji: '🦄' },
      { id: 'indus-tablet', name: 'Indus Script Tablet', description: 'A clay tablet with undeciphered script.', historicalInfo: 'The Indus script remains one of the great unsolved mysteries of archaeology.', layer: 5, rarity: 'legendary', material: 'Clay', date: '~2500-1900 BCE', xpValue: 50, count: 1, emoji: '📜' },
      { id: 'priest-king', name: 'Priest-King Fragment', description: 'A fragment of the famous Priest-King bust.', historicalInfo: 'The Priest-King is Mohenjo-daro\'s most famous artifact. Only one original exists.', layer: 6, rarity: 'legendary', material: 'Steatite', date: '~2000 BCE', xpValue: 50, count: 1, emoji: '👑' },
      { id: 'terracotta-cart', name: 'Terracotta Cart Model', description: 'A miniature clay model of a bullock cart.', historicalInfo: 'These 4,000-year-old toy carts are almost identical to carts still used today!', layer: 5, rarity: 'uncommon', material: 'Terracotta', date: '~2500-1900 BCE', xpValue: 20, count: 2, emoji: '🐂' },
    ],
  },
];

export function getSite(id: string): SiteInfo | undefined {
  return ALL_SITES.find(s => s.id === id);
}

// --- GRID CONSTANTS ---
export const GRID_SIZE = 8;

// --- GEM PACKAGES ---
export interface GemPackage {
  id: string;
  gems: number;
  price: string;
  label: string;
  popular?: boolean;
}

export const GEM_PACKAGES: GemPackage[] = [
  { id: 'starter', gems: 50, price: '$0.99', label: 'Starter Pack' },
  { id: 'explorer', gems: 150, price: '$2.99', label: 'Explorer Pack', popular: true },
  { id: 'archaeologist', gems: 500, price: '$7.99', label: 'Archaeologist Pack' },
  { id: 'professor', gems: 1200, price: '$14.99', label: 'Professor Pack' },
];

// --- SAVE DATA ---
export interface SaveData {
  currentSite: string;
  xp: number;
  level: number;
  gems: number;
  unlockedSites: string[];
  discoveredArtifacts: { siteId: string; artifactId: string; quality: string }[];
  gridStates: Record<string, number[][]>;
  completedSites: string[];
  unlockedTools: string[];
  totalDonated: number;
}

const SAVE_KEY = 'relic_rescue_save';

export function getDefaultSave(): SaveData {
  return {
    currentSite: 'pompeii',
    xp: 0,
    level: 0,
    gems: 25,
    unlockedSites: ['pompeii'],
    discoveredArtifacts: [],
    gridStates: {},
    completedSites: [],
    unlockedTools: ['pickaxe', 'shovel', 'trowel', 'brush'],
    totalDonated: 0,
  };
}

export function saveGame(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    console.warn('Failed to save game data');
  }
}

export function loadGame(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      return { ...getDefaultSave(), ...JSON.parse(raw) };
    }
  } catch {
    console.warn('Failed to load game data');
  }
  return getDefaultSave();
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

// --- GRID CELL ---
export interface GridCellState {
  row: number;
  col: number;
  currentLayer: number;
  digProgress: number;
  isFullyExcavated: boolean;
  hasArtifact: boolean;
  artifactLayer: number;
  artifactId: string | null;
}

export interface PlacedArtifact {
  definition: ArtifactDef;
  row: number;
  col: number;
  revealed: number;
  extracted: boolean;
  damaged: boolean;
  quality: string;
}

export function gradeExtraction(revealed: number, damaged: boolean): string {
  if (damaged) return 'F';
  if (revealed >= 0.95) return 'A';
  if (revealed >= 0.8) return 'B';
  if (revealed >= 0.6) return 'C';
  if (revealed >= 0.4) return 'D';
  return 'F';
}

// --- INITIALIZE GRID ---
export function initializeGrid(site: SiteInfo): { cells: GridCellState[][]; artifacts: PlacedArtifact[] } {
  const cells: GridCellState[][] = [];
  const artifacts: PlacedArtifact[] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    cells[r] = [];
    for (let c = 0; c < GRID_SIZE; c++) {
      cells[r][c] = {
        row: r,
        col: c,
        currentLayer: 0,
        digProgress: 0,
        isFullyExcavated: false,
        hasArtifact: false,
        artifactLayer: -1,
        artifactId: null,
      };
    }
  }

  // Place artifacts randomly
  const usedPositions = new Set<string>();
  for (const artDef of site.artifacts) {
    for (let i = 0; i < artDef.count; i++) {
      let r: number, c: number, key: string;
      let attempts = 0;
      do {
        r = Math.floor(Math.random() * GRID_SIZE);
        c = Math.floor(Math.random() * GRID_SIZE);
        key = `${r},${c}`;
        attempts++;
      } while (usedPositions.has(key) && attempts < 100);

      if (!usedPositions.has(key)) {
        usedPositions.add(key);
        cells[r][c].hasArtifact = true;
        cells[r][c].artifactLayer = artDef.layer;
        cells[r][c].artifactId = artDef.id;
        artifacts.push({
          definition: artDef,
          row: r,
          col: c,
          revealed: 0,
          extracted: false,
          damaged: false,
          quality: 'C',
        });
      }
    }
  }

  return { cells, artifacts };
}

// --- DIG LOGIC ---
export interface DigResult {
  layerChanged: boolean;
  hitArtifactLayer: boolean;
  fullyExcavated: boolean;
  artifactDamaged: boolean;
  artifactExtracted: boolean;
  artifact?: PlacedArtifact;
  xpGained: number;
  gemsGained: number;
}

export function digCell(
  cell: GridCellState,
  tool: ToolDef,
  artifacts: PlacedArtifact[],
  site: SiteInfo
): DigResult | null {
  if (cell.isFullyExcavated || tool.speed === 0) return null;

  const digAmount = tool.speed * 10;
  let layerChanged = false;
  let hitArtifactLayer = false;
  let artifactDamaged = false;
  let artifactExtracted = false;
  let xpGained = PROGRESSION.XP_DIG;
  let gemsGained = 0;
  let foundArtifact: PlacedArtifact | undefined;

  // Find artifact at this cell
  const artifact = artifacts.find(a => a.row === cell.row && a.col === cell.col && !a.extracted);

  // Check damage
  if (artifact && cell.currentLayer >= cell.artifactLayer && !artifact.damaged) {
    const damageRoll = Math.random();
    if (damageRoll < tool.damageRisk * 0.3) {
      artifact.damaged = true;
      artifactDamaged = true;
    }
  }

  // Dig
  cell.digProgress += digAmount;
  while (cell.digProgress >= 100 && cell.currentLayer < site.layers.length - 1) {
    cell.digProgress -= 100;
    cell.currentLayer++;
    layerChanged = true;
    if (cell.hasArtifact && cell.currentLayer === cell.artifactLayer) {
      hitArtifactLayer = true;
    }
  }

  if (cell.currentLayer >= site.layers.length - 1) {
    cell.digProgress = 100;
    cell.isFullyExcavated = true;
  }

  // Update artifact reveal
  if (artifact && cell.currentLayer >= cell.artifactLayer) {
    const layersPast = cell.currentLayer - artifact.definition.layer;
    artifact.revealed = Math.min(1.0, (layersPast * 100 + cell.digProgress) / 200);

    if (artifact.revealed >= 1.0 && !artifact.extracted) {
      artifact.extracted = true;
      artifact.quality = gradeExtraction(artifact.revealed, artifact.damaged);
      artifactExtracted = true;
      foundArtifact = artifact;

      xpGained += artifact.definition.xpValue;
      if (artifact.quality === 'A') {
        xpGained += PROGRESSION.XP_PERFECT_EXTRACTION;
        gemsGained = 5;
      } else if (artifact.quality === 'B') {
        gemsGained = 3;
      } else if (artifact.quality === 'C') {
        gemsGained = 1;
      }
    }
  }

  return {
    layerChanged,
    hitArtifactLayer,
    fullyExcavated: cell.isFullyExcavated,
    artifactDamaged,
    artifactExtracted,
    artifact: foundArtifact,
    xpGained,
    gemsGained,
  };
}
