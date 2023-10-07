/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import { Box, Text, useTheme } from "native-base";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { Q } from "@nozbe/watermelondb";

import type { useNavigationProps } from "@/navigation/types";
import type Task from "@/db/models/task";
import withDB from "@/db/models/withDB";
import { queryTasks } from "@/db/queries";
import { Columns } from "@/db/models/schema";
import type List from "@/db/models/list";
import { Backdrop, DateSeparator, LeftAccentCard } from "@/components";

interface AgendaProps {
  tasks: Task[];
  selectedDate: string | undefined;
  calendarHeight: number;
}

const RawAgendaSheet = ({
  tasks,
  selectedDate,
  calendarHeight
}: AgendaProps) => {
  const navigation = useNavigation<useNavigationProps>();
  const { height: deviceHeight } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const snapPoints = useMemo(
    () => [deviceHeight - calendarHeight - top - 20, "90%"],
    [calendarHeight]
  );
  const { colors } = useTheme();
  return (
    <BottomSheet
      backdropComponent={(p) => (
        <Backdrop pointerEvents="none" {...p} from={[0, 1]} />
      )}
      handleIndicatorStyle={{
        width: 45,
        marginTop: 8,
        backgroundColor: colors.em[2]
      }}
      backgroundStyle={{ backgroundColor: colors.background }}
      snapPoints={snapPoints}
    >
      <BottomSheetFlatList
        data={tasks}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 10 }}
        ListHeaderComponent={() => {
          return (
            <>
              {!selectedDate ? (
                tasks.length !== 0 ? null : (
                  <DateSeparator l={selectedDate ?? dayjs().toString()} />
                )
              ) : (
                <DateSeparator l={selectedDate ?? dayjs().toString()} />
              )}
            </>
          );
        }}
        renderItem={({ item: v, index: i }) => {
          const previous = i === 0 ? null : tasks[i - 1].reminder;
          return (
            <Box key={v.id}>
              {selectedDate ? null : (
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                <DateSeparator date={v.reminder!} previous={previous} />
              )}
              <AgendaCard navigation={navigation} key={v.id} task={v} />
            </Box>
          );
        }}
      />
    </BottomSheet>
  );
};

export const AgendaSheet = withDB<AgendaProps, { tasks: Task[] }>(
  RawAgendaSheet,
  ["selectedDate"],
  ({ selectedDate }) => ({
    tasks: queryTasks(
      {
        from: dayjs(selectedDate).startOf("day").valueOf(),
        to: selectedDate
          ? dayjs(selectedDate).endOf("day").valueOf()
          : undefined
      },
      Q.where(Columns.task.isCompleted, Q.eq(false)),
      Q.sortBy(Columns.task.reminder, Q.asc)
    )
  })
);
type AgendaCardProps = {
  task: Task;
  list: List;
  navigation: useNavigationProps;
};
const RawAgendaCard = ({ list, task, navigation }: AgendaCardProps) => {
  return (
    <LeftAccentCard
      onPress={() =>
        navigation.navigate("Task", {
          theme: list.theme,
          taskID: task.id
        })
      }
      theme={list.theme}
    >
      <Box alignItems="flex-start" flexDir="row">
        <Box w="73%">
          <Text textAlign="left" fontSize="xl" bold noOfLines={2}>
            {task.name}
          </Text>
          <Text fontSize="md" textAlign="left" noOfLines={1}>
            {list.name}
          </Text>
        </Box>
        <Box style={{ marginStart: "auto" }}>
          <Text fontSize="md">{dayjs(task.reminder).format("h:mmA")}</Text>
          <Text fontSize="sm">{dayjs(task.reminder).format("ddd")}</Text>
        </Box>
      </Box>
    </LeftAccentCard>
  );
};
const AgendaCard = withDB<AgendaCardProps, { list: List }>(
  RawAgendaCard,
  ["task"],
  ({ task }) => ({
    list: task.list
  })
);
