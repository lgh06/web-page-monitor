
import { taskIntervalExecuter } from "./cronTasks/taskIntervalExecuter.mjs";
import { pointsMonthlyExecuter } from "./memberPoints/pointsMonthlyExecuter.mjs";


try {
  taskIntervalExecuter();
  pointsMonthlyExecuter();
} catch (error) {
  console.error(error);
}

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});
