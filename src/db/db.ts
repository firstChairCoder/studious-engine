import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import schema from "./models/schema";
import Task from "./models/task";
import List from "./models/list";

const adapter = new SQLiteAdapter({
  schema,
  dbName: "taskkit",
  jsi: false,
  onSetUpError: (err) => {
    console.log(err);
  }
});

export const database = new Database({
  adapter,
  modelClasses: [Task, List]
});
