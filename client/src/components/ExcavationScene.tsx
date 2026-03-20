
// ============================================================
// EXCAVATION SCENE — Realistic Archaeological Dig Site v3
// Design: Immersive dig site with site-specific backgrounds,
// richly textured soil cells, dramatic dig marks, dust particles
// from clicked cell, depth shadows, rope grid borders, and
// equipment framing elements.
// ============================================================
import { useGame } from '@/contexts/GameContext';
import { SITE_BACKGROUNDS, TOOLS, GRID_SIZE, PROGRESSION } from '@/lib/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Gem, Trophy, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';

// ---- Simple seeded random for per-cell variation ----
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ---- Rich soil texture CSS patterns per layer type ----
function getSoilTexture(layerIndex: number, layerName: string, baseColor: string, cellSeed: number = 0): React.CSSProperties {
  const lName = layerName.toLowerCase();
  const r1 = seededRandom(cellSeed);
  const r2 = seededRandom(cellSeed + 1);
  const r3 = seededRandom(cellSeed + 2);
  const r4 = seededRandom(cellSeed + 3);
  const r5 = seededRandom(cellSeed + 4);
  const r6 = seededRandom(cellSeed + 5);
  const r7 = seededRandom(cellSeed + 6);
  const hueShift = (r1 - 0.5) * 25;
  const lightShift = (r2 - 0.5) * 16;
  const px1 = Math.round(r3 * 85) + 5;
  const py1 = Math.round(r4 * 85) + 5;
  const px2 = Math.round(r5 * 85) + 5;
  const py2 = Math.round(r6 * 85) + 5;
  const px3 = Math.round(r7 * 85) + 5;
  const py3 = Math.round(seededRandom(cellSeed + 7) * 85) + 5;

  // Top layer — grass/vegetation
  if (layerIndex === 0 && (lName.includes('vegetation') || lName.includes('grass') || lName.includes('mountain') || lName.includes('surface'))) {
    return {
      background: `
        radial-gradient(ellipse 3px 8px at ${px1}% ${py1 * 0.3}%, rgba(30,60,15,0.7) 0%, transparent 100%),
        radial-gradient(ellipse 2px 7px at ${px2}% ${py2 * 0.4}%, rgba(40,70,20,0.6) 0%, transparent 100%),
        radial-gradient(ellipse 2px 6px at ${px3}% ${py3 * 0.35}%, rgba(50,80,25,0.5) 0%, transparent 100%),
        radial-gradient(ellipse 4px 3px at ${100-px1}% ${70+py1*0.3}%, rgba(80,55,20,0.4) 0%, transparent 100%),
        radial-gradient(circle 3px at ${px2+5}% ${py2+10}%, rgba(60,40,15,0.3) 0%, transparent 100%),
        radial-gradient(circle 1.5px at ${px3}% ${py3}%, rgba(200,180,100,0.15) 0%, transparent 100%),
        linear-gradient(${170 + hueShift}deg, ${baseColor} 0%, ${baseColor}cc 100%)
      `,
      filter: `brightness(${96 + lightShift}%)`,
    };
  }

  // Sand layers
  if (lName.includes('sand') || lName.includes('dry surface') || lName.includes('windblown') || lName.includes('alluvial') || lName.includes('silt')) {
    return {
      background: `
        radial-gradient(circle 1.5px at ${px1}% ${py1}%, rgba(255,255,255,0.25) 0%, transparent 100%),
        radial-gradient(circle 1px at ${px2}% ${py2}%, rgba(255,255,255,0.2) 0%, transparent 100%),
        radial-gradient(circle 2px at ${px3}% ${py3}%, rgba(0,0,0,0.12) 0%, transparent 100%),
        radial-gradient(circle 1px at ${100-px1}% ${100-py1}%, rgba(0,0,0,0.08) 0%, transparent 100%),
        radial-gradient(ellipse 6px 2px at ${px2}% ${py2+20}%, rgba(0,0,0,0.06) 0%, transparent 100%),
        linear-gradient(${135 + hueShift}deg, ${baseColor} 0%, ${baseColor}dd 50%, ${baseColor}cc 100%)
      `,
      filter: `brightness(${98 + lightShift}%)`,
    };
  }

  // Rock/stone/bedrock/floor layers
  if (lName.includes('stone') || lName.includes('bedrock') || lName.includes('limestone') || lName.includes('granite') || lName.includes('brick') || lName.includes('pavement') || lName.includes('floor') || lName.includes('platform') || lName.includes('foundation')) {
    return {
      background: `
        linear-gradient(${30 + hueShift}deg, transparent 40%, rgba(255,255,255,0.1) 41%, rgba(255,255,255,0.1) 42%, transparent 43%),
        linear-gradient(${-60 + hueShift}deg, transparent 55%, rgba(0,0,0,0.12) 56%, rgba(0,0,0,0.12) 57%, transparent 58%),
        linear-gradient(${90 + hueShift}deg, transparent 70%, rgba(0,0,0,0.06) 71%, rgba(0,0,0,0.06) 72%, transparent 73%),
        radial-gradient(circle 4px at ${px1}% ${py1}%, rgba(255,255,255,0.08) 0%, transparent 100%),
        radial-gradient(circle 3px at ${px2}% ${py2}%, rgba(0,0,0,0.1) 0%, transparent 100%),
        linear-gradient(180deg, ${baseColor}ee 0%, ${baseColor} 50%, ${baseColor}dd 100%)
      `,
      filter: `brightness(${97 + lightShift}%)`,
    };
  }

  // Clay/compacted layers
  if (lName.includes('clay') || lName.includes('compacted') || lName.includes('packed') || lName.includes('mud')) {
    return {
      background: `
        repeating-linear-gradient(${hueShift}deg, transparent, transparent 4px, rgba(0,0,0,0.07) 4px, rgba(0,0,0,0.07) 5px),
        repeating-linear-gradient(${90 + hueShift}deg, transparent, transparent 7px, rgba(0,0,0,0.04) 7px, rgba(0,0,0,0.04) 8px),
        radial-gradient(circle 3px at ${px1}% ${py1}%, rgba(0,0,0,0.12) 0%, transparent 100%),
        radial-gradient(circle 2px at ${px2}% ${py2}%, rgba(255,255,255,0.05) 0%, transparent 100%),
        linear-gradient(180deg, ${baseColor} 0%, ${baseColor}dd 100%)
      `,
      filter: `brightness(${97 + lightShift}%)`,
    };
  }

  // Volcanic/ash/charcoal layers
  if (lName.includes('volcanic') || lName.includes('ash') || lName.includes('charcoal')) {
    return {
      background: `
        radial-gradient(circle 4px at ${px1}% ${py1}%, rgba(120,120,120,0.4) 0%, transparent 100%),
        radial-gradient(circle 3px at ${px2}% ${py2}%, rgba(90,90,90,0.35) 0%, transparent 100%),
        radial-gradient(circle 2px at ${px3}% ${py3}%, rgba(70,70,70,0.3) 0%, transparent 100%),
        radial-gradient(circle 5px at ${100-px1}% ${100-py1}%, rgba(50,50,50,0.2) 0%, transparent 100%),
        linear-gradient(${180 + hueShift}deg, ${baseColor} 0%, ${baseColor}dd 100%)
      `,
      filter: `brightness(${96 + lightShift}%)`,
    };
  }

  // Rubble/debris/occupation/cultural layers
  if (lName.includes('rubble') || lName.includes('debris') || lName.includes('mixed') || lName.includes('occupation') || lName.includes('cultural') || lName.includes('fill') || lName.includes('deposit') || lName.includes('colluvial')) {
    return {
      background: `
        radial-gradient(ellipse 6px 4px at ${px1}% ${py1}%, rgba(0,0,0,0.18) 0%, transparent 100%),
        radial-gradient(ellipse 4px 6px at ${px2}% ${py2}%, rgba(0,0,0,0.15) 0%, transparent 100%),
        radial-gradient(ellipse 3px 3px at ${px3}% ${py3}%, rgba(255,255,255,0.06) 0%, transparent 100%),
        radial-gradient(circle 2px at ${100-px2}% ${100-py2}%, rgba(0,0,0,0.1) 0%, transparent 100%),
        linear-gradient(${180 + hueShift}deg, ${baseColor} 0%, ${baseColor}cc 100%)
      `,
      filter: `brightness(${96 + lightShift}%)`,
    };
  }

  // Default soil/earth/topsoil
  return {
    background: `
      radial-gradient(circle 3px at ${px1}% ${py1}%, rgba(0,0,0,0.15) 0%, transparent 100%),
      radial-gradient(circle 2px at ${px2}% ${py2}%, rgba(0,0,0,0.1) 0%, transparent 100%),
      radial-gradient(circle 2px at ${px3}% ${py3}%, rgba(255,255,255,0.05) 0%, transparent 100%),
      radial-gradient(circle 1.5px at ${100-px1}% ${100-py1}%, rgba(0,0,0,0.08) 0%, transparent 100%),
      linear-gradient(${180 + hueShift}deg, ${baseColor} 0%, ${baseColor}dd 100%)
    `,
    filter: `brightness(${97 + lightShift}%)`,
  };
}

