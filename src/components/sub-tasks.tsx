import { AnimatePresence, MotiView } from "moti";
import { forwardRef, useEffect, useRef, useState } from "react";
import {
  type NativeSyntheticEvent,
  Pressable,
  type TextInput,
  type TextInputSubmitEditingEventData
} from "react-native";
import { Icon, Input, Text } from "native-base";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import CheckBox from "./check-box";

import type { ISubtask } from "@/db/models/task";

type SubtaskCardProps = Partial<ISubtask> & {
  color: string;
  onToggle?: () => void;
  onDelete?: () => void;
  onEndEditing?: (newName: string) => void;
  onSubmitEditing?: (
    i: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  blurOnSubmit?: boolean;
  index?: number;
};

const SubtaskCard = forwardRef<TextInput, SubtaskCardProps>((props, ref) => {
  const {
    onToggle,
    isCompleted,
    color,
    index,
    name,
    onEndEditing,
    onDelete,
    onSubmitEditing,
    blurOnSubmit = true
  } = props;
  return (
    <MotiView
      from={{
        opacity: 0,
        marginBottom: 0,
        paddingVertical: 3
      }}
      animate={{
        opacity: 1,
        marginBottom: 15,
        paddingVertical: 3
      }}
      exit={{
        marginBottom: -0.1,
        opacity: 0,
        paddingVertical: 0,
        maxHeight: -10
      }}
      transition={{ delay: index ? index * 40 : 0, damping: 25 }}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <CheckBox value={!!isCompleted} onToggle={onToggle} color={color} />
      <Input
        ref={ref}
        fontSize="lg"
        variant="unstyled"
        textAlign="left"
        flex={1}
        color={color}
        multiline={blurOnSubmit}
        textDecorationLine={isCompleted ? "line-through" : undefined}
        blurOnSubmit={blurOnSubmit}
        defaultValue={name}
        onEndEditing={(v) => {
          onEndEditing && onEndEditing(v.nativeEvent.text);
        }}
        onSubmitEditing={onSubmitEditing}
        p="0"
        m="0"
      />
      <Pressable
        style={{ marginStart: 10, padding: 4 }}
        hitSlop={5}
        onPress={onDelete}
      >
        <Icon as={Feather} name="x" size={21} color={color} />
      </Pressable>
    </MotiView>
  );
});

export type AddSubtaskProps = {
  onAdd: (name: string) => void;
  color: string;
};
const AddSubtask = ({ onAdd, color }: AddSubtaskProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<TextInput>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      ref.current?.focus();
    }
  }, [isOpen]);
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <SubtaskCard
            blurOnSubmit={false}
            onSubmitEditing={(i) => {
              if (!i.nativeEvent.text) {
                setIsOpen(false);
                return;
              }
              onAdd(i.nativeEvent.text);
              ref.current?.clear();
            }}
            ref={ref}
            isCompleted={false}
            color={color}
            onDelete={() => {
              setIsOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <Pressable
        onPress={() => {
          setIsOpen(true);
          ref.current?.focus();
        }}
        style={{ marginStart: 10 }}
      >
        <Text _dark={{ color: "blue.400" }} color="blue.500" fontSize="md">
          {t("add")} {t("subtask", { count: 1 })}
        </Text>
      </Pressable>
    </>
  );
};

export { SubtaskCard, AddSubtask };
