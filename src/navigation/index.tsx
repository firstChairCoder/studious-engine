import type { Theme } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import { useColorMode } from "native-base";
import { OverflowMenuProvider } from "react-navigation-header-buttons";
import { useEffect } from "react";

import LinkingConfiguration from "./LinkingConfiguration";
import { RootNavigator } from "./RootStack";

import { DARK_MODE, LIGHT_MODE } from "@/theme";
const DarkTheme: Theme = {
  dark: true,
  colors: {
    background: DARK_MODE.background,
    text: DARK_MODE.em[1],
    primary: DARK_MODE.em[2],
    card: DARK_MODE.background,
    border: DARK_MODE.surface,
    notification: "red"
  }
};
const LightTheme: Theme = {
  dark: false,
  colors: {
    background: LIGHT_MODE.background,
    text: LIGHT_MODE.em[1],
    primary: LIGHT_MODE.em[1],
    card: LIGHT_MODE.surface,
    border: LIGHT_MODE.em[4],
    notification: "red"
  }
};
export default function Navigation() {
  const { colorMode } = useColorMode();

  useEffect(() => {
    setBackgroundColorAsync(colorMode === "dark" ? "#131313" : "#FFF");
  }, [colorMode]);

  return (
    <OverflowMenuProvider>
      <NavigationContainer
        theme={colorMode === "dark" ? DarkTheme : LightTheme}
        linking={LinkingConfiguration}
      >
        <RootNavigator />
      </NavigationContainer>
    </OverflowMenuProvider>
  );
}
