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
    element: <Root />,
    children: [
      { index: true, element: <Splash /> },
      { path: "plan", element: <Plan /> },
      { path: "mode", element: <SelectMode /> },
      { path: "map", element: <MapView /> },
      { path: "explore", element: <Explore /> },
      { path: "lottery", element: <Lottery /> },
      { path: "lottery/active", element: <LotteryActive /> },
      { path: "summary", element: <Summary /> },
      { path: "stamps", element: <Stamps /> },
    ],
  },
]);
