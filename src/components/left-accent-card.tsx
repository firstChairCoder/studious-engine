import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";
import { Box, useColorModeValue, useTheme } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";
import chroma from "chroma-js";

import type { listThemeType } from "@/theme/listTheme";

interface ListCardProps {
  theme: listThemeType;
  children: ReactNode;
  onPress: () => void;
  style?: ViewStyle;
}

const LeftAccentCard = ({ theme, children, onPress, style }: ListCardProps) => {
  const { surface } = useTheme().colors;

  const bg = useColorModeValue(
    chroma(theme.main).mix(surface, 0.5).hex(),
    theme.secondary
  );
  const accentBg = useColorModeValue(theme.secondary ?? theme.main, theme.main);
  return (
    <TouchableOpacity
      style={{
        elevation: 1,
        backgroundColor: theme.secondary ? bg : surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        paddingBottom: 4,
        marginBottom: 10,
        flexDirection: "row",
        ...style
      }}
      onPress={onPress}
    >
      <Box
        w="4px"
        style={{ marginEnd: 15 }}
        my="1"
        bg={accentBg}
        borderRadius="3px"
      />
      <Box>{children}</Box>
    </TouchableOpacity>
  );
};

export default LeftAccentCard;
