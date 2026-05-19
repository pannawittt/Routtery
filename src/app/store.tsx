import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { Mode, LotteryStatus, Lang } from "@/data/constants";
import { lotteryData } from "@/data/constants";

export interface CheckpointTimestamp {
  completedAt: number; // timestamp in milliseconds
  coordinates?: { lat: number; lng: number };
}

interface AppState {
  lang: Lang;
  originCheckpointId: number | null; // ID of starting checkpoint
  destinationCheckpointId: number | null; // ID of ending checkpoint (optional)
  selectedCheckpoints: string[];
  mode: Mode | null;
  modesUsed: Mode[]; // track all modes used during journey
  currentCheckpoint: number;
  completedCheckpoints: boolean[];
  checkpointAnswers: (number | null)[];
  storyCategories: ("history" | "funFact" | "horror" | null)[];
  lotteryStatuses: Record<number, LotteryStatus>;
  activeLotteryId: number | null;
  uploadedPhotos: Record<number, number>;
  lotteryPhotos: Record<number, string[]>;
  startTime: number | null; // timestamp when journey started
  checkpointTimestamps: (CheckpointTimestamp | null)[]; // timestamps for each checkpoint
  routeCoordinates: { lat: number; lng: number; timestamp: number }[]; // GPS trail
}

type Action =
  | { type: "SET_LANG"; lang: Lang }
  | { type: "SET_PLAN"; originCheckpointId: number | null; destinationCheckpointId: number | null; checkpoints: string[] }
  | { type: "SET_MODE"; mode: Mode }
  | { type: "SELECT_ANSWER"; idx: number; answer: number }
  | { type: "COMPLETE_CHECKPOINT"; idx: number; coordinates?: { lat: number; lng: number } }
  | { type: "ADVANCE_CHECKPOINT" }
  | { type: "SET_CURRENT_CHECKPOINT"; idx: number }
  | { type: "SELECT_STORY_CATEGORY"; idx: number; category: "history" | "funFact" | "horror" }
  | { type: "ACTIVATE_LOTTERY"; id: number }
  | { type: "COMPLETE_LOTTERY"; id: number }
  | { type: "RESET_LOTTERY"; id: number }
  | { type: "ADD_PHOTO"; id: number; photoUrl: string }
  | { type: "START_JOURNEY" }
  | { type: "TRACK_LOCATION"; lat: number; lng: number }
  | { type: "RESET_ALL" };

const initialLotteryStatuses: Record<number, LotteryStatus> = Object.fromEntries(
  lotteryData.map(l => [l.id, "available" as LotteryStatus])
);

export const initialState: AppState = {
  lang: "TH",
  originCheckpointId: null,
  destinationCheckpointId: null,
  selectedCheckpoints: [],
  mode: null,
  modesUsed: [],
  currentCheckpoint: 0,
  completedCheckpoints: [false, false, false, false, false, false],
  checkpointAnswers: [null, null, null, null, null, null],
  storyCategories: [null, null, null, null, null, null],
  lotteryStatuses: initialLotteryStatuses,
  activeLotteryId: null,
  uploadedPhotos: {},
  lotteryPhotos: {},
  startTime: null,
  checkpointTimestamps: [null, null, null, null, null, null],
  routeCoordinates: [],
};

function reducer(state: AppState = initialState, action: Action): AppState {
  switch (action.type) {
    case "SET_LANG":
      return { ...state, lang: action.lang };
    case "SET_PLAN":
      return {
        ...state,
        originCheckpointId: action.originCheckpointId,
        destinationCheckpointId: action.destinationCheckpointId,
        selectedCheckpoints: action.checkpoints,
        currentCheckpoint: action.originCheckpointId ?? 0 // Start at origin checkpoint
      };
    case "SET_MODE": {
      const lastMode = state.modesUsed[state.modesUsed.length - 1];
      const newModesUsed = lastMode === action.mode
        ? state.modesUsed
        : [...state.modesUsed, action.mode];
      return { ...state, mode: action.mode, modesUsed: newModesUsed };
    }
    case "SELECT_ANSWER": {
      const answers = [...state.checkpointAnswers];
      answers[action.idx] = action.answer;
      return { ...state, checkpointAnswers: answers };
    }
    case "COMPLETE_CHECKPOINT": {
      const completed = [...state.completedCheckpoints];
      completed[action.idx] = true;
      const timestamps = [...state.checkpointTimestamps];
      timestamps[action.idx] = {
        completedAt: Date.now(),
        coordinates: action.coordinates,
      };
      return { ...state, completedCheckpoints: completed, checkpointTimestamps: timestamps };
    }
    case "ADVANCE_CHECKPOINT":
      return { ...state, currentCheckpoint: Math.min(state.currentCheckpoint + 1, 5) };
    case "SET_CURRENT_CHECKPOINT":
      return { ...state, currentCheckpoint: action.idx };
    case "SELECT_STORY_CATEGORY": {
      const categories = [...state.storyCategories];
      categories[action.idx] = action.category;
      return { ...state, storyCategories: categories };
    }
    case "ACTIVATE_LOTTERY":
      return {
        ...state,
        lotteryStatuses: { ...state.lotteryStatuses, [action.id]: "active" },
        activeLotteryId: action.id,
      };
    case "COMPLETE_LOTTERY":
      return {
        ...state,
        lotteryStatuses: { ...state.lotteryStatuses, [action.id]: "done" },
        activeLotteryId: null,
      };
    case "RESET_LOTTERY":
      return {
        ...state,
        lotteryStatuses: { ...state.lotteryStatuses, [action.id]: "available" },
        activeLotteryId: null,
        uploadedPhotos: { ...state.uploadedPhotos, [action.id]: 0 },
      };
    case "ADD_PHOTO": {
      const cur = state.uploadedPhotos[action.id] || 0;
      const photos = state.lotteryPhotos[action.id] || [];
      return {
        ...state,
        uploadedPhotos: { ...state.uploadedPhotos, [action.id]: cur + 1 },
        lotteryPhotos: { ...state.lotteryPhotos, [action.id]: [...photos, action.photoUrl] }
      };
    }
    case "START_JOURNEY":
      return { ...state, startTime: Date.now() };
    case "TRACK_LOCATION":
      return {
        ...state,
        routeCoordinates: [
          ...state.routeCoordinates,
          { lat: action.lat, lng: action.lng, timestamp: Date.now() }
        ]
      };
    case "RESET_ALL":
      return initialState;
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  // Ensure all required fields exist (for development hot reload compatibility)
  if (!state || typeof state.startTime === 'undefined' || !Array.isArray(state.checkpointTimestamps) || typeof state.originCheckpointId === 'undefined' || !Array.isArray(state.modesUsed)) {
    console.warn('Store state incomplete, reinitializing...');
    return <AppContext.Provider value={{ state: initialState, dispatch }}>{children}</AppContext.Provider>;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState outside AppProvider");
  return ctx.state;
}

export function useAppDispatch(): React.Dispatch<Action> {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppDispatch outside AppProvider");
  return ctx.dispatch;
}
