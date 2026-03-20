// ============================================================
// SITE BRIEFING — Immersive briefing with site-specific background
// Shows mission details, soil layers, and artifacts before excavation
// ============================================================
import { useGame } from '@/contexts/GameContext';
import { SITE_BACKGROUNDS } from '@/lib/gameData';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Calendar, Pickaxe, Layers, Search } from 'lucide-react';

export default function SiteBriefing() {
  const { setScreen, currentSite } = useGame();

  if (!currentSite) return null;

  const siteBackground = SITE_BACKGROUNDS[currentSite.id] || '';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Site-specific background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${siteBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Header */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm border-b border-amber-700/30 py-3 px-4 flex items-center gap-3">
        <button onClick={() => setScreen('worldMap')} className="text-amber-300 hover:text-amber-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-amber-300" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Site Briefing
        </h2>
      </div>

      <div className="relative z-10 flex-1 overflow-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Site Title */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {currentSite.name}
            </h1>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-amber-200/80">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {currentSite.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {currentSite.period}</span>
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < currentSite.difficulty ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
              ))}
              <span className="text-xs text-amber-400/70 ml-2">Difficulty</span>
            </div>
          </div>

          {/* Briefing */}
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-5 border border-amber-700/30">
            <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              <Search className="w-4 h-4" /> Mission Briefing
            </h3>
            <p className="text-amber-100/80 text-sm leading-relaxed">{currentSite.briefing}</p>
          </div>

          {/* Soil Layers Preview */}
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-5 border border-amber-700/30">
            <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              <Layers className="w-4 h-4" /> Soil Layers
            </h3>
            <div className="space-y-1.5">
              {currentSite.layers.map((layer, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-6 rounded border border-white/10 shrink-0"
                    style={{ backgroundColor: layer.color }}
                  />
                  <span className="text-xs text-amber-200/80 flex-1">{layer.name}</span>
                  <span className="text-xs text-amber-400/50">{layer.depth}cm</span>
                </div>
              ))}
            </div>
          </div>

          {/* Artifacts to Find */}
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-5 border border-amber-700/30">
            <h3 className="text-amber-400 font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              <span className="text-lg">🏺</span> Artifacts to Discover
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {currentSite.artifacts.map(art => (
                <div key={art.id} className="flex items-center gap-2 bg-black/40 rounded-lg p-2.5 border border-amber-700/10">
                  <span className="text-xl">{art.emoji}</span>
                  <div>
                    <div className="text-xs text-amber-200 font-bold">{art.name}</div>
                    <div className={`text-[10px] font-bold ${
                      art.rarity === 'legendary' ? 'text-purple-400' :
                      art.rarity === 'rare' ? 'text-amber-400' :
                      art.rarity === 'uncommon' ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {art.rarity.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setScreen('excavation')}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 shadow-lg shadow-amber-900/50 border-2 border-amber-500/30 transition-colors"
          >
            <Pickaxe className="w-6 h-6" />
            <span className="text-xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Begin Excavation!</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
