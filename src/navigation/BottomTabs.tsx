/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import { useColorMode, useTheme } from "native-base";
import { useTranslation } from "react-i18next";
import {
  CalendarIcon,
  HomeIcon,
  ListIcon,
  SettingsIcon
} from "assets/tab-bar-icons";

import type { RootTabParamList } from "./types";

import { HomeScreen } from "@/screens/Home";

const Tab = createBottomTabNavigator<RootTabParamList>();
export default function BottomTabNavigator() {
  const { t } = useTranslation();
  const { colorMode } = useColorMode();
  const { surface, background } = useTheme().colors;
  useFocusEffect(() => {
    setBackgroundColorAsync(colorMode === "dark" ? background : surface);
  });
  return (
    <Tab.Navigator
      initialRouteName="Home"
      detachInactiveScreens
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        headerStyle:
          colorMode !== "dark"
            ? {}
            : {
                borderBottomColor: surface,
                borderBottomWidth: 1,
                elevation: 0,
                shadowOpacity: 0
              }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: (p) => <HomeIcon {...p} />,
          headerShown: true,
          title: t("all-tasks")
        }}
      />
      <Tab.Screen
        name="Lists"
        component={HomeScreen}
        options={{
          tabBarIcon: (p) => <ListIcon {...p} />,
          lazy: false
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={HomeScreen}
        options={{
          tabBarIcon: (p) => <CalendarIcon {...p} />
        }}
      />
      <Tab.Screen
        name="Settings"
        component={HomeScreen}
        options={{
          tabBarIcon: (p) => <SettingsIcon {...p} />,
          headerShown: true,
          title: t("settings")
        }}
      />
    </Tab.Navigator>
  );
}
