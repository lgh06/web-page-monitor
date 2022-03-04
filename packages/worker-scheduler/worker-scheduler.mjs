
import { taskIntervalExecuter } from "./cronTasks/taskIntervalExecuter.mjs";
import { pointsMonthlyAdder } from "./memberPoints/pointsMonthlyAdder.mjs";


taskIntervalExecuter();
pointsMonthlyAdder();