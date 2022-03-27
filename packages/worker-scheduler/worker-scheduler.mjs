
import { taskExecuter } from "./cronTasks/taskExecuter.mjs";
import { pointsMonthlyExecuter } from "./memberPoints/pointsMonthlyExecuter.mjs";

taskExecuter();
pointsMonthlyExecuter();

// process.on('uncaughtException', function (err) {
//   console.log('Caught exception: ' + err);
// });
