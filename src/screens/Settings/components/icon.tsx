import { Feather } from "@expo/vector-icons";
import { Icon } from "native-base";

interface SettingsIconProps {
  me?: number;
  ms?: number;
  mx?: number;
  color?: string;
  iconName?: string;
}

const SettingsIcon = ({
  iconName,
  me = 5,
  ms,
  mx,
  color = "em.2"
}: SettingsIconProps) => {
  return (
    <Icon
      size={25}
      color={color}
      style={{ marginEnd: me, marginStart: ms, marginHorizontal: mx }}
      name={iconName}
      as={Feather}
    />
  );
};

export default SettingsIcon;
