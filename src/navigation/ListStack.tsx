import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { ListStackType } from "./types";

import { ListRootScreen } from "@/screens/ListRoot";

const Stack = createNativeStackNavigator<ListStackType>();
export default function ListStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "",
        headerShadowVisible: false
      }}
      initialRouteName="Root"
    >
      <Stack.Screen
        name="Root"
        options={{ headerShown: false }}
        component={ListRootScreen}
      />
      {/* <Stack.Screen name="Task" component={TaskScreen} />
      <Stack.Screen name="List" component={ListScreen} /> */}
    </Stack.Navigator>
  );
}
