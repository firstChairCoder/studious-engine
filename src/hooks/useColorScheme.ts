import { useColorScheme } from "react-native";
import { useColorMode as useColorModeNB } from "native-base";
import { useMMKVString } from "react-native-mmkv";

import { storage } from "@/db/storage";
type colorModeReturnType = {
  setColorMode: (value: "light" | "dark" | "system-default") => void;
  colorMode: "light" | "dark";
  isSystemDefault: boolean;
};
export default function useColorMode(): colorModeReturnType {
  const [colorMode, _] = useMMKVString("@color-mode", storage);
  const { setColorMode } = useColorModeNB();
  const systemColorMode = useColorScheme();
  const res: colorModeReturnType = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    colorMode: colorMode ?? "light",
    setColorMode
  };
  if (colorMode === "dark" || colorMode === "light") {
    res.colorMode = colorMode;
    return res;
  }
  if (typeof systemColorMode !== "string") {
    return res;
  }
  res.isSystemDefault = true;
  res.colorMode = systemColorMode;
  return res;
}
