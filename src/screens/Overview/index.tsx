/* eslint-disable @typescript-eslint/no-shadow */
import { Box, Heading, Text, useTheme } from "native-base";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { Q } from "@nozbe/watermelondb";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { MotiView } from "moti";
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";

import { BottomButtons, Fade, ModalView, NoTasks } from "./components";

import type Task from "@/db/models/task";
import { queryTasks } from "@/db/queries";
import { Columns } from "@/db/models/schema";
import withDB from "@/db/models/withDB";
import useAccent from "@/hooks/useAccent";
import type List from "@/db/models/list";

const ActiveTask = withDB(
  ({ task, list }: { task: Task; list: List }) => {
    const { em } = useTheme().colors;
    const accent = useAccent(list.theme);
    const progress = useSharedValue(0);
    progress.value = withTiming(1, {
      duration: 600
    });
    const animatedBackground = useAnimatedStyle(() => {
      const backgroundColor: string = interpolateColor(
        progress.value,
        [0, 1],
        [em[4], accent]
      );

      return {
        backgroundColor
      };
    }, [em, accent, task]);
    return (
      <MotiView
        style={{ flexDirection: "row", alignItems: "center" }}
        key={task.id}
        from={{ bottom: 70 }}
        animate={{ bottom: 0 }}
        exit={{ left: 14, opacity: 0 }}
        transition={{
          type: "timing",
          duration: 800,
          delay: 200
        }}
      >
        <MotiView
          transition={{ delay: 200 }}
          from={{ height: 25, width: 25 }}
          key={task.id + "1"}
          style={[{ borderRadius: 20 }, animatedBackground]}
          animate={{ height: 30, width: 30 }}
        />
        <MotiView
          animate={{ opacity: 1 }}
          from={{ opacity: 0 }}
          key={task.id + "2"}
          transition={{ type: "timing", duration: 300, delay: 600 }}
          style={{ height: 35 }}
        >
          <Box>
            <Box>
              <Text numberOfLines={2} fontSize="2xl" mx="4" color="em.1" bold>
                {task.name}
              </Text>
              <Text fontSize="sm" mx="4" color="em.2">
                {list.name}
              </Text>
            </Box>
          </Box>
        </MotiView>
      </MotiView>
    );
  },
  ["task"],
  ({ task }) => ({
    task: task,
    list: task.list
  })
);

export const OverviewScreen = () => {
  const { background } = useTheme().colors;
  useLayoutEffect(() => {
    NavigationBar.setBackgroundColorAsync(background);
  }, []);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    queryTasks({}, Q.where(Columns.task.isCompleted, Q.eq(false)))
      .fetch()
      .then((tasks) => {
        setTasks(tasks);
        setIsLoading(false);
      });
  }, []);

  const { t } = useTranslation();
  const greetings = useMemo(() => {
    const hrs = dayjs().hour();
    let msg = "good-night";
    if (hrs >= 5) {
      msg = "good-morning";
    } // After or 5am
    if (hrs >= 12) {
      msg = "good-afternoon";
    } // After or 12pm
    if (hrs >= 17) {
      msg = "good-evening";
    } // After or 5pm
    if (hrs >= 22 || (hrs >= 0 && hrs <= 3)) {
      msg = "good-night";
    } // After or 10pm and before 3am
    return t(msg);
  }, [t]);
  if (isLoading) {
    return <ModalView />;
  }
  if (tasks.length === 0) {
    return <NoTasks />;
  }
  return (
    <ModalView>
      <Box pb="70px" px="20px" flex={1}>
        <Fade position={28}>
          <Heading fontSize="3xl">{greetings}</Heading>
        </Fade>

        <Fade position={27} delay={200}>
          <Text fontSize="xl" color="em.3" mb="20">
            {t("task-left-count", {
              count: tasks.length,
              postProcess: "interval"
            })}
          </Text>
        </Fade>
        <MotiView
          animate={{ marginStart: 0 }}
          from={{ marginStart: 45 }}
          transition={{ damping: 26, delay: 500 }}
          key={tasks[0] && tasks[0].id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 40,
            marginTop: "auto"
          }}
        >
          {tasks.map((task, index) => {
            if (index === 0) {
              return null;
            }
            return (
              <Box
                key={task.id}
                h="25px"
                w="25px"
                bg="em.4"
                mr="5"
                borderRadius="20"
              />
            );
          })}
        </MotiView>
        {tasks.map((i, index) => {
          if (index !== 0) {
            return null;
          }
          return <ActiveTask task={i} key={i.id} />;
        })}
      </Box>
      <BottomButtons tasks={tasks} setTasks={setTasks} />
    </ModalView>
  );
};
