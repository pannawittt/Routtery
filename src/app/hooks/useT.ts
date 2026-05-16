import { useAppState } from "@/app/store";
import { getT, type Translations } from "@/data/translations";

export function useT(): Translations {
  const { lang } = useAppState();
  return getT(lang);
}
