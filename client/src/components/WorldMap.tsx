import { useGame } from '@/contexts/GameContext';
import { IMAGES, ALL_SITES, SITE_UNLOCK_LEVELS, PROGRESSION } from '@/lib/gameData';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Star, CheckCircle, Gem } from 'lucide-react';

export default function WorldMap() {
  const { setScreen, selectSite, save } = useGame();
  const levelName = PROGRESSION.LEVELS[Math.min(save.level, PROGRESSION.LEVELS.length - 1)].name;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f2844]">
      {/* Header */}
      <div className="bg-[#0a1e36] border-b-2 border-amber-700/30 py-3 px-4 flex items-center justify-between z-20">
        <button onClick={() => setScreen('title')} className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>Back</span>
        </button>
        <h2 className="text-lg font-bold text-amber-300" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Select Excavation Site
        </h2>
        <div className="flex items-center gap-2 text-xs text-amber-400/70">
          <span>{levelName}</span>
          <div className="flex items-center gap-1">
            <Gem className="w-3 h-3 text-amber-400" />
            <span className="text-amber-300 font-bold">{save.gems}</span>
          </div>
        </div>
      </div>

      {/* Map with site cards - scrollable list on mobile, map on desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map visual (desktop) */}
        <div className="hidden md:block flex-1 relative">
          <img
            src={IMAGES.worldMap}
            alt="World Map"
            className="w-full h-full object-cover absolute inset-0 pointer-events-none opacity-60"
          />

          {/* Site Pins on map */}
          {ALL_SITES.map((site, idx) => {
            const isUnlocked = save.unlockedSites.includes(site.id);
            const isCompleted = save.completedSites.includes(site.id);
            const reqLevel = SITE_UNLOCK_LEVELS[site.id] || 0;

            return (
              <motion.div
                key={site.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
                className="absolute z-10"
                style={{
                  left: `${site.mapPosition.x}%`,
                  top: `${site.mapPosition.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <button
                  onClick={() => isUnlocked ? selectSite(site.id) : undefined}
                  disabled={!isUnlocked}
                  className="group flex flex-col items-center gap-1 cursor-pointer"
                  style={{ minWidth: '80px', minHeight: '60px' }}
                >
                  {/* Pin - larger for easier clicking */}
                  <motion.div
                    animate={isUnlocked && !isCompleted ? { y: [0, -6, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border-3 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-300 shadow-emerald-500/50'
                        : isUnlocked
                          ? 'bg-red-500 border-red-300 shadow-red-500/50 group-hover:bg-red-400 group-hover:scale-110'
                          : 'bg-gray-600 border-gray-500 shadow-gray-500/30 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : isUnlocked ? (
                      <span className="text-xl">📍</span>
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </motion.div>

                  {/* Label */}
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                    isUnlocked ? 'bg-[#2d1b0e]/90 text-amber-200' : 'bg-gray-800/90 text-gray-400'
                  }`} style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {site.name}
                  </div>

                  {/* Difficulty Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < site.difficulty ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>

                  {!isUnlocked && (
                    <span className="text-[10px] text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded">Lvl {reqLevel + 1}</span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Site List (mobile + desktop sidebar) */}
        <div className="md:w-80 overflow-y-auto bg-[#0a1e36]/95 md:border-l-2 md:border-amber-700/20">
          <div className="p-3 md:p-4">
            <h3 className="text-sm font-bold text-amber-400/70 mb-3 md:hidden" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Choose Your Dig Site
            </h3>
            <div className="space-y-3">
              {ALL_SITES.map((site, idx) => {
                const isUnlocked = save.unlockedSites.includes(site.id);
                const isCompleted = save.completedSites.includes(site.id);
                const reqLevel = SITE_UNLOCK_LEVELS[site.id] || 0;

                return (
                  <motion.button
                    key={site.id}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={() => isUnlocked ? selectSite(site.id) : undefined}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-900/30 border-emerald-600/40 hover:border-emerald-500/60'
                        : isUnlocked
                          ? 'bg-[#2d1b0e]/60 border-amber-700/30 hover:border-amber-500/60 hover:bg-[#2d1b0e]/80'
                          : 'bg-gray-800/30 border-gray-700/30 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted ? 'bg-emerald-500' : isUnlocked ? 'bg-red-500' : 'bg-gray-600'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : isUnlocked ? (
                          <span className="text-lg">📍</span>
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-amber-200" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                            {site.name}
                          </span>
                          {isCompleted && <span className="text-[10px] bg-emerald-600/50 text-emerald-200 px-1.5 py-0.5 rounded">COMPLETE</span>}
                        </div>
                        <div className="text-[11px] text-amber-400/60">{site.location} | {site.period}</div>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < site.difficulty ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                      </div>
                      {!isUnlocked && (
                        <span className="text-[10px] text-gray-400 bg-gray-700/50 px-2 py-1 rounded">Lvl {reqLevel + 1}</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
