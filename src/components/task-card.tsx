import { MotiView } from "moti";
import { Pressable, StyleSheet } from "react-native";
import { Box, Text } from "native-base";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import CheckBox from "./check-box";
import Chip from "./chip";

import type Task from "@/db/models/task";
import useAccent from "@/hooks/useAccent";
import withDB from "@/db/models/withDB";
import type List from "@/db/models/list";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 10
  }
});

interface TaskCardProps {
  task: Task;
  list: List;
  onPress: () => void;
  animationDelay?: number;
  withDate?: boolean;
}
interface DateChipProps {
  date: Date;
}

const DateChip = ({ date }: DateChipProps) => {
  const { t } = useTranslation();
  const label = useMemo(() => {
    const d = dayjs(date);
    if (d.isToday()) {
      return d.format("h:mm A");
    }
    if (d.isTomorrow()) {
      return t("tomorrow") + d.format(" hh:mm A");
    }
    if (d.isSame(date, "year")) {
      return d.format("MMM D");
    }
    return d.format("MMM D, YYYY");
  }, [date]);
  return <Chip {...{ label }} />;
};

const TaskCard = ({
  task,
  list: { theme },
  onPress,
  ...options
}: TaskCardProps) => {
  const accent = useAccent(theme);
  return (
    <Pressable onPress={onPress}>
      <MotiView
        animate={{
          top: 0,
          opacity: task.isCompleted ? 0.6 : 1
        }}
        transition={{
          delay: options.animationDelay,
          damping: 20,
          stiffness: 200
        }}
        from={{ top: 18, opacity: 0.2 }}
        exit={{
          height: 0,
          opacity: 0,
          marginBottom: -1,
          paddingVertical: 0
        }}
        style={styles.container}
      >
        <Box alignSelf="flex-start" pt="1">
          <CheckBox
            value={task.isCompleted}
            onToggle={(i) => task.setIsCompleted(i)}
            withTint
            color={accent}
          />
        </Box>
        <Box flexWrap="wrap" alignItems="center" flex={1} flexDir="row">
          <Text
            textAlign="left"
            noOfLines={3}
            fontSize="lg"
            color="em.1:alpha.80"
            textDecorationLine={task.isCompleted ? "line-through" : undefined}
          >
            {task.name}
          </Text>
          {!task.reminder ? null : <DateChip date={task.reminder} />}
        </Box>
      </MotiView>
    </Pressable>
  );
};

export default withDB<TaskCardProps, { task: Task; list: List }>(
  TaskCard,
  ["task"],
  ({ task }) => ({
    task,
    // list: ""
    list: task.list
  })
);
