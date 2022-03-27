
import { taskIntervalExecuter } from "./cronTasks/taskIntervalExecuter.mjs";
import { pointsMonthlyExecuter } from "./memberPoints/pointsMonthlyExecuter.mjs";

taskIntervalExecuter();
pointsMonthlyExecuter();

// process.on('uncaughtException', function (err) {
//   console.log('Caught exception: ' + err);
// });
