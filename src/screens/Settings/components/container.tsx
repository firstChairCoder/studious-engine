import { Box } from "native-base";
import type { ReactNode } from "react";
import { I18nManager, Pressable } from "react-native";

import SettingsIcon from "./icon";

interface ContainerProps {
  children: ReactNode;
  iconName?: string;
  onPress?: () => void;
  withEndArrow?: boolean;
}

const Container = ({
  children,
  iconName,
  onPress,
  withEndArrow
}: ContainerProps) => {
  const component = (
    <Box
      flexDirection="row"
      px="10px"
      alignItems="center"
      py="2"
      _dark={{ bg: "surface" }}
      bg="em.6"
      mx="4"
      mb="10px"
      borderRadius="lg"
    >
      {!iconName ? null : <SettingsIcon iconName={iconName} />}
      <Box
        alignItems="center"
        flexDirection="row"
        flex={1}
        justifyContent="space-between"
      >
        {children}
      </Box>
      {!withEndArrow ? null : (
        <SettingsIcon
          me={0}
          iconName={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
        />
      )}
    </Box>
  );
  if (onPress) {
    return (
      <Box>
        <Pressable onPress={onPress}>{component}</Pressable>
      </Box>
    );
  }
  return component;
};

export default Container;