// ---- Dust particle that flies from the clicked cell ----
function DustCloud({ cellRef, color }: { cellRef: DOMRect; color: string }) {
  const particles = useMemo(() =>
    Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 120,
      dy: -(Math.random() * 70 + 20),
      size: Math.random() * 10 + 3,
      delay: Math.random() * 0.15,
      rotation: Math.random() * 360,
      shape: Math.random(),
    })), []);

  return (
    <div
      className="fixed pointer-events-none z-[100]"
      style={{
        left: cellRef.left + cellRef.width / 2,
        top: cellRef.top + cellRef.height / 2,
      }}
    >
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 0.95, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy, scale: 0, opacity: 0, rotate: p.rotation }}
          transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
          className="absolute"
          style={{
            width: p.size,
            height: p.size * (p.shape > 0.5 ? 0.7 : 1),
            backgroundColor: color,
            borderRadius: p.shape > 0.7 ? '50%' : p.shape > 0.4 ? '30%' : '15%',
            boxShadow: `0 0 4px ${color}55`,
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
        />
      ))}
    </div>
  );
}

// ---- Dig mark overlay for partially excavated cells ----
function DigMarks({ layer, digProgress, row, col }: { layer: number; digProgress: number; row: number; col: number }) {
  if (layer === 0 && digProgress === 0) return null;
  const seed = row * 100 + col;
  const angle1 = 15 + seededRandom(seed) * 50;
  const angle2 = -25 + seededRandom(seed + 10) * 60;
  const angle3 = 40 + seededRandom(seed + 20) * 30;
  const angle4 = -10 + seededRandom(seed + 30) * 40;
  const depth = Math.min(layer, 5);
  const progressFactor = digProgress / 100;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm">
      {/* Primary scratch marks — wider and more visible */}
      <div className="absolute inset-0" style={{
        background: `
          linear-gradient(${angle1}deg, transparent 33%, rgba(0,0,0,${0.15 + depth * 0.06}) 34%, rgba(0,0,0,${0.12 + depth * 0.05}) 36%, transparent 37%),
          linear-gradient(${angle2}deg, transparent 48%, rgba(0,0,0,${0.12 + depth * 0.05}) 49%, rgba(0,0,0,${0.1 + depth * 0.04}) 51%, transparent 52%),
          linear-gradient(${angle3}deg, transparent 62%, rgba(0,0,0,${0.1 + depth * 0.04}) 63%, rgba(0,0,0,${0.08 + depth * 0.03}) 65%, transparent 66%),
          linear-gradient(${angle4}deg, transparent 72%, rgba(0,0,0,${0.08 + depth * 0.03}) 73%, transparent 75%)
        `,
      }} />

      {/* Top edge shadow (depth illusion) — gets deeper with more layers */}
      <div className="absolute top-0 left-0 right-0" style={{
        height: `${Math.min(depth * 5 + progressFactor * 4, 22)}px`,
        background: `linear-gradient(180deg, rgba(0,0,0,${0.2 + depth * 0.08}) 0%, transparent 100%)`,
      }} />

      {/* Left edge shadow */}
      <div className="absolute top-0 left-0 bottom-0" style={{
        width: `${Math.min(depth * 3 + progressFactor * 2, 12)}px`,
        background: `linear-gradient(90deg, rgba(0,0,0,${0.12 + depth * 0.05}) 0%, transparent 100%)`,
      }} />

      {/* Right edge light (highlight) */}
      <div className="absolute top-0 right-0 bottom-0" style={{
        width: `${Math.min(depth * 2, 6)}px`,
        background: `linear-gradient(270deg, rgba(255,255,255,${0.04 + depth * 0.01}) 0%, transparent 100%)`,
      }} />

      {/* Pebble/debris spots for deeper layers */}
      {depth >= 2 && (
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle 2.5px at ${25 + seededRandom(seed+20)*50}% ${15 + seededRandom(seed+21)*70}%, rgba(0,0,0,0.15) 0%, transparent 100%),
            radial-gradient(circle 2px at ${45 + seededRandom(seed+22)*35}% ${35 + seededRandom(seed+23)*45}%, rgba(0,0,0,0.12) 0%, transparent 100%),
            radial-gradient(circle 1.5px at ${60 + seededRandom(seed+24)*25}% ${60 + seededRandom(seed+25)*30}%, rgba(0,0,0,0.1) 0%, transparent 100%)
          `,
        }} />
      )}

      {/* Crumbled edge effect for deeper digs */}
      {depth >= 3 && (
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 8px 3px at ${seededRandom(seed+30)*60+20}% 3%, rgba(0,0,0,0.2) 0%, transparent 100%),
            radial-gradient(ellipse 3px 8px at 3% ${seededRandom(seed+31)*60+20}%, rgba(0,0,0,0.15) 0%, transparent 100%)
          `,
        }} />
      )}
    </div>
  );
}

