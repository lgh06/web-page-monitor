
import { taskIntervalExecuter } from "./cronTasks/taskIntervalExecuter.mjs";
import { pointsMonthlyExecuter } from "./memberPoints/pointsMonthlyExecuter.mjs";


taskIntervalExecuter();
pointsMonthlyExecuter();