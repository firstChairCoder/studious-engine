import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { DateData } from "react-native-calendars";
import type { MarkingProps } from "react-native-calendars/src/calendar/day/marking";

import type Task from "@/db/models/task";

export default function useDateMarks(
  date: string | undefined,
  setDate: (timestamp: string | undefined) => void,
  tasks: Task[]
) {
  const [markedDates, setM] = useState<{ [x: string]: MarkingProps }>({});
  const onChange = (i: DateData) => {
    if (date && dayjs(i.timestamp).format("YYYY-MM-DD") === date) {
      setDate(undefined);
    } else {
      setDate(dayjs(i.timestamp).format("YYYY-MM-DD"));
    }
  };
  useEffect(() => {
    MarkDates(tasks, date).then((i) => {
      setM(i);
    });
  }, [tasks, date]);
  return { markedDates, onChange };
}

const MarkDates = async (tasks: Task[], selected?: string) => {
  const obj: { [x: string]: MarkingProps } = {};
  for (const i in tasks) {
    const value = tasks[i];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-shadow
    const theme = await value.list.fetch().then((i) => i!.theme);
    const d = dayjs(value.reminder).format("YYYY-MM-DD");
    const dot = { key: value.id, color: theme.main };
    const dots = obj[d]?.dots;
    obj[d] = {
      dots: dots ? [...dots, dot] : [dot]
    };
  }
  if (selected) {
    obj[selected] = {
      ...obj[selected],
      selected: true
    };
  }

  return obj;
};
