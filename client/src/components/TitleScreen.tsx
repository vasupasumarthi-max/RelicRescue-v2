import { useGame } from '@/contexts/GameContext';
import { IMAGES, PROGRESSION } from '@/lib/gameData';
import { motion } from 'framer-motion';
import { Map, Landmark, Heart, Gem, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export default function TitleScreen() {
  const { setScreen, save, resetGame } = useGame();
  const levelName = PROGRESSION.LEVELS[Math.min(save.level, PROGRESSION.LEVELS.length - 1)].name;
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // XP progress to next level
  const currentLevelXP = PROGRESSION.LEVELS[save.level]?.xpRequired || 0;
  const nextLevelXP = PROGRESSION.LEVELS[Math.min(save.level + 1, PROGRESSION.LEVELS.length - 1)]?.xpRequired || currentLevelXP;
  const xpProgress = nextLevelXP > currentLevelXP
    ? Math.round(((save.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
    : 100;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Hero Banner */}
      <div className="relative w-full h-[50vh] min-h-[320px]">
        <img
          src={IMAGES.heroBanner}
          alt="Relic Rescue"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a0f0a]" />
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663320185665/UMytU4TJWeddHb6m8REdFw/relic-rescue-logo-hq-HVdPk8TKjZMU5KeSpHRJsX.png"
            alt="Relic Rescue"
            className="w-[300px] md:w-[420px] h-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
          />
          <p className="text-lg md:text-2xl text-amber-200 font-bold mt-1 drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] tracking-[0.3em] uppercase"
            style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Unearthed
          </p>
        </motion.div>

        {/* Reset button (top-right) */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-amber-300 p-2 rounded-full transition-colors z-10"
          title="Reset Game"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Player Stats Bar */}
      <div className="bg-[#2d1b0e] border-y-2 border-amber-700/50 py-3 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Lvl {save.level + 1}
              </span>
              <span className="text-amber-200/70">{levelName}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-amber-300 text-xs">XP: {save.xp}</span>
              <div className="flex items-center gap-1">
                <img src={IMAGES.gemCrystal} alt="gems" className="w-5 h-5" />
                <span className="text-amber-300 font-bold">{save.gems}</span>
              </div>
            </div>
          </div>
          {/* XP Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-[#1a0f0a] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
              />
            </div>
            <span className="text-[10px] text-amber-400/60 whitespace-nowrap">
              {save.level < PROGRESSION.LEVELS.length - 1 ? `${nextLevelXP - save.xp} XP to next` : 'MAX'}
            </span>
          </div>
        </div>
      </div>

      {/* Menu Buttons */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-8">
        {[
          { screen: 'worldMap' as const, icon: Map, label: 'Start Excavation', sub: 'Choose a dig site on the world map', colors: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600', shadow: 'shadow-amber-900/50', border: 'border-amber-500/30', iconColor: 'text-amber-200', subColor: 'text-amber-200/80' },
          { screen: 'museum' as const, icon: Landmark, label: 'Museum Collection', sub: 'View your discovered artifacts', colors: 'from-indigo-700 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700', shadow: 'shadow-indigo-900/50', border: 'border-indigo-500/30', iconColor: 'text-indigo-200', subColor: 'text-indigo-200/80' },
          { screen: 'funding' as const, icon: Heart, label: 'Fund Real Archaeology', sub: 'Help protect real archaeological sites', colors: 'from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700', shadow: 'shadow-emerald-900/50', border: 'border-emerald-500/30', iconColor: 'text-emerald-200', subColor: 'text-emerald-200/80' },
          { screen: 'gemShop' as const, icon: Gem, label: 'Gem Shop', sub: 'Buy gems to unlock tools & sites', colors: 'from-purple-700 to-purple-800 hover:from-purple-600 hover:to-purple-700', shadow: 'shadow-purple-900/50', border: 'border-purple-500/30', iconColor: 'text-purple-200', subColor: 'text-purple-200/80' },
        ].map((item, idx) => (
          <motion.button
            key={item.screen}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setScreen(item.screen)}
            className={`w-full max-w-sm bg-gradient-to-r ${item.colors} text-white rounded-2xl py-4 px-6 flex items-center gap-4 shadow-lg ${item.shadow} border-2 ${item.border} transition-colors`}
          >
            <item.icon className={`w-8 h-8 ${item.iconColor}`} />
            <div className="text-left">
              <div className="text-lg font-bold tracking-wide" style={{ fontFamily: "'Nunito', sans-serif", fontStyle: 'normal' }}>{item.label}</div>
              <div className={`text-xs ${item.subColor}`} style={{ fontFamily: "'Nunito', sans-serif" }}>{item.sub}</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-amber-700/50 text-xs">
        FLL Innovation Project | Play a game → Save history!
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-[#2d1b0e] rounded-2xl p-6 max-w-sm w-full border-2 border-red-500/50"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-xl font-bold text-red-400 mt-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Reset Game?
              </h3>
              <p className="text-sm text-amber-200/70 mt-2">
                This will erase ALL your progress: artifacts, gems, levels, and unlocked sites. This cannot be undone!
              </p>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-xl py-3 font-bold transition-colors"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetGame();
                  setShowResetConfirm(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white rounded-xl py-3 font-bold transition-colors"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