export default function ExcavationScene() {
  const {
    setScreen, currentSite, cells, artifacts, selectedTool, selectTool,
    handleDig, save, discoveryPopup, closeDiscovery, damagePopup, clearDamage,
    hintPopup, clearHint, levelUpPopup, closeLevelUp, getExcavationProgress,
  } = useGame();

  const [dustClouds, setDustClouds] = useState<{ id: number; rect: DOMRect; color: string }[]>([]);
  const [clickedCell, setClickedCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [showMobileArtifacts, setShowMobileArtifacts] = useState(false);
  const dustId = useRef(0);
  const completionShown = useRef(false);

  if (!currentSite) return null;

  const siteBackground = SITE_BACKGROUNDS[currentSite.id] || '';
  const availableTools = TOOLS.filter(t => save.unlockedTools.includes(t.id) && t.speed > 0);
  const progress = getExcavationProgress();
  const levelName = PROGRESSION.LEVELS[Math.min(save.level, PROGRESSION.LEVELS.length - 1)].name;
  const extractedArtifacts = artifacts.filter(a => a.extracted);
  const totalArtifacts = artifacts.length;
  const perfectCount = extractedArtifacts.filter(a => a.quality === 'A').length;
  const damagedCount = extractedArtifacts.filter(a => a.damaged).length;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const onCellClick = useCallback((row: number, col: number, e: React.MouseEvent) => {
    const cell = cells[row]?.[col];
    if (!cell || cell.isFullyExcavated) return;

    const cellEl = e.currentTarget as HTMLElement;
    const rect = cellEl.getBoundingClientRect();
    const layer = currentSite.layers[cell.currentLayer];
    const newId = dustId.current++;
    setDustClouds(prev => [...prev, { id: newId, rect, color: layer?.color || '#8b6914' }]);
    setTimeout(() => {
      setDustClouds(prev => prev.filter(d => d.id !== newId));
    }, 900);

    setClickedCell({ row, col });
    setTimeout(() => setClickedCell(null), 300);

    handleDig(row, col);
  }, [cells, currentSite, handleDig]);

  // Confetti on artifact discovery
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (discoveryPopup) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF'],
      });
    }
  }, [discoveryPopup]);

  // Site completion check
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (progress >= 100 && !completionShown.current && !discoveryPopup && !levelUpPopup) {
      completionShown.current = true;
      setTimeout(() => {
        setShowCompletion(true);
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.4 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF', '#9B59B6'],
        });
      }, 500);
    }
  }, [progress, discoveryPopup, levelUpPopup]);

  // Auto-dismiss damage popup
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (damagePopup) {
      const t = setTimeout(clearDamage, 2000);
      return () => clearTimeout(t);
    }
  }, [damagePopup, clearDamage]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (hintPopup) {
      const t = setTimeout(clearHint, 3000);
      return () => clearTimeout(t);
    }
  }, [hintPopup, clearHint]);

  const getCellTexture = (row: number, col: number): React.CSSProperties => {
    const cell = cells[row]?.[col];
    if (!cell) return {};
    const layerIdx = cell.isFullyExcavated ? currentSite.layers.length - 1 : cell.currentLayer;
    const layer = currentSite.layers[layerIdx];
    if (!layer) return {};
    const cellSeed = row * GRID_SIZE + col + layerIdx * 100;
    return getSoilTexture(layerIdx, layer.name, layer.color, cellSeed);
  };

  const getCellArtifact = (row: number, col: number) => {
    return artifacts.find(a => a.row === row && a.col === col && !a.extracted && a.revealed > 0);
  };

  const hoveredCellData = hoveredCell ? cells[hoveredCell.row]?.[hoveredCell.col] : null;

  // Responsive cell size
  const cellSize = 'clamp(36px, 6.5vw, 52px)';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Site-specific background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${siteBackground})` }}
      />
      {/* Atmospheric overlay — darker at bottom for depth feel */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.45) 30%, rgba(15,10,5,0.6) 70%, rgba(15,10,5,0.75) 100%)',
      }} />

      {/* Top HUD */}
      <div className="relative z-20 bg-gradient-to-r from-[#2a1a0a]/90 to-[#1a0f05]/90 backdrop-blur-sm border-b-2 border-amber-800/50 py-2 px-3 flex items-center justify-between"
        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => setScreen('worldMap')} className="text-amber-300 hover:text-amber-200 transition-colors p-1 rounded-lg hover:bg-amber-900/30">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-sm font-bold text-amber-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {currentSite.name}
            </div>
            <div className="text-[10px] text-amber-400/60">
              {currentSite.location} · {currentSite.period}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-amber-900/60 text-amber-300 px-2.5 py-1 rounded-full text-[10px] font-bold border border-amber-700/40">
            Lvl {save.level + 1}
          </span>
          <div className="flex items-center gap-1 bg-cyan-900/30 px-2 py-1 rounded-full border border-cyan-700/30">
            <Gem className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold text-xs">{save.gems}</span>
          </div>
          <button
            onClick={() => setShowMobileArtifacts(!showMobileArtifacts)}
            className="md:hidden bg-amber-700/30 text-amber-300 px-2 py-1 rounded text-[10px] font-bold border border-amber-700/30"
          >
            🏺 {extractedArtifacts.length}/{totalArtifacts}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-20 bg-black/40 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-400/70 font-bold uppercase tracking-wider">Excavation</span>
          <div className="flex-1 h-3 bg-black/50 rounded-full overflow-hidden border border-amber-700/25"
            style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)' }}
          >
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                background: progress >= 100
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : 'linear-gradient(90deg, #92400e, #d97706, #f59e0b)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              {/* Shimmer effect on progress bar */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                animation: 'shimmer 2s infinite',
              }} />
            </motion.div>
          </div>
          <span className="text-[10px] text-amber-300 font-bold min-w-[32px] text-right">{progress}%</span>
        </div>
      </div>

      {/* Mobile Artifacts Panel */}
      <AnimatePresence>
        {showMobileArtifacts && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-20 md:hidden bg-black/70 backdrop-blur-sm border-b border-amber-700/30 overflow-hidden"
          >
            <div className="p-3">
              <div className="text-xs text-amber-400 font-bold mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Artifacts ({extractedArtifacts.length}/{totalArtifacts})
              </div>
              {extractedArtifacts.length === 0 ? (
                <div className="text-[10px] text-amber-200/40 italic">None yet — keep digging!</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {extractedArtifacts.map((a, i) => (
                    <div key={i} className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded text-[10px] border border-amber-700/20">
                      <span>{a.definition.emoji}</span>
                      <span className={a.damaged ? 'text-red-400' : 'text-amber-200'}>{a.definition.name}</span>
                      <span className={`font-bold ${
                        a.quality === 'A' ? 'text-green-400' :
                        a.quality === 'B' ? 'text-blue-400' :
                        a.quality === 'F' ? 'text-red-400' : 'text-amber-400'
                      }`}>{a.quality}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Game Area */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-2 p-2 overflow-hidden">
        {/* Left sidebar — Depth indicator (desktop) */}
        <div className="hidden md:flex flex-col items-center gap-1 w-20 shrink-0">
          <span className="text-[10px] text-amber-400/70 font-bold uppercase tracking-wider">Depth</span>
          <div className="flex-1 w-12 rounded-lg overflow-hidden border-2 border-amber-800/50" style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5), 0 2px 10px rgba(0,0,0,0.3)' }}>
            {currentSite.layers.map((layer, i) => {
              const isActive = hoveredCellData && hoveredCellData.currentLayer === i;
              return (
                <div
                  key={i}
                  className="w-full relative group"
                  style={{
                    ...getSoilTexture(i, layer.name, layer.color, i * 50),
                    height: `${100 / currentSite.layers.length}%`,
                    borderBottom: i < currentSite.layers.length - 1 ? '1px solid rgba(0,0,0,0.25)' : 'none',
                  }}
                  title={`${layer.name} (${layer.depth}cm)`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="depth-indicator"
                      className="absolute inset-0 border-2 border-amber-400 z-10"
                      style={{ boxShadow: '0 0 10px rgba(255,215,0,0.5), inset 0 0 10px rgba(255,215,0,0.15)' }}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[7px] text-white font-bold bg-black/70 px-1.5 py-0.5 rounded">{layer.name.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {hoveredCellData && (
            <div className="text-center mt-1 bg-black/60 rounded-lg px-2 py-1.5 border border-amber-700/25 backdrop-blur-sm">
              <div className="text-[10px] text-amber-300 font-bold">
                {String.fromCharCode(65 + (hoveredCell?.col || 0))}{(hoveredCell?.row || 0) + 1}
              </div>
              <div className="text-[8px] text-amber-400/60 mt-0.5">
                {currentSite.layers[hoveredCellData.currentLayer]?.name}
              </div>
              <div className="text-[8px] text-amber-400/40">
                Dig: {hoveredCellData.digProgress}%
              </div>
            </div>
          )}
        </div>

        {/* Center — The Dig Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Outer rope border frame */}
            <div
              className="absolute -inset-5 rounded-xl pointer-events-none"
              style={{
                border: '6px solid transparent',
                borderImage: 'repeating-linear-gradient(90deg, #7a5c2e 0px, #a0845c 3px, #5a3c18 6px, #8b6914 9px, #6b4423 12px) 6',
                boxShadow: '0 0 40px rgba(0,0,0,0.7), inset 0 0 40px rgba(0,0,0,0.5)',
              }}
            />
            {/* Inner rope border */}
            <div
              className="absolute -inset-2 rounded-lg pointer-events-none"
              style={{
                border: '2px dashed rgba(139,105,20,0.4)',
              }}
            />

            {/* Corner stakes with wood texture */}
            {[
              { pos: '-top-6 -left-6', shadow: '3px 3px' },
              { pos: '-top-6 -right-6', shadow: '-3px 3px' },
              { pos: '-bottom-6 -left-6', shadow: '3px -3px' },
              { pos: '-bottom-6 -right-6', shadow: '-3px -3px' },
            ].map((stake, i) => (
              <div key={i} className={`absolute ${stake.pos} w-7 h-7 rounded-full z-10`} style={{
                background: 'radial-gradient(circle at 30% 30%, #d4a860, #a07830 40%, #6b4423 80%, #4a2c10)',
                border: '2px solid #5a3c18',
                boxShadow: `${stake.shadow} 8px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,255,255,0.15)`,
              }} />
            ))}

            {/* Equipment decoration — small shovel icon top-left */}
            <div className="absolute -top-10 -left-10 text-2xl opacity-60 pointer-events-none transform -rotate-45">🪏</div>
            {/* Rope coil bottom-right */}
            <div className="absolute -bottom-10 -right-10 text-2xl opacity-50 pointer-events-none">🪢</div>

            {/* Column labels */}
            <div className="flex mb-2 ml-8">
              {Array.from({ length: GRID_SIZE }).map((_, c) => (
                <div key={c} className="text-center text-xs text-amber-200 font-mono font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" style={{ width: cellSize }}>
                  {String.fromCharCode(65 + c)}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Row labels */}
              <div className="flex flex-col mr-2 justify-around">
                {Array.from({ length: GRID_SIZE }).map((_, r) => (
                  <div key={r} className="text-xs text-amber-200 font-mono font-bold flex items-center justify-center w-6 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]" style={{ height: cellSize }}>
                    {r + 1}
                  </div>
                ))}
              </div>

              {/* Grid cells — rope-like gap between cells */}
              <div
                className="grid relative"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize})`,
                  gap: '3px',
                  padding: '4px',
                  background: `
                    repeating-linear-gradient(0deg, rgba(139,105,20,0.3) 0px, rgba(100,70,20,0.2) 1px, transparent 2px, transparent ${cellSize}),
                    repeating-linear-gradient(90deg, rgba(139,105,20,0.3) 0px, rgba(100,70,20,0.2) 1px, transparent 2px, transparent ${cellSize}),
                    linear-gradient(135deg, rgba(80,55,20,0.5), rgba(50,30,10,0.6))
                  `,
                  borderRadius: '6px',
                  boxShadow: 'inset 0 3px 12px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.4)',
                }}
              >
                {Array.from({ length: GRID_SIZE }).map((_, row) =>
                  Array.from({ length: GRID_SIZE }).map((_, col) => {
                    const cell = cells[row]?.[col];
                    const cellArtifact = getCellArtifact(row, col);
                    const isClicked = clickedCell?.row === row && clickedCell?.col === col;
                    const isHovered = hoveredCell?.row === row && hoveredCell?.col === col;
                    const isExcavated = cell?.isFullyExcavated;
                    const currentLayer = cell?.currentLayer || 0;
                    const depthShadow = Math.min(currentLayer * 4, 18);
                    const digProg = cell?.digProgress || 0;

                    return (
                      <motion.button
                        key={`${row}-${col}`}
                        animate={isClicked ? { scale: [1, 0.82, 1.06, 1] } : {}}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => onCellClick(row, col, e)}
                        onMouseEnter={() => setHoveredCell({ row, col })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`relative overflow-hidden transition-all duration-150 ${
                          isExcavated
                            ? 'cursor-default'
                            : 'cursor-pointer hover:brightness-110 active:brightness-90'
                        }`}
                        style={{
                          ...getCellTexture(row, col),
                          width: cellSize,
                          height: cellSize,
                          borderRadius: '2px',
                          boxShadow: isHovered && !isExcavated
                            ? `inset 0 0 0 2px rgba(255,215,0,0.8), 0 0 14px rgba(255,215,0,0.5), inset 0 ${depthShadow}px ${depthShadow * 2}px rgba(0,0,0,0.4)`
                            : isExcavated
                            ? `inset 0 4px 12px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(255,255,255,0.03)`
                            : `inset 0 ${depthShadow}px ${depthShadow * 2}px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2)`,
                        }}
                      >
                        {/* Dig marks for partially excavated cells */}
                        {cell && (currentLayer > 0 || digProg > 0) && !isExcavated && (
                          <DigMarks layer={currentLayer} digProgress={digProg} row={row} col={col} />
                        )}

                        {/* Excavated cell — show bedrock/stone texture with depth */}
                        {isExcavated && (
                          <div className="absolute inset-0 pointer-events-none">
                            {/* Stone/bedrock texture pattern */}
                            <div className="absolute inset-0" style={{
                              background: `
                                linear-gradient(${45 + seededRandom(row * 8 + col) * 30}deg, transparent 30%, rgba(255,255,255,0.06) 31%, rgba(255,255,255,0.06) 32%, transparent 33%),
                                linear-gradient(${-30 + seededRandom(row * 8 + col + 5) * 40}deg, transparent 55%, rgba(0,0,0,0.08) 56%, rgba(0,0,0,0.08) 57%, transparent 58%),
                                radial-gradient(circle 4px at ${30 + seededRandom(row * 8 + col + 10) * 40}% ${30 + seededRandom(row * 8 + col + 11) * 40}%, rgba(0,0,0,0.12) 0%, transparent 100%),
                                radial-gradient(circle 3px at ${60 + seededRandom(row * 8 + col + 12) * 30}% ${60 + seededRandom(row * 8 + col + 13) * 30}%, rgba(255,255,255,0.05) 0%, transparent 100%)
                              `,
                            }} />
                            {/* Deep shadow at top and left edges — deeper for excavated */}
                            <div className="absolute top-0 left-0 right-0 h-4" style={{
                              background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
                            }} />
                            <div className="absolute top-0 left-0 bottom-0 w-3" style={{
                              background: 'linear-gradient(90deg, rgba(0,0,0,0.35) 0%, transparent 100%)',
                            }} />
                            {/* Bottom-right highlight for 3D depth */}
                            <div className="absolute bottom-0 right-0 left-0 h-1" style={{
                              background: 'linear-gradient(0deg, rgba(255,255,255,0.06) 0%, transparent 100%)',
                            }} />
                            <div className="absolute top-0 right-0 bottom-0 w-1" style={{
                              background: 'linear-gradient(270deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
                            }} />
                            {/* Subtle checkmark */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center border border-white/10">
                                <span className="text-[9px] text-white/25 font-bold">✓</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Artifact glow */}
                        {cellArtifact && (
                          <motion.div
                            animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                          >
                            <div className="relative">
                              <span className="text-xl drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]">
                                {cellArtifact.damaged ? '💔' : '✨'}
                              </span>
                              {!cellArtifact.damaged && (
                                <>
                                  <div className="absolute -inset-3 rounded-full animate-ping" style={{
                                    background: 'radial-gradient(circle, rgba(255,215,0,0.4) 0%, transparent 70%)',
                                  }} />
                                  <div className="absolute -inset-1 rounded-full" style={{
                                    background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)',
                                  }} />
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Hover tooltip */}
                        {isHovered && !isExcavated && cell && (
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/95 text-amber-300 text-[8px] px-2.5 py-1 rounded-lg whitespace-nowrap pointer-events-none z-30 border border-amber-700/50 shadow-lg"
                            style={{ fontFamily: "'Fredoka', sans-serif" }}
                          >
                            L{currentLayer + 1} · {cell.digProgress}%
                          </div>
                        )}
                      </motion.button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar — Info Panel (desktop) */}
        <div className="hidden md:flex flex-col w-52 shrink-0 gap-2">
          {/* Hover info */}
          {hoveredCellData ? (
            <div className="bg-black/65 backdrop-blur-sm rounded-lg p-3 border border-amber-700/35"
              style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
            >
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-300 font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Cell {String.fromCharCode(65 + (hoveredCell?.col || 0))}{(hoveredCell?.row || 0) + 1}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded border border-amber-700/30 shrink-0"
                  style={{
                    ...getCellTexture(hoveredCell!.row, hoveredCell!.col),
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                />
                <div>
                  <div className="text-[10px] text-amber-200 font-bold">{currentSite.layers[hoveredCellData.currentLayer]?.name}</div>
                  <div className="text-[9px] text-amber-400/50 leading-tight">{currentSite.layers[hoveredCellData.currentLayer]?.description}</div>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-[9px]">
                <span className="text-amber-400/60">Layer {hoveredCellData.currentLayer + 1}/{currentSite.layers.length}</span>
                <span className="text-amber-400/60">Dig: {hoveredCellData.digProgress}%</span>
              </div>
              {/* Mini progress bar for this cell */}
              <div className="mt-1.5 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500/60 rounded-full transition-all" style={{
                  width: `${((hoveredCellData.currentLayer * 100 + hoveredCellData.digProgress) / (currentSite.layers.length * 100)) * 100}%`,
                }} />
              </div>
            </div>
          ) : (
            <div className="bg-black/65 backdrop-blur-sm rounded-lg p-3 border border-amber-700/35">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400/50" />
                <span className="text-xs text-amber-400/50">Hover a cell to inspect</span>
              </div>
            </div>
          )}

          {/* Soil Layers collapsible */}
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="bg-black/65 backdrop-blur-sm rounded-lg p-2.5 border border-amber-700/35 flex items-center justify-between text-xs text-amber-400 font-bold hover:bg-black/75 transition-colors"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            <span>🪨 Soil Layers</span>
            {showLayerPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <AnimatePresence>
            {showLayerPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-black/65 backdrop-blur-sm rounded-lg p-2.5 border border-amber-700/35 space-y-1.5">
                  {currentSite.layers.map((layer, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px]">
                      <div className="w-5 h-5 rounded-sm border border-amber-700/25 shrink-0"
                        style={{
                          ...getSoilTexture(i, layer.name, layer.color, i * 50),
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
                        }}
                      />
                      <span className="text-amber-200/80 truncate">{layer.name}</span>
                      <span className="text-amber-400/40 ml-auto">{layer.depth}cm</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Artifacts Found */}
          <div className="bg-black/65 backdrop-blur-sm rounded-lg p-3 border border-amber-700/35 flex-1 overflow-y-auto"
            style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
          >
            <div className="text-xs text-amber-400 font-bold mb-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              🏺 Artifacts ({extractedArtifacts.length}/{totalArtifacts})
            </div>
            {extractedArtifacts.length === 0 ? (
              <div className="text-[10px] text-amber-200/40 italic">None yet — keep digging!</div>
            ) : (
              <div className="space-y-1.5">
                {extractedArtifacts.map((a, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] bg-black/30 rounded-lg px-2 py-1.5 border border-amber-700/15 hover:border-amber-700/30 transition-colors">
                    <span className="text-sm">{a.definition.emoji}</span>
                    <span className={`truncate ${a.damaged ? 'text-red-400 line-through' : 'text-amber-200'}`}>{a.definition.name}</span>
                    <span className={`ml-auto font-bold shrink-0 ${
                      a.quality === 'A' ? 'text-green-400' :
                      a.quality === 'B' ? 'text-blue-400' :
                      a.quality === 'F' ? 'text-red-400' : 'text-amber-400'
                    }`}>{a.quality}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="relative z-20 bg-gradient-to-r from-[#2a1a0a]/90 to-[#1a0f05]/90 backdrop-blur-sm border-t-2 border-amber-800/50 py-3 px-3"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.5)' }}
      >
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {availableTools.map(tool => (
            <motion.button
              key={tool.id}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => selectTool(tool.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-2.5 rounded-xl transition-all ${
                selectedTool.id === tool.id
                  ? 'bg-amber-800/60 border-2 border-amber-400 shadow-[0_0_24px_rgba(255,215,0,0.4)]'
                  : 'bg-black/40 border-2 border-amber-900/40 hover:border-amber-700/50 hover:bg-black/50'
              }`}
              style={selectedTool.id === tool.id ? {
                background: 'linear-gradient(180deg, rgba(120,80,20,0.6) 0%, rgba(80,50,10,0.7) 100%)',
              } : undefined}
            >
              <span className="text-2xl">{tool.emoji}</span>
              <span className={`text-[9px] font-bold ${selectedTool.id === tool.id ? 'text-amber-200' : 'text-amber-300/60'}`}
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                {tool.name}
              </span>
              {selectedTool.id === tool.id && (
                <div className="flex gap-1.5 mt-0.5">
                  <span className="text-[7px] text-green-400 bg-green-900/40 px-1.5 rounded-full font-bold">Spd {tool.speed}</span>
                  <span className="text-[7px] text-blue-400 bg-blue-900/40 px-1.5 rounded-full font-bold">Pre {tool.precision}</span>
                  <span className="text-[7px] text-red-400 bg-red-900/40 px-1.5 rounded-full font-bold">Dmg {Math.round(tool.damageRisk * 100)}%</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Dust clouds — rendered at fixed position from cell rect */}
      {dustClouds.map(d => (
        <DustCloud key={d.id} cellRef={d.rect} color={d.color} />
      ))}

      {/* Damage Warning Popup */}
      <AnimatePresence>
        {damagePopup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-red-900/90 backdrop-blur-sm text-red-200 px-5 py-3 rounded-xl border-2 border-red-500 z-50 flex items-center gap-2 shadow-[0_0_30px_rgba(255,0,0,0.4)]"
          >
            <span className="text-2xl">💥</span>
            <div>
              <span className="font-bold text-sm block" style={{ fontFamily: "'Fredoka', sans-serif" }}>ARTIFACT DAMAGED!</span>
              <span className="text-[10px] text-red-300/70">Switch to finer tools near artifacts!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Popup */}
      <AnimatePresence>
        {hintPopup && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-amber-900/90 backdrop-blur-sm text-amber-200 px-5 py-3 rounded-xl border-2 border-amber-500 z-50 flex items-center gap-2 shadow-[0_0_30px_rgba(255,215,0,0.4)]"
          >
            <span className="text-2xl">✨</span>
            <div>
              <span className="font-bold text-sm block" style={{ fontFamily: "'Fredoka', sans-serif" }}>{hintPopup.text}</span>
              <span className="text-[10px] text-amber-300/70">Use the Brush or Fine Trowel for best results!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery Popup */}
      <AnimatePresence>
        {discoveryPopup && !showCompletion && !levelUpPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeDiscovery}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-b from-amber-900/95 to-[#1a0f0a]/95 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full border-2 border-amber-500/50 shadow-[0_0_60px_rgba(255,215,0,0.3)]"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <span className="text-7xl">{discoveryPopup.definition.emoji}</span>
              </motion.div>

              <h2 className="text-2xl font-bold text-amber-300 text-center mt-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                ARTIFACT DISCOVERED!
              </h2>

              <h3 className="text-lg text-amber-200 text-center mt-1" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {discoveryPopup.definition.name}
              </h3>

              <div className="text-center mt-3">
                <span className={`text-sm font-bold px-4 py-1.5 rounded-full inline-block ${
                  discoveryPopup.damaged ? 'bg-red-900/60 text-red-400 border border-red-500/30' :
                  discoveryPopup.quality === 'A' ? 'bg-green-900/60 text-green-400 border border-green-500/30' :
                  discoveryPopup.quality === 'B' ? 'bg-blue-900/60 text-blue-400 border border-blue-500/30' :
                  'bg-amber-900/60 text-amber-400 border border-amber-500/30'
                }`}>
                  Grade: {discoveryPopup.quality} {discoveryPopup.damaged ? '(DAMAGED)' : discoveryPopup.quality === 'A' ? '★ PERFECT' : ''}
                </span>
              </div>

              <p className="text-sm text-amber-200/70 text-center mt-3">{discoveryPopup.definition.description}</p>

              <div className="bg-black/40 rounded-lg p-3 mt-3 border border-amber-700/20">
                <p className="text-xs text-amber-200/60 leading-relaxed italic">{discoveryPopup.definition.historicalInfo}</p>
              </div>

              <div className="text-center mt-3 text-xs text-amber-400/50">
                {discoveryPopup.definition.material} · {discoveryPopup.definition.date}
              </div>

              {(discoveryPopup.quality === 'A' || discoveryPopup.quality === 'B' || discoveryPopup.quality === 'C') && (
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Gem className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-300 font-bold">
                    +{discoveryPopup.quality === 'A' ? 5 : discoveryPopup.quality === 'B' ? 3 : 1} Gems Earned!
                  </span>
                </div>
              )}

              <button
                onClick={closeDiscovery}
                className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl py-3 font-bold hover:from-amber-500 hover:to-amber-600 transition-colors shadow-lg"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Continue Excavating
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Popup */}
      <AnimatePresence>
        {levelUpPopup && !showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeLevelUp}
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-b from-amber-800/95 to-[#1a0f0a]/95 backdrop-blur-sm rounded-2xl p-6 max-w-sm w-full border-2 border-amber-400 shadow-[0_0_60px_rgba(255,215,0,0.5)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6, repeat: 3 }}
                  className="text-7xl inline-block"
                >
                  🏆
                </motion.span>
                <h2 className="text-3xl font-bold text-amber-300 mt-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  LEVEL UP!
                </h2>
                <p className="text-xl text-amber-200 mt-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {levelUpPopup.name}
                </p>
                <p className="text-sm text-amber-400/70 mt-2">Level {levelUpPopup.level + 1}</p>
                <p className="text-xs text-amber-200/50 mt-3">New sites and tools may now be available!</p>
              </div>
              <button
                onClick={closeLevelUp}
                className="w-full mt-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl py-3 font-bold hover:from-amber-500 hover:to-amber-600 transition-colors shadow-lg"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Awesome!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Site Completion Popup */}
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCompletion(false)}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 150 }}
              className="bg-gradient-to-b from-emerald-900/95 to-[#1a0f0a]/95 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full border-2 border-emerald-400 shadow-[0_0_60px_rgba(0,255,100,0.3)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-20 h-20 text-amber-400 mx-auto drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
                </motion.div>
                <h2 className="text-3xl font-bold text-emerald-300 mt-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  SITE COMPLETE!
                </h2>
                <h3 className="text-xl text-amber-200 mt-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  {currentSite.name}
                </h3>
                <div className="bg-black/40 rounded-xl p-4 mt-4 border border-emerald-700/20">
                  <div className="text-sm text-amber-200/80 mb-3 font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Excavation Summary</div>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-black/30 rounded-lg p-2.5">
                      <div className="text-2xl font-bold text-amber-300">{extractedArtifacts.length}</div>
                      <div className="text-[10px] text-amber-400/60">Artifacts Found</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2.5">
                      <div className="text-2xl font-bold text-green-400">{perfectCount}</div>
                      <div className="text-[10px] text-amber-400/60">Perfect (Grade A)</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2.5">
                      <div className="text-2xl font-bold text-red-400">{damagedCount}</div>
                      <div className="text-[10px] text-amber-400/60">Damaged</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-2.5">
                      <div className="text-2xl font-bold text-amber-300">
                        {Math.round((perfectCount / Math.max(extractedArtifacts.length, 1)) * 100)}%
                      </div>
                      <div className="text-[10px] text-amber-400/60">Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { setShowCompletion(false); setScreen('museum'); }}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl py-3 font-bold hover:from-indigo-500 hover:to-indigo-600 transition-colors shadow-lg"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  View Museum
                </button>
                <button
                  onClick={() => { setShowCompletion(false); setScreen('worldMap'); }}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl py-3 font-bold hover:from-amber-500 hover:to-amber-600 transition-colors shadow-lg"
                  style={{ fontFamily: "'Fredoka', sans-serif" }}
                >
                  Next Site
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS animation for shimmer */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
