export async function trackDurationTime(target, model) {
  if(target.length === 0)
  {
    model.duration = 0;
    await model.save({ fields: ["duration"] });
    return;
  }
  const totalDuration = target.reduce((acc, t) => acc + t.duration, 0);
  model.duration = totalDuration;
  await model.save({ fields: ["duration"] });
  console.log(model.duration);
}
