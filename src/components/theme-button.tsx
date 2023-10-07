import { Box, Pressable } from "native-base";

import type { listThemeType } from "@/theme/listTheme";

interface ThemeButtonProps {
  theme: listThemeType;
  active: boolean;
  onPress: () => void;
}

const ThemeButton = ({
  theme: { main, secondary },
  active,
  onPress
}: ThemeButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        width: 55,
        height: 55,
        padding: 6,
        marginEnd: 5,
        marginBottom: 5
      }}
      borderWidth={1}
      borderColor={active ? "em.4" : "transparent"}
      justifyContent="center"
      borderRadius={14}
      bg={active ? "em.4:alpha.50" : undefined}
      alignItems="center"
    >
      <Box
        left={secondary ? 2 : 0}
        w={secondary ? "30px" : "35px"}
        h={secondary ? "30px" : "35px"}
        bg={main}
        rounded="full"
      />
      {!secondary ? null : (
        <Box
          right={2}
          opacity={0.9}
          w="30px"
          h="30px"
          bg={secondary ?? "background"}
          rounded="full"
        />
      )}
    </Pressable>
  );
};

export default ThemeButton;
