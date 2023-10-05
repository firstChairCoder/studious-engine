/* eslint-disable @typescript-eslint/no-shadow */
import type { Query } from "@nozbe/watermelondb";
import { Model } from "@nozbe/watermelondb";
import type { Associations } from "@nozbe/watermelondb/Model";
import { children, json, text, writer } from "@nozbe/watermelondb/decorators";

import { Columns, Tables } from "./schema";
import type Task from "./task";
import { type repeatType, scheduleNotification } from "./schedule-noti";
import type { subtaskObject } from "./task";

import type { listThemeType } from "@/theme/listTheme";
import { getUid } from "@/utils/getUid";

const Column = Columns.list;

export type addTaskType = {
  name: string;
  description: string;
  reminder?: Date;
  reminderRepeat: repeatType;
  subtasks: string[];
};
type editListType = {
  name?: string;
  theme?: listThemeType;
};

export default class List extends Model {
  public static table = Tables.List;
  public static associations: Associations = {
    task: {
      type: "has_many",
      foreignKey: Columns.task.listID
    }
  };
  @text(Column.name) name!: string;
  @children("task") tasks!: Query<Task>;
  @json(Column.theme, (json) => json) theme!: listThemeType;

  @writer async addTask(t: addTaskType) {
    await this.database.get<Task>(Tables.Task).create((task) => {
      const id = getUid();
      if (t.reminder) {
        task.reminder = new Date(t.reminder);
        task.repeat = t.reminderRepeat;
        scheduleNotification({
          name: t.name,
          id,
          date: t.reminder,
          description: t.description,
          repeat: t.reminderRepeat
        });
      } else {
        task.reminder = null;
        task.repeat = null;
      }
      task.list.set(this);
      task.description = t.description;
      task.name = t.name;
      task.isCompleted = false;
      const subtasks: subtaskObject = {};
      t.subtasks.map((i) => {
        const id = getUid(10);
        subtasks[id] = {
          isCompleted: false,
          name: i
        };
        task.subtasks = subtasks;
      });
      task.id = id; //cannot assign to id - read-only prop?
    });
  }
  @writer async markAsDeleted() {
    const tasks = await this.tasks.fetch();
    const deleted = tasks.map((task) => {
      task.cancelNotification();
      return task.prepareMarkAsDeleted();
    });
    await this.database.batch(...deleted, super.prepareMarkAsDeleted());
  }

  @writer async editList({ name, theme }: editListType) {
    this.update((r) => {
      if (name) {
        r.name = name;
      }
      if (theme) {
        r.theme = theme;
      }
    });
  }
}
