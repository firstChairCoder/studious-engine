import type { Dispatch, SetStateAction } from "react";

import type Task from "@/db/models/task";

export type ButtonPageProps = {
  removeTask: () => void;
  setPage: Dispatch<SetStateAction<"main" | "today" | "later">>;
  task: Task;
};
