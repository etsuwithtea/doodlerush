import { create } from 'zustand';

export interface GameSession {
  id: string;
  stars: number;
  time: number;
  date: string;
}

interface GameState {
  stars: number;
  level: number;
  timer: number;
  isGameRunning: boolean;
  history: GameSession[];
  addStar: () => void;
  incrementLevel: () => void;
  setTimer: (time: number) => void;
  startGame: () => void;
  stopGame: () => void;
  resetGame: () => void;
  saveSession: () => void;
}

export const useStore = create<GameState>((set, get) => ({
  stars: 0,
  level: 1,
  timer: 0,
  isGameRunning: false,
  history: [],
  addStar: () => set((state) => ({ stars: state.stars + 1 })),
  incrementLevel: () => set((state) => ({ level: state.level + 1 })),
  setTimer: (time) => set({ timer: time }),
  startGame: () => set({ isGameRunning: true, stars: 0, timer: 0 }),
  stopGame: () => set({ isGameRunning: false }),
  resetGame: () => set({ stars: 0, level: 1, timer: 0, isGameRunning: false }),
  saveSession: () => {
    const { stars, timer } = get();
    const session: GameSession = {
      id: Math.random().toString(36).substr(2, 9),
      stars,
      time: timer,
      date: new Date().toLocaleDateString(),
    };
    set((state) => ({ history: [session, ...state.history] }));
  }
}));
