let getNextStepMinuteTimestamp = function (timestamp, step = 5, count = 1) {
  let nextStepMinute = parseInt((new Date(timestamp).getMinutes() + count * step) / step) * step;
  let nextHour = 0;
  if (nextStepMinute >= 60) {
    nextHour = parseInt(nextStepMinute / 60)
    nextStepMinute = nextStepMinute % 60;
  } else {
    nextHour = 0;
  }
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setHours
  let nextStepMinuteTimestamp = new Date(timestamp).setHours(
    new Date(timestamp).getHours() + nextHour,
    nextStepMinute,
    0,
    0
  );
  return nextStepMinuteTimestamp;
}

let getNextTimeSection = function (timestamp, step, count = 1) {
  return [
    // new Date(
    getNextStepMinuteTimestamp(timestamp, step, count)
    // )
    ,
    // new Date(
    getNextStepMinuteTimestamp(timestamp, step, count + 1) - 1
    // )
  ]
}

export { getNextTimeSection, getNextStepMinuteTimestamp }