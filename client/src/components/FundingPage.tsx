import { useGame } from '@/contexts/GameContext';
import { ALL_SITES } from '@/lib/gameData';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ExternalLink, Globe } from 'lucide-react';

export default function FundingPage() {
  const { setScreen, save } = useGame();

  return (
    <div className="min-h-screen flex flex-col bg-[#1a0f0a]">
      {/* Header */}
      <div className="bg-[#2d1b0e] border-b-2 border-amber-700/30 py-3 px-4 flex items-center gap-3">
        <button onClick={() => setScreen('title')} className="text-amber-300 hover:text-amber-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-amber-300" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Fund Real Archaeology
        </h2>
      </div>

      <div className="flex-1 overflow-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Hero Section */}
          <div className="bg-gradient-to-b from-emerald-900/40 to-[#2d1b0e] rounded-2xl p-6 border border-emerald-700/30 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 text-emerald-400 mx-auto" />
            </motion.div>
            <h3 className="text-2xl text-emerald-300 font-bold mt-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Help Save Real History!
            </h3>
            <p className="text-sm text-emerald-200/70 mt-2 leading-relaxed">
              Archaeologists don't have enough money to dig. Governments have stopped paying for excavations.
              It costs $50,000+ to run a single dig. Without funding, history stays buried forever!
            </p>
            <p className="text-sm text-emerald-300/80 mt-3 font-bold">
              Money from this game goes to REAL archaeological teams.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-[#2d1b0e] rounded-xl p-5 border border-amber-700/30">
            <h3 className="text-amber-400 font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              How Your Help Works
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center shrink-0">
                  <span className="text-sm">💎</span>
                </div>
                <div>
                  <div className="text-sm text-amber-200 font-bold">1. Players Buy Gems</div>
                  <div className="text-xs text-amber-200/60">In-game gems help you unlock new tools and sites</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600/30 flex items-center justify-center shrink-0">
                  <span className="text-sm">💰</span>
                </div>
                <div>
                  <div className="text-sm text-amber-200 font-bold">2. Money Goes to Real Excavations</div>
                  <div className="text-xs text-amber-200/60">A portion of every purchase funds real archaeological digs</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center shrink-0">
                  <span className="text-sm">🏛️</span>
                </div>
                <div>
                  <div className="text-sm text-amber-200 font-bold">3. See Real Artifacts in Your Museum</div>
                  <div className="text-xs text-amber-200/60">Discoveries from funded digs appear in the game</div>
                </div>
              </div>
            </div>
          </div>

          {/* Real Organizations */}
          <div className="bg-[#2d1b0e] rounded-xl p-5 border border-amber-700/30">
            <h3 className="text-amber-400 font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Organizations We Support
            </h3>
            <div className="space-y-3">
              {ALL_SITES.map(site => (
                <a
                  key={site.id}
                  href={site.donationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#1a0f0a] rounded-lg p-3 border border-amber-700/20 hover:border-emerald-500/40 transition-all group"
                >
                  <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="flex-1">
                    <div className="text-sm text-amber-200 font-bold group-hover:text-emerald-300 transition-colors">
                      {site.donationOrg}
                    </div>
                    <div className="text-xs text-amber-200/50">Supporting {site.name}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-amber-400/50 group-hover:text-emerald-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Impact Stats */}
          <div className="bg-gradient-to-r from-emerald-900/30 to-[#2d1b0e] rounded-xl p-5 border border-emerald-700/30">
            <h3 className="text-emerald-400 font-bold mb-3" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              It's Just Like Real Life!
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#1a0f0a] rounded-lg p-3 text-center">
                <div className="text-xs text-amber-200/50">Real Life</div>
                <div className="text-sm text-amber-200 mt-1">Archaeologists use brushes for delicate things</div>
              </div>
              <div className="bg-[#1a0f0a] rounded-lg p-3 text-center">
                <div className="text-xs text-emerald-400/50">Our Game</div>
                <div className="text-sm text-emerald-200 mt-1">We use brushes too! Zero damage risk</div>
              </div>
              <div className="bg-[#1a0f0a] rounded-lg p-3 text-center">
                <div className="text-xs text-amber-200/50">Real Life</div>
                <div className="text-sm text-amber-200 mt-1">You have to be patient and careful</div>
              </div>
              <div className="bg-[#1a0f0a] rounded-lg p-3 text-center">
                <div className="text-xs text-emerald-400/50">Our Game</div>
                <div className="text-sm text-emerald-200 mt-1">Rushing makes you break things!</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-4">
            <p className="text-amber-300 font-bold text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Play a game → Save history! 🌍
            </p>
            <p className="text-xs text-amber-400/50 mt-2">
              FLL Innovation Project — Making archaeology fun and funded
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
