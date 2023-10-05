import { Feather } from "@expo/vector-icons";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Box, Icon, Text, useColorModeValue } from "native-base";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import dayjs from "dayjs";

import { DatePicker } from "@/hooks/DatePicker";
import type { repeatType } from "@/db/models/schedule-noti";

interface RemindersProps {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  setRepeat: Dispatch<SetStateAction<repeatType>>;
  initialRepeat?: repeatType;
  active: boolean;
}

interface ButtonProps {
  icon: ReactNode;
  label?: string;
  bg: string;
  color: string;
  onPress?: () => void;
}
const Button = ({ icon, bg, color, label, onPress }: ButtonProps) => {
  return (
    <Box w="70px" justifyContent="center" alignItems="center">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.4}
        style={{ borderRadius: 100, width: 60, height: 60 }}
      >
        <Box
          w="100%"
          h="100%"
          borderRadius={10}
          justifyContent="center"
          alignItems="center"
          bg={bg}
        >
          <Icon as={icon} color={color} size={28} />
        </Box>
      </TouchableOpacity>
      <Text mt="1" textAlign="center">
        {label}
      </Text>
    </Box>
  );
};

const Reminders = ({
  active,
  date,
  setDate,
  setRepeat: setRepeatType,
  initialRepeat
}: RemindersProps) => {
  const colorIntensity = useColorModeValue("200", "400");
  const showDatePicker = DatePicker(date, setDate);
  const sheetRef = useRef<BottomSheetModalMethods>(null);
  const { t } = useTranslation();
  return (
    <Box
      opacity={active ? 1 : 0.5}
      pointerEvents={active ? "auto" : "none"}
      mt="5"
      justifyContent="space-around"
      alignItems="flex-start"
      flexDirection="row"
    >
      <Button
        onPress={() => showDatePicker()}
        label={dayjs(date).format("MMM D\nhh:mm A")}
        color="black"
        bg={`blue.${colorIntensity}`}
        icon={<Feather name="watch" />}
      />
      <Button
        onPress={() => {
          sheetRef.current?.present();
        }}
        label={t(initialRepeat ? `r-${initialRepeat}` : "none")}
        color="black"
        bg={`red.${colorIntensity}`}
        icon={<Feather name="repeat" />}
      />
      {/* <SelectRepeatSheet
        ref={sheetRef}
        date={date}
        initialRepeat={initialRepeat}
        onChange={(r) => {
          setRepeatType(r);
        }}
      /> */}
    </Box>
  );
};

export default Reminders;
