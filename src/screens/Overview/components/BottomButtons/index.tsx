/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-shadow */
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState
} from "react";
import { BackHandler, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Box, Icon, Pressable, Text, useColorModeValue } from "native-base";
import { MotiView } from "moti";
import { Feather } from "@expo/vector-icons";

import { MainButtons } from "./main-bottom-buttons";
import { TodayBottomButtons } from "./today-bottom-buttons";
import { LaterBottomButtons } from "./later-bottom-buttons";

import type Task from "@/db/models/task";

interface BottomButtonProps {
  onPress: () => void;
  iconName?: string;
  colorLight?: string;
  colorDark?: string;
  label: string;
  iconText?: string;
  index?: number;
}

interface BottomButtonsProps {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
}

export const BottomButton = ({
  onPress,
  iconName,
  label,
  colorLight,
  colorDark,
  iconText,
  index
}: BottomButtonProps) => {
  const iconColor = useColorModeValue(colorLight, colorDark);
  const textColor = useColorModeValue(colorLight, colorDark);
  const { width } = useWindowDimensions();
  return (
    <MotiView
      style={{
        marginHorizontal: (width - 55 * 4) / 8,
        justifyContent: "center",
        alignItems: "center"
      }}
      from={{ opacity: 0, bottom: 20 }}
      animate={{ opacity: 1, bottom: 0 }}
      delay={index && index * 100}
    >
      <Pressable
        w="55px"
        borderWidth={1}
        borderColor="em.5"
        h="55px"
        bg="surface"
        borderRadius={30}
        alignItems="center"
        justifyContent="center"
        onPress={onPress}
      >
        {iconText ? (
          <Text
            fontSize="2xl"
            textAlign="center"
            color={textColor}
            adjustsFontSizeToFit
          >
            {iconText}
          </Text>
        ) : (
          <Icon color={iconColor} size={23} name={iconName} as={Feather} />
        )}
      </Pressable>
      <Text color="em.2">{label}</Text>
    </MotiView>
  );
};

const BottomButtons = ({ tasks, setTasks }: BottomButtonsProps) => {
  const [page, setPage] = useState<"main" | "today" | "later">("main");
  const { height } = useWindowDimensions();
  const a = useSafeAreaInsets();
  useEffect(() => {
    // addEventListener and removeEventListener must refer to the same function
    const onBackPress = () => {
      if (page === "main") {
        return false;
      }
      setPage("main");
      return true;
    };
    BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [page]);

  const removeTask = useCallback(() => {
    setTasks((tasks) => tasks.slice(1));
  }, []);
  const { t } = useTranslation();
  const pageProps = { task: tasks[0], removeTask, setPage };

  return (
    <>
      <Pressable
        onPress={() => {
          if (page !== "main") {
            setPage("main");
          }
        }}
        w="100%"
        h={height - 70 - 110}
        top={70 + a.top}
        position={"absolute"}
      />
      <Pressable
        alignSelf="flex-end"
        mx="20px"
        mb="10px"
        py="5px"
        px="8px"
        borderRadius={10}
        _light={{
          _pressed: { backgroundColor: "blue.50" }
        }}
        _dark={{
          _pressed: { backgroundColor: "blue.700:alpha.40" }
        }}
        onPress={() => {
          removeTask();
          setPage("main");
        }}
      >
        <Text
          fontSize="lg"
          _dark={{ color: "lightBlue.300" }}
          _light={{ color: "blue.500" }}
        >
          {t("skip")}
        </Text>
      </Pressable>
      <Box
        h="110px"
        bg="background"
        borderColor="em.4:alpha.50"
        borderTopWidth={1}
      >
        {page !== "main" ? null : <MainButtons {...pageProps} />}
        {page !== "today" ? null : <TodayBottomButtons {...pageProps} />}
        {page !== "later" ? null : <LaterBottomButtons {...pageProps} />}
      </Box>
    </>
  );
};

export default BottomButtons;
