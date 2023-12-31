import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import type { SchedulableNotificationTriggerInput } from "expo-notifications";
import {
  scheduleNotificationAsync,
  setNotificationHandler
} from "expo-notifications";
export type repeatType = "daily" | "weekly" | "monthly" | null;

type scheduleNotification = {
  name: string;
  id: string;
  date: Date;
  description: string;
  repeat: repeatType;
};
export function scheduleNotification({
  name,
  id,
  date,
  description,
  repeat
}: scheduleNotification) {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    })
  });
  scheduleNotificationAsync({
    identifier: id,
    content: {
      title: name,
      body: description === "" ? undefined : description
    },
    trigger: getTrigger(date, repeat)
  });
}
function getTrigger(
  date: Date,
  repeat: repeatType
): SchedulableNotificationTriggerInput {
  const d = dayjs(date);
  switch (repeat) {
    case "daily":
      return {
        hour: d.hour(),
        minute: d.minute(),
        repeats: true
      };
    case "weekly":
      return {
        weekday: d.day() + 1,
        hour: d.hour(),
        minute: d.minute(),
        repeats: true
      };
    case "monthly": {
      dayjs.extend(duration);
      return {
        seconds: dayjs.duration({ months: 1 }).asSeconds(),
        repeats: true
      };
    }
    default:
      return date;
  }
}
