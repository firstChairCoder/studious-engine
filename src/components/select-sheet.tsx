/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Box, Pressable, Text, useTheme } from "native-base";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import { BackHandler } from "react-native";

import Backdrop from "./backdrop";
import CheckBox from "./check-box";

interface SelectProps {
  value: string;
  items: string[] | { value: string; label: string }[];
  onChange: (value: string) => void;
}
const SelectSheet = forwardRef<BottomSheetModalMethods, SelectProps>(
  ({ onChange, value, items }, ref) => {
    const bottomSheetRef = useRef<BottomSheetModalMethods>(null);
    const [isShowing, setIsShowing] = useState(false);
    //@ts-ignore
    useImperativeHandle(ref, () => bottomSheetRef.current);
    const snapPoints = useMemo(() => [60 * items.length + 40, "80%"], [items]);
    const { em, surface } = useTheme().colors;

    useEffect(() => {
      // addEventListener and removeEventListener must refer to the same function
      const onBackPress = () => {
        if (isShowing) {
          bottomSheetRef.current?.dismiss();
          return true; // TS complains if handler doesn't return a boolean
        } else {
          return false;
        }
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [bottomSheetRef, isShowing]);

    return (
      <BottomSheetModal
        onChange={(i) => setIsShowing(i > -1)}
        ref={bottomSheetRef}
        enableDismissOnClose
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          width: 45,
          marginTop: 8,
          backgroundColor: em[2]
        }}
        backgroundStyle={{ backgroundColor: surface }}
        backdropComponent={(i) => <Backdrop {...i} />}
      >
        <BottomSheetScrollView>
          <>
            {items.map((item) => (
              <Pressable
                alignItems="center"
                justifyContent="flex-start"
                flexDir="row"
                px="20px"
                borderRadius="0"
                h={60}
                onPress={() => {
                  if (typeof item === "string") {
                    onChange(item);
                  } else {
                    onChange(item.value);
                  }
                  bottomSheetRef.current?.close();
                }}
                key={typeof item === "string" ? item : item.value}
              >
                <Box pointerEvents="none">
                  <CheckBox
                    color={em[2]}
                    iconColor={em[10]}
                    value={
                      typeof item === "string"
                        ? item === value
                        : item.value === value
                    }
                    size={20}
                  />
                </Box>
                <Text textAlign="left" fontSize="lg" flex={1} color="em.2">
                  {typeof item === "string" ? item : item.label}
                </Text>
              </Pressable>
            ))}
          </>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

export default SelectSheet;
