import { type ReactNode, useMemo } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import useColorMode from "./hooks/useColorScheme";

import theme, { colorModeManager, DARK_MODE } from "@/theme";

type ProviderProps = {
  children: ReactNode;
};
export default function Providers({ children }: ProviderProps) {
  const { colorMode } = useColorMode();
  const t = useMemo(() => {
    if (colorMode === "dark") {
      return {
        ...theme,
        colors: {
          ...theme.colors,
          ...DARK_MODE
        }
      };
    }
    return theme;
  }, [colorMode]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ backgroundColor: t.colors.background }}>
        <NativeBaseProvider theme={t} colorModeManager={colorModeManager}>
          <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
