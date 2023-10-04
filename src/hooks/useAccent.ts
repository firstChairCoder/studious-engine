import { useColorModeValue } from "native-base";

import type { listThemeType } from "@/theme/listThemes";

type useAccentOptions = {
  noSecondary?: string;
  flip?: boolean;
};
export default function useAccent(
  theme: listThemeType,
  { noSecondary: defaultSecondary, flip }: useAccentOptions = {}
) {
  const isDark = useColorModeValue(false, true);
  if (!theme.secondary) {
    return defaultSecondary ?? theme.main;
  }
  if (flip) {
    return isDark ? theme.secondary : theme.main;
  }
  return isDark ? theme.main : theme.secondary;
}
