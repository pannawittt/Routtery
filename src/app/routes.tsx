import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Splash } from "@/pages/Splash";
import { Plan } from "@/pages/Plan";
import { SelectMode } from "@/pages/SelectMode";
import { Explore } from "@/pages/Explore";
import { MapView } from "@/pages/MapView";
import { Lottery } from "@/pages/Lottery";
import { LotteryActive } from "@/pages/LotteryActive";
import { Summary } from "@/pages/Summary";
import { Stamps } from "@/pages/Stamps";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Splash },
      { path: "plan", Component: Plan },
      { path: "mode", Component: SelectMode },
      { path: "map", Component: MapView },
      { path: "explore", Component: Explore },
      { path: "lottery", Component: Lottery },
      { path: "lottery/active", Component: LotteryActive },
      { path: "summary", Component: Summary },
      { path: "stamps", Component: Stamps },
    ],
  },
]);
