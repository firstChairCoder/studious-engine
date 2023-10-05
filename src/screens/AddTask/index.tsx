import {
  Box,
  Input,
  KeyboardAvoidingView,
  ScrollView,
  useTheme
} from "native-base";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { Platform } from "react-native";
import { setBackgroundColorAsync } from "expo-navigation-bar";

import { Label, ListChips, Reminders } from "./components";

import {
  AddSubtask,
  Footer,
  StatusBar,
  SubtaskCard,
  Switch
} from "@/components";
import useKeyboardStatus from "@/hooks/useKeyboardStatus";
import type { repeatType } from "@/db/models/schedule-noti";
import type { RootStackScreenProps } from "@/navigation/types";
import { storage } from "@/db/storage";
import { database } from "@/db/db";
import type List from "@/db/models/list";
import { Tables } from "@/db/models/schema";

interface AddSubtaskProps {
  subtasks: string[];
  setSubtasks: Dispatch<SetStateAction<string[]>>;
}

function AddSubtasks({ subtasks, setSubtasks }: AddSubtaskProps) {
  return (
    <Box pt="4">
      {subtasks.map((subtask, i) => (
        <SubtaskCard
          name={subtask}
          key={i}
          color="em.1"
          isCompleted={false}
          onDelete={() => {
            setSubtasks((s) => s.filter((a) => a !== subtask));
          }}
          onEndEditing={(name) => {
            if (!name) {
              return;
            }
            setSubtasks((sub) => {
              sub[i] = name;
              return sub;
            });
          }}
        />
      ))}
      <AddSubtask
        onAdd={(i) => {
          setSubtasks((tasks) => [...tasks, i]);
        }}
        color={"em.1"}
      />
    </Box>
  );
}

export const AddTaskScreen = ({
  route,
  navigation
}: RootStackScreenProps<"AddTask">) => {
  const keyboardVisible = useKeyboardStatus();
  const [activeListID, setActiveListID] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState<Date>(
    new Date(route.params?.date ?? Date.now())
  );
  const [reminderRepeat, setReminderRepeat] = useState<repeatType>(null);
  const [withReminder, setWithReminder] = useState(true);

  const { t } = useTranslation();
  const { surface } = useTheme().colors;

  useFocusEffect(() => {
    if (Platform.OS === "android") {
      setBackgroundColorAsync(surface);
    }
  });

  return (
    <KeyboardAvoidingView bg="surface" flex={1}>
      <ScrollView
        _contentContainerStyle={{
          bg: "surface",
          pb: "90px",
          flexGrow: 1
        }}
      >
        <Box bg="surface" px="5" pt="2">
          <StatusBar />
          <Label l={t("task-title")} mb={2} />
          <Input value={name} onChangeText={(i) => setName(i)} fontSize="lg" />
          <Label l={t("list", { count: 2, postProcess: "interval" })} mt="5" />
          <ListChips
            initialListID={
              route.params?.defaultList ?? storage.getString("default-list")
            }
            {...{ database, activeListID, setActiveListID }}
          />
          <Box mb={2} mt="5" flexDirection="row" alignItems="center">
            <Label l={t("reminders")} />
            <Switch
              style={{ marginStart: "auto" }}
              value={withReminder}
              onValueChange={(i) => setWithReminder(i)}
            />
          </Box>
          <Reminders
            setRepeat={setReminderRepeat}
            initialRepeat={reminderRepeat}
            active={withReminder}
            date={reminder}
            setDate={setReminder}
          />

          <Label mb={2} l={t("description")} mt="5" />

          <Input
            selectionColor="em.10"
            value={description}
            onChangeText={(i) => setDescription(i)}
            fontSize="lg"
            numberOfLines={4}
            textAlignVertical="top"
            multiline={true}
          />
          <Label l={t("subtask", { count: 1 })} mt="5" />
          <AddSubtasks {...{ subtasks, setSubtasks }} />
        </Box>
      </ScrollView>
      <Footer
        containerBg="surface"
        onPress={() => {
          if (!(activeListID && name)) {
            return;
          }
          database
            .get<List>(Tables.List)
            .find(activeListID)
            .then((l) => {
              l.addTask({
                name,
                description,
                subtasks,
                reminderRepeat,
                reminder: withReminder ? reminder : undefined
              });
            })
            .finally(() => {
              navigation.pop();
            });
        }}
        label={t("create-new-task")}
        keyboardVisible={keyboardVisible}
      />
    </KeyboardAvoidingView>
  );
};
