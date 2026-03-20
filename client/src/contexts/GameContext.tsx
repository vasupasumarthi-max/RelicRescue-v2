import React, { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import {
  type SaveData, type SiteInfo, type ToolDef, type PlacedArtifact, type GridCellState,
  loadGame, saveGame, getDefaultSave, TOOLS, PROGRESSION, SITE_UNLOCK_LEVELS,
  ALL_SITES, getSite, initializeGrid, digCell, GRID_SIZE,
} from '@/lib/gameData';

type GameScreen = 'title' | 'worldMap' | 'briefing' | 'excavation' | 'museum' | 'funding' | 'gemShop' | 'levelUp';

interface GameState {
  screen: GameScreen;
  save: SaveData;
  currentSite: SiteInfo | null;
  selectedTool: ToolDef;
  cells: GridCellState[][];
  artifacts: PlacedArtifact[];
  discoveryPopup: PlacedArtifact | null;
  levelUpPopup: { level: number; name: string } | null;
  damagePopup: { row: number; col: number } | null;
  hintPopup: { row: number; col: number; text: string } | null;
  pendingDiscoveries: PlacedArtifact[];
  pendingLevelUps: { level: number; name: string }[];
}

interface GameContextType extends GameState {
  setScreen: (screen: GameScreen) => void;
  selectSite: (siteId: string) => void;
  selectTool: (toolId: string) => void;
  handleDig: (row: number, col: number) => void;
  buyGems: (amount: number) => void;
  unlockTool: (toolId: string) => void;
  unlockSite: (siteId: string) => void;
  closeDiscovery: () => void;
  closeLevelUp: () => void;
  clearDamage: () => void;
  clearHint: () => void;
  resetGame: () => void;
  getExcavationProgress: () => number;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const save = loadGame();
    return {
      screen: 'title',
      save,
      currentSite: null,
      selectedTool: TOOLS[2], // trowel default
      cells: [],
      artifacts: [],
      discoveryPopup: null,
      levelUpPopup: null,
      damagePopup: null,
      hintPopup: null,
      pendingDiscoveries: [],
      pendingLevelUps: [],
    };
  });

  // Auto-save when save data changes
  useEffect(() => {
    saveGame(state.save);
  }, [state.save]);

  const setScreen = useCallback((screen: GameScreen) => {
    setState(prev => ({ ...prev, screen }));
  }, []);

  const selectSite = useCallback((siteId: string) => {
    setState(prev => {
      const site = getSite(siteId);
      if (!site) return prev;

      const savedGrid = prev.save.gridStates[siteId];
      const { cells, artifacts } = initializeGrid(site);

      if (savedGrid) {
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (savedGrid[r] && savedGrid[r][c] !== undefined) {
              cells[r][c].currentLayer = savedGrid[r][c];
              if (cells[r][c].currentLayer >= site.layers.length - 1) {
                cells[r][c].isFullyExcavated = true;
                cells[r][c].digProgress = 100;
              }
            }
          }
        }
      }

      return {
        ...prev,
        currentSite: site,
        cells,
        artifacts,
        screen: 'briefing',
        save: { ...prev.save, currentSite: siteId },
      };
    });
  }, []);

  const selectTool = useCallback((toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (tool) {
      setState(prev => ({ ...prev, selectedTool: tool }));
    }
  }, []);

  const handleDig = useCallback((row: number, col: number) => {
    setState(prev => {
      if (!prev.currentSite) return prev;
      const cell = prev.cells[row]?.[col];
      if (!cell) return prev;

      const result = digCell(cell, prev.selectedTool, prev.artifacts, prev.currentSite);
      if (!result) return prev;

      const newSave = { ...prev.save };
      newSave.xp += result.xpGained;
      newSave.gems += result.gemsGained;

      // Check level up
      const newPendingLevelUps = [...prev.pendingLevelUps];
      const levels = PROGRESSION.LEVELS;
      let newLevel = 0;
      for (let i = levels.length - 1; i >= 0; i--) {
        if (newSave.xp >= levels[i].xpRequired) {
          newLevel = i;
          break;
        }
      }
      if (newLevel > newSave.level) {
        newSave.level = newLevel;
        newPendingLevelUps.push({ level: newLevel, name: levels[newLevel].name });

        // Auto-unlock sites
        for (const [siteId, reqLevel] of Object.entries(SITE_UNLOCK_LEVELS)) {
          if (reqLevel <= newLevel && !newSave.unlockedSites.includes(siteId)) {
            newSave.unlockedSites.push(siteId);
          }
        }
      }

      // Save grid state
      if (!newSave.gridStates[prev.currentSite.id]) {
        newSave.gridStates[prev.currentSite.id] = [];
      }
      const gridState = newSave.gridStates[prev.currentSite.id];
      if (!gridState[row]) gridState[row] = [];
      gridState[row][col] = cell.currentLayer;

      // Queue discovered artifact
      const newPendingDiscoveries = [...prev.pendingDiscoveries];
      if (result.artifactExtracted && result.artifact) {
        newSave.discoveredArtifacts.push({
          siteId: prev.currentSite.id,
          artifactId: result.artifact.definition.id,
          quality: result.artifact.quality,
        });
        newPendingDiscoveries.push(result.artifact);
      }

      const newCells = [...prev.cells];
      newCells[row] = [...newCells[row]];
      newCells[row][col] = { ...cell };

      // Show the first pending popup if nothing is currently showing
      let discoveryPopup = prev.discoveryPopup;
      let levelUpPopup = prev.levelUpPopup;

      if (!discoveryPopup && newPendingDiscoveries.length > 0) {
        discoveryPopup = newPendingDiscoveries.shift()!;
      }
      if (!levelUpPopup && !discoveryPopup && newPendingLevelUps.length > 0) {
        levelUpPopup = newPendingLevelUps.shift()!;
      }

      return {
        ...prev,
        cells: newCells,
        save: newSave,
        discoveryPopup,
        levelUpPopup,
        pendingDiscoveries: newPendingDiscoveries,
        pendingLevelUps: newPendingLevelUps,
        damagePopup: result.artifactDamaged ? { row, col } : prev.damagePopup,
        hintPopup: result.hitArtifactLayer ? { row, col, text: 'Something is here... use finer tools!' } : prev.hintPopup,
      };
    });
  }, []);

  const buyGems = useCallback((amount: number) => {
    setState(prev => ({
      ...prev,
      save: { ...prev.save, gems: prev.save.gems + amount },
    }));
  }, []);

  const unlockTool = useCallback((toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (!tool) return;
    setState(prev => {
      if (prev.save.gems < tool.gemCost) return prev;
      if (prev.save.unlockedTools.includes(toolId)) return prev;
      return {
        ...prev,
        save: {
          ...prev.save,
          gems: prev.save.gems - tool.gemCost,
          unlockedTools: [...prev.save.unlockedTools, toolId],
        },
      };
    });
  }, []);

  const unlockSite = useCallback((siteId: string) => {
    setState(prev => {
      if (prev.save.unlockedSites.includes(siteId)) return prev;
      const cost = (SITE_UNLOCK_LEVELS[siteId] || 0) * 20;
      if (prev.save.gems < cost) return prev;
      return {
        ...prev,
        save: {
          ...prev.save,
          gems: prev.save.gems - cost,
          unlockedSites: [...prev.save.unlockedSites, siteId],
        },
      };
    });
  }, []);

  const closeDiscovery = useCallback(() => {
    setState(prev => {
      // Show next pending popup
      let nextDiscovery: PlacedArtifact | null = null;
      let nextLevelUp = prev.levelUpPopup;
      const pendingDiscoveries = [...prev.pendingDiscoveries];
      const pendingLevelUps = [...prev.pendingLevelUps];

      if (pendingDiscoveries.length > 0) {
        nextDiscovery = pendingDiscoveries.shift()!;
      } else if (!nextLevelUp && pendingLevelUps.length > 0) {
        nextLevelUp = pendingLevelUps.shift()!;
      }

      return {
        ...prev,
        discoveryPopup: nextDiscovery,
        levelUpPopup: nextLevelUp,
        pendingDiscoveries,
        pendingLevelUps,
      };
    });
  }, []);

  const closeLevelUp = useCallback(() => {
    setState(prev => {
      let nextLevelUp: { level: number; name: string } | null = null;
      let nextDiscovery = prev.discoveryPopup;
      const pendingLevelUps = [...prev.pendingLevelUps];
      const pendingDiscoveries = [...prev.pendingDiscoveries];

      if (pendingLevelUps.length > 0) {
        nextLevelUp = pendingLevelUps.shift()!;
      } else if (!nextDiscovery && pendingDiscoveries.length > 0) {
        nextDiscovery = pendingDiscoveries.shift()!;
      }

      return {
        ...prev,
        levelUpPopup: nextLevelUp,
        discoveryPopup: nextDiscovery,
        pendingLevelUps,
        pendingDiscoveries,
      };
    });
  }, []);

  const clearDamage = useCallback(() => {
    setState(prev => ({ ...prev, damagePopup: null }));
  }, []);

  const clearHint = useCallback(() => {
    setState(prev => ({ ...prev, hintPopup: null }));
  }, []);

  const resetGame = useCallback(() => {
    const fresh = getDefaultSave();
    setState(prev => ({
      ...prev,
      save: fresh,
      screen: 'title',
      cells: [],
      artifacts: [],
      currentSite: null,
      discoveryPopup: null,
      levelUpPopup: null,
      damagePopup: null,
      hintPopup: null,
      pendingDiscoveries: [],
      pendingLevelUps: [],
    }));
  }, []);

  const getExcavationProgress = useCallback(() => {
    if (!state.cells.length) return 0;
    let total = 0;
    let excavated = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        total++;
        if (state.cells[r]?.[c]?.isFullyExcavated) excavated++;
      }
    }
    return total > 0 ? Math.round((excavated / total) * 100) : 0;
  }, [state.cells]);

  return (
    <GameContext.Provider value={{
      ...state,
      setScreen,
      selectSite,
      selectTool,
      handleDig,
      buyGems,
      unlockTool,
      unlockSite,
      closeDiscovery,
      closeLevelUp,
      clearDamage,
      clearHint,
      resetGame,
      getExcavationProgress,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
