import { Box, Divider, Switch } from "native-base";

import Container from "./container";
import Label from "./label";
import Description from "./description";

interface SettingsSwitchProps {
  onValueChange?: (value: boolean) => void;
  value?: boolean;
  description?: string;
  label?: string;
}
export const SettingsSwitch = ({
  value,
  onValueChange,
  label,
  description
}: SettingsSwitchProps) => {
  return (
    <Container
      onPress={() => {
        onValueChange && onValueChange(!value);
      }}
    >
      <Box flex={5}>
        {!label ? null : <Label>{label}</Label>}
        {!description ? null : <Description>{description}</Description>}
      </Box>
      {!description ? null : (
        <Divider
          h={10}
          style={{ marginHorizontal: 10 }}
          _light={{ bg: "em.1:alpha.10" }}
          orientation="vertical"
        />
      )}
      <Box flex={1}>
        <Switch {...{ value, onValueChange }} />
      </Box>
    </Container>
  );
};

export default SettingsSwitch;
