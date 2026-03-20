import { useGame } from '@/contexts/GameContext';
import { IMAGES, ALL_SITES } from '@/lib/gameData';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useState } from 'react';

export default function Museum() {
  const { setScreen, save } = useGame();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<{
    name: string; emoji: string; description: string; historicalInfo: string;
    material: string; date: string; rarity: string; quality: string;
  } | null>(null);

  // Group artifacts by site
  const artifactsBySite: Record<string, { artifactId: string; quality: string }[]> = {};
  for (const disc of save.discoveredArtifacts) {
    if (!artifactsBySite[disc.siteId]) artifactsBySite[disc.siteId] = [];
    artifactsBySite[disc.siteId].push(disc);
  }

  const totalArtifacts = save.discoveredArtifacts.length;
  const totalPossible = ALL_SITES.reduce((sum, s) => sum + s.artifacts.reduce((a, art) => a + art.count, 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0f0a]">
      {/* Header */}
      <div className="bg-[#2d1b0e] border-b-2 border-amber-700/30 py-3 px-4 flex items-center gap-3">
        <button onClick={() => setScreen('title')} className="text-amber-300 hover:text-amber-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-amber-300" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Museum Collection
        </h2>
        <div className="ml-auto flex items-center gap-1 text-xs text-amber-400/70">
          <Trophy className="w-4 h-4" />
          {totalArtifacts}/{totalPossible}
        </div>
      </div>

      {/* Museum Background */}
      <div className="relative flex-1 overflow-auto">
        <div className="absolute inset-0 opacity-20">
          <img src={IMAGES.museumBg} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 p-4 max-w-4xl mx-auto">
          {totalArtifacts === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <span className="text-6xl">🏛️</span>
              <h3 className="text-xl text-amber-300 mt-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Your Museum is Empty!
              </h3>
              <p className="text-sm text-amber-200/60 mt-2">Start excavating to fill your collection.</p>
              <button
                onClick={() => setScreen('worldMap')}
                className="mt-4 bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-xl font-bold transition-colors"
                style={{ fontFamily: "'Fredoka', sans-serif" }}
              >
                Go Excavate!
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-[#2d1b0e]/80 rounded-xl p-4 border border-amber-700/30 text-center">
                <h3 className="text-amber-300 font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                  Collection Progress
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="flex-1 max-w-xs h-3 bg-[#1a0f0a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                      style={{ width: `${(totalArtifacts / totalPossible) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-amber-300 font-bold">
                    {Math.round((totalArtifacts / totalPossible) * 100)}%
                  </span>
                </div>
              </div>

              {/* Sites */}
              {ALL_SITES.map(site => {
                const siteArtifacts = artifactsBySite[site.id] || [];
                if (siteArtifacts.length === 0) return null;

                return (
                  <motion.div
                    key={site.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#2d1b0e]/80 rounded-xl p-4 border border-amber-700/30"
                  >
                    <h3 className="text-amber-300 font-bold mb-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                      {site.name} — {site.location}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {siteArtifacts.map((disc, i) => {
                        const artDef = site.artifacts.find(a => a.id === disc.artifactId);
                        if (!artDef) return null;

                        return (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedArtifact({
                              name: artDef.name,
                              emoji: artDef.emoji,
                              description: artDef.description,
                              historicalInfo: artDef.historicalInfo,
                              material: artDef.material,
                              date: artDef.date,
                              rarity: artDef.rarity,
                              quality: disc.quality,
                            })}
                            className="bg-[#1a0f0a] rounded-lg p-3 border border-amber-700/20 hover:border-amber-500/40 transition-all text-center"
                          >
                            <motion.span
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                              className="text-3xl block"
                            >
                              {artDef.emoji}
                            </motion.span>
                            <div className="text-xs text-amber-200 font-bold mt-1">{artDef.name}</div>
                            <div className={`text-[10px] mt-0.5 ${
                              disc.quality === 'A' ? 'text-green-400' :
                              disc.quality === 'B' ? 'text-blue-400' :
                              disc.quality === 'F' ? 'text-red-400' : 'text-amber-400'
                            }`}>
                              Grade: {disc.quality}
                            </div>
                            <div className={`text-[10px] ${
                              artDef.rarity === 'legendary' ? 'text-purple-400' :
                              artDef.rarity === 'rare' ? 'text-amber-400' :
                              artDef.rarity === 'uncommon' ? 'text-blue-400' : 'text-gray-400'
                            }`}>
                              {artDef.rarity.toUpperCase()}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArtifact(null)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#2d1b0e] rounded-2xl p-6 max-w-md w-full border-2 border-amber-500/50 shadow-[0_0_40px_rgba(255,215,0,0.2)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="text-6xl">{selectedArtifact.emoji}</span>
              <h3 className="text-xl text-amber-300 font-bold mt-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {selectedArtifact.name}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  selectedArtifact.rarity === 'legendary' ? 'bg-purple-900/50 text-purple-400' :
                  selectedArtifact.rarity === 'rare' ? 'bg-amber-900/50 text-amber-400' :
                  selectedArtifact.rarity === 'uncommon' ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-800 text-gray-400'
                }`}>{selectedArtifact.rarity.toUpperCase()}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  selectedArtifact.quality === 'A' ? 'bg-green-900/50 text-green-400' :
                  selectedArtifact.quality === 'B' ? 'bg-blue-900/50 text-blue-400' :
                  selectedArtifact.quality === 'F' ? 'bg-red-900/50 text-red-400' : 'bg-amber-900/50 text-amber-400'
                }`}>Grade: {selectedArtifact.quality}</span>
              </div>
            </div>
            <p className="text-sm text-amber-200/80 mt-4">{selectedArtifact.description}</p>
            <div className="bg-[#1a0f0a] rounded-lg p-3 mt-3">
              <p className="text-xs text-amber-200/60 leading-relaxed">{selectedArtifact.historicalInfo}</p>
            </div>
            <div className="text-center mt-3 text-xs text-amber-400/50">
              {selectedArtifact.material} | {selectedArtifact.date}
            </div>
            <button
              onClick={() => setSelectedArtifact(null)}
              className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl py-2 font-bold transition-colors"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
