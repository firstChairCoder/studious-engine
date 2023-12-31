/* eslint-disable @typescript-eslint/no-empty-function */
import type { Relation, TableName } from "@nozbe/watermelondb";
import { associations, Model } from "@nozbe/watermelondb";
import {
  date,
  field,
  json,
  relation,
  text,
  writer
} from "@nozbe/watermelondb/decorators";
import { cancelScheduledNotificationAsync } from "expo-notifications";

import { Columns, Tables } from "./schema";
import { storage } from "../storage";
import { type repeatType, scheduleNotification } from "./schedule-noti";
import type List from "./list";

const Column = Columns.task;

export interface ISubtask {
  name: string;
  isCompleted: boolean;
}
export type subtaskObject = { [x: string]: ISubtask };
type editTaskType = {
  name?: string;
  description?: string;
  reminder?: Date | null;
  repeat?: repeatType;
};

const sanitize = (subtasks: any): subtaskObject => {
  if (typeof subtasks !== "object") {
    return {};
  }
  return subtasks;
};

export default class Task extends Model {
  public static table: TableName<Task> = Tables.Task;
  public static associations = associations([
    Tables.List,
    { type: "belongs_to", key: Column.listID }
  ]);

  @text(Column.name) name!: string;
  @field(Column.isCompleted) isCompleted!: boolean;
  @text(Column.description) description!: string;
  @json(Column.subtasks, sanitize) subtasks!: subtaskObject;
  @date(Column.reminder) reminder!: Date | null;
  @text(Column.repeat) repeat!: repeatType;
  @relation(Tables.List, Column.listID) list!: Relation<List>;

  @writer async markAsDeleted() {
    // to update the list number
    this.list.fetch().then((list) => {
      list?.update(() => {});
    });
    await this.cancelNotification();
    await super.markAsDeleted();
  }

  async cancelNotification() {
    await cancelScheduledNotificationAsync(this.id);
  }

  @writer async updateSubtasks(newSubtasks: subtaskObject) {
    await this.update((r) => {
      r.subtasks = newSubtasks;
    });
  }
  @writer async changeList(listID: string) {
    const list = await this.database.get<List>(Tables.List).find(listID);
    this.update(() => {
      this.list.set(list);
    });
  }

  @writer async setIsCompleted(t = false) {
    await this.update((r) => {
      r.isCompleted = t;
    });

    const shouldCancelNotification = storage.getBoolean(
      "send-notification-even-when-completed"
    );

    if (shouldCancelNotification) {
      this.cancelNotification();
    }

    this.list.fetch().then((list) => {
      list?.update(() => {});
    });
  }
  @writer async toggleTask() {
    this.update((r) => {
      r.isCompleted = !r.isCompleted;
    });
    this.list.fetch().then((list) => {
      list?.update(() => {});
    });
  }
  @writer async editTask({
    name,
    description,
    reminder,
    repeat
  }: editTaskType) {
    this.update((r) => {
      if (name) {
        r.name = name;
      }
      if (typeof description !== "undefined") {
        r.description = description;
      }
      if (typeof repeat !== "undefined") {
        r.repeat = repeat;
      }
      if (typeof reminder !== "undefined") {
        if (reminder) {
          r.cancelNotification();
          scheduleNotification({
            name: r.name,
            id: r.id,
            date: reminder,
            description: r.description,
            repeat: r.repeat
          });
          r.reminder = new Date(reminder);
        } else {
          r.reminder = null;
        }
      }
    });
  }
}
