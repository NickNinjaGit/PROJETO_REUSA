export async function trackDurationTime(target, model) {
  const totalDuration = target.reduce((acc, t) => acc + t.duration, 0);
  model.duration = totalDuration;
  await model.save({ fields: ["duration"] });
}
