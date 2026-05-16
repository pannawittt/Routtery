import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { Mode, LotteryStatus, Lang } from "@/data/constants";
import { lotteryData } from "@/data/constants";

interface AppState {
  lang: Lang;
  origin: string;
  destination: string;
  selectedCheckpoints: string[];
  mode: Mode | null;
  currentCheckpoint: number;
  completedCheckpoints: boolean[];
  checkpointAnswers: (number | null)[];
  lotteryStatuses: Record<number, LotteryStatus>;
  activeLotteryId: number | null;
  uploadedPhotos: Record<number, number>;
}

type Action =
  | { type: "SET_LANG"; lang: Lang }
  | { type: "SET_PLAN"; origin: string; destination: string; checkpoints: string[] }
  | { type: "SET_MODE"; mode: Mode }
  | { type: "SELECT_ANSWER"; idx: number; answer: number }
  | { type: "COMPLETE_CHECKPOINT"; idx: number }
  | { type: "ADVANCE_CHECKPOINT" }
  | { type: "ACTIVATE_LOTTERY"; id: number }
  | { type: "COMPLETE_LOTTERY"; id: number }
  | { type: "RESET_LOTTERY"; id: number }
  | { type: "ADD_PHOTO"; id: number }
  | { type: "RESET_ALL" };

const initialLotteryStatuses: Record<number, LotteryStatus> = Object.fromEntries(
  lotteryData.map(l => [l.id, "available" as LotteryStatus])
);

export const initialState: AppState = {
  lang: "TH",
  origin: "",
  destination: "",
  selectedCheckpoints: [],
  mode: null,
  currentCheckpoint: 0,
  completedCheckpoints: [false, false, false, false, false, false],
  checkpointAnswers: [null, null, null, null, null, null],
  lotteryStatuses: initialLotteryStatuses,
  activeLotteryId: null,
  uploadedPhotos: {},
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_LANG":
      return { ...state, lang: action.lang };
    case "SET_PLAN":
      return { ...state, origin: action.origin, destination: action.destination, selectedCheckpoints: action.checkpoints };
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SELECT_ANSWER": {
      const answers = [...state.checkpointAnswers];
      answers[action.idx] = action.answer;
      return { ...state, checkpointAnswers: answers };
    }
    case "COMPLETE_CHECKPOINT": {
      const completed = [...state.completedCheckpoints];
      completed[action.idx] = true;
      return { ...state, completedCheckpoints: completed };
    }
    case "ADVANCE_CHECKPOINT":
      return { ...state, currentCheckpoint: Math.min(state.currentCheckpoint + 1, 5) };
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
      return { ...state, uploadedPhotos: { ...state.uploadedPhotos, [action.id]: cur + 1 } };
    }
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
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
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
