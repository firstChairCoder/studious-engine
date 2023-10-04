import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import type { RootStackParamList } from "./types";

const { Navigator, Group, Screen } =
  createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { t } = useTranslation();
  //   const { surface } = useTheme().colors;
  return (
    <Navigator>
      <Group screenOptions={{ headerShown: false }}>
        <Screen name="Root" component={BottomTabNavigator} />
        {/* <Screen
          options={{
            presentation: "modal"
          }}
          name="Overview"
          component={Overview}
        /> */}
      </Group>
      {/*   <Screen
        options={{
          title: t("create-new-task"),
          presentation: "modal",
          headerStyle: {
            backgroundColor: surface
          },
          headerShadowVisible: false
        }}
        name="AddTask"
        component={AddTaskScreen}
      /> */}
    </Navigator>
  );
}