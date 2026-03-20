import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { GameProvider, useGame } from "./contexts/GameContext";
import TitleScreen from "./components/TitleScreen";
import WorldMap from "./components/WorldMap";
import SiteBriefing from "./components/SiteBriefing";
import ExcavationScene from "./components/ExcavationScene";
import Museum from "./components/Museum";
import FundingPage from "./components/FundingPage";
import GemShop from "./components/GemShop";

function GameRouter() {
  const { screen } = useGame();

  switch (screen) {
    case 'title':
      return <TitleScreen />;
    case 'worldMap':
      return <WorldMap />;
    case 'briefing':
      return <SiteBriefing />;
    case 'excavation':
      return <ExcavationScene />;
    case 'museum':
      return <Museum />;
    case 'funding':
      return <FundingPage />;
    case 'gemShop':
      return <GemShop />;
    default:
      return <TitleScreen />;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster richColors position="top-center" />
          <GameProvider>
            <GameRouter />
          </GameProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
