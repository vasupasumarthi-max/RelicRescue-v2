import { useGame } from '@/contexts/GameContext';
import { IMAGES, GEM_PACKAGES, TOOLS, ALL_SITES, SITE_UNLOCK_LEVELS, PROGRESSION } from '@/lib/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Unlock, Sparkles, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function GemShop() {
  const { setScreen, save, buyGems, unlockTool, unlockSite } = useGame();
  const [tab, setTab] = useState<'buy' | 'tools' | 'sites'>('buy');
  const [purchaseAnimation, setPurchaseAnimation] = useState(false);

  const handleBuyGems = (gems: number, label: string) => {
    buyGems(gems);
    setPurchaseAnimation(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ffd700', '#ff6b35', '#9b59b6'],
    });
    toast.success(`${gems} gems added! (Demo — no real payment)`, {
      description: `${label} purchased successfully`,
    });
    setTimeout(() => setPurchaseAnimation(false), 1000);
  };

  const handleUnlockTool = (toolId: string, toolName: string, cost: number) => {
    if (save.gems < cost) {
      toast.error('Not enough gems!', { description: `You need ${cost} gems. You have ${save.gems}.` });
      return;
    }
    unlockTool(toolId);
    toast.success(`${toolName} unlocked!`, { description: `${cost} gems spent` });
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
  };

  const handleUnlockSite = (siteId: string, siteName: string, cost: number) => {
    if (save.gems < cost) {
      toast.error('Not enough gems!', { description: `You need ${cost} gems. You have ${save.gems}.` });
      return;
    }
    unlockSite(siteId);
    toast.success(`${siteName} unlocked!`, { description: `${cost} gems spent` });
    confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0f0a]">
      {/* Header */}
      <div className="bg-[#2d1b0e] border-b-2 border-amber-700/30 py-3 px-4 flex items-center gap-3">
        <button onClick={() => setScreen('title')} className="text-amber-300 hover:text-amber-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-amber-300" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Gem Shop
        </h2>
        <div className="ml-auto flex items-center gap-1">
          <motion.img
            src={IMAGES.gemCrystal}
            alt="gems"
            className="w-6 h-6"
            animate={purchaseAnimation ? { scale: [1, 1.5, 1], rotate: [0, 15, -15, 0] } : {}}
          />
          <span className="text-amber-300 font-bold text-lg">{save.gems}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#2d1b0e] flex border-b border-amber-700/30">
        {[
          { id: 'buy' as const, label: 'Buy Gems', icon: <Sparkles className="w-4 h-4" /> },
          { id: 'tools' as const, label: 'Unlock Tools', icon: <span className="text-sm">🔧</span> },
          { id: 'sites' as const, label: 'Unlock Sites', icon: <span className="text-sm">🗺️</span> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
              tab === t.id
                ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-900/20'
                : 'text-amber-400/50 hover:text-amber-300'
            }`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {/* Buy Gems Tab */}
          {tab === 'buy' && (
            <motion.div
              key="buy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <motion.img
                  src={IMAGES.gemCrystal}
                  alt="Gem"
                  className="w-20 h-20 mx-auto"
                  animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <h3 className="text-xl text-amber-300 font-bold mt-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Get Gems!
                </h3>
                <p className="text-xs text-amber-200/60 mt-1">
                  Use gems to unlock new tools and dig sites
                </p>
                <p className="text-xs text-emerald-400/70 mt-1">
                  A portion of every purchase funds real archaeology! 💚
                </p>
              </div>

              {GEM_PACKAGES.map((pkg, i) => (
                <motion.button
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBuyGems(pkg.gems, pkg.label)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-purple-900/40 to-amber-900/40 border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.2)]'
                      : 'bg-[#2d1b0e] border-amber-700/30 hover:border-amber-500/40'
                  }`}
                >
                  <div className="relative">
                    <img src={IMAGES.gemCrystal} alt="gems" className="w-12 h-12" />
                    {pkg.popular && (
                      <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                        BEST
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-amber-200 font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                      {pkg.label}
                    </div>
                    <div className="text-sm text-amber-400">
                      <img src={IMAGES.gemCrystal} alt="" className="w-3 h-3 inline mr-1" />
                      {pkg.gems} Gems
                    </div>
                  </div>
                  <div className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                    {pkg.price}
                  </div>
                </motion.button>
              ))}

              <p className="text-center text-[10px] text-amber-400/30 mt-4">
                Demo mode — gems are added instantly without real payment
              </p>
            </motion.div>
          )}

          {/* Unlock Tools Tab */}
          {tab === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <h3 className="text-amber-300 font-bold text-center mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Excavation Tools
              </h3>

              {TOOLS.map((tool, i) => {
                const isUnlocked = save.unlockedTools.includes(tool.id);
                const canAfford = save.gems >= tool.gemCost;
                const levelReq = tool.unlockLevel;
                const meetsLevel = save.level >= levelReq;

                return (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 ${
                      isUnlocked
                        ? 'bg-[#2d1b0e] border-emerald-700/30'
                        : 'bg-[#2d1b0e] border-amber-700/30'
                    }`}
                  >
                    <span className="text-3xl">{tool.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-200 font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                          {tool.name}
                        </span>
                        {isUnlocked && <Unlock className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="text-xs text-amber-200/60 mt-0.5">{tool.description}</div>
                      <div className="flex gap-3 mt-1 text-[10px]">
                        <span className="text-blue-400">Speed: {tool.speed}/10</span>
                        <span className="text-green-400">Precision: {tool.precision}/10</span>
                        <span className="text-red-400">Damage: {Math.round(tool.damageRisk * 100)}%</span>
                      </div>
                    </div>
                    {!isUnlocked && (
                      <div className="text-right">
                        {!meetsLevel ? (
                          <div className="text-xs text-gray-500">
                            <Lock className="w-4 h-4 mx-auto mb-1" />
                            Lvl {levelReq + 1}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUnlockTool(tool.id, tool.name, tool.gemCost)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                              canAfford
                                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <img src={IMAGES.gemCrystal} alt="" className="w-3 h-3" />
                            {tool.gemCost}
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Unlock Sites Tab */}
          {tab === 'sites' && (
            <motion.div
              key="sites"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              <h3 className="text-amber-300 font-bold text-center mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Excavation Sites
              </h3>

              {ALL_SITES.map((site, i) => {
                const isUnlocked = save.unlockedSites.includes(site.id);
                const reqLevel = SITE_UNLOCK_LEVELS[site.id] || 0;
                const meetsLevel = save.level >= reqLevel;
                const gemCost = reqLevel * 20;
                const canAfford = save.gems >= gemCost;

                return (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`p-4 rounded-xl border-2 ${
                      isUnlocked
                        ? 'bg-[#2d1b0e] border-emerald-700/30'
                        : 'bg-[#2d1b0e] border-amber-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-200 font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                            {site.name}
                          </span>
                          {isUnlocked && <Unlock className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <div className="text-xs text-amber-200/60">{site.location} | {site.period}</div>
                        <div className="flex gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`w-3 h-3 ${j < site.difficulty ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                      {!isUnlocked && (
                        <div className="text-right">
                          {!meetsLevel ? (
                            <div className="text-xs text-gray-500">
                              <Lock className="w-4 h-4 mx-auto mb-1" />
                              Lvl {reqLevel + 1}
                            </div>
                          ) : gemCost > 0 ? (
                            <button
                              onClick={() => handleUnlockSite(site.id, site.name, gemCost)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                canAfford
                                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <img src={IMAGES.gemCrystal} alt="" className="w-3 h-3" />
                              {gemCost}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-amber-200/50 mt-2">{site.description}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
