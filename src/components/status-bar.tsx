/* eslint-disable react-native/split-platform-components */
import { useIsFocused } from "@react-navigation/native";
import { useColorModeValue } from "native-base";
import { useMemo } from "react";
import type {
  StatusBarPropsAndroid,
  StatusBarPropsIOS,
  StatusBarStyle
} from "react-native";
import { StatusBar as RNStatusBar } from "react-native";
type StatusBarProps = StatusBarPropsAndroid &
  StatusBarPropsIOS & {
    barStyle?: StatusBarStyle;
    _dark?: StatusBarStyle;
    _light?: StatusBarStyle;
    animated?: boolean;
  };
export default function StatusBar({
  _dark,
  _light,
  barStyle,
  ...p
}: StatusBarProps) {
  const isDarkMode = useColorModeValue(false, true);
  const style = useMemo(() => {
    if (_dark && isDarkMode) {
      return _dark;
    }
    if (_light && !isDarkMode) {
      return _light;
    }
    if (typeof barStyle !== "undefined") {
      return barStyle;
    }

    return !isDarkMode ? "dark-content" : "light-content";
  }, [_dark, _light, barStyle, isDarkMode]);
  const isFocused = useIsFocused();

  if (isFocused) {
    return <RNStatusBar {...p} barStyle={style} />;
  }
  return null;
}
