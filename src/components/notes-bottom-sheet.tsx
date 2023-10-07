import type { BottomSheetModalProps } from "@gorhom/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "native-base";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { BackHandler } from "react-native";

const NotesBottomSheet = forwardRef<
  BottomSheetModalMethods,
  BottomSheetModalProps
>((p, ref) => {
  const { colors } = useTheme();
  const innerRef = useRef<BottomSheetModalMethods>(null);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  useImperativeHandle(ref, () => innerRef.current);
  const [isShowing, setIsShowing] = useState(false);
  useFocusEffect(
    useCallback(() => {
      // addEventListener and removeEventListener must refer to the same function
      const onBackPress = () => {
        if (isShowing) {
          innerRef.current?.dismiss();
          return true; // TS complains if handler doesn't return a boolean
        } else {
          return false;
        }
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [innerRef, isShowing])
  );
  const onChange = useCallback((i: number) => {
    setIsShowing(i > -1);
    p.onChange && p.onChange(i);
  }, []);
  return (
    <BottomSheetModal
      handleIndicatorStyle={{
        width: 45,
        marginTop: 8,
        backgroundColor: colors.em[2]
      }}
      backgroundStyle={{ backgroundColor: colors.background }}
      {...p}
      onChange={onChange}
      ref={innerRef}
    />
  );
});

export default NotesBottomSheet;
