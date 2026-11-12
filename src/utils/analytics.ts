/** Pure analytics helpers, useful for report validation and future UI integration. */
export type TaskRecord = {
  id: string; status: 'Pending'|'In Progress'|'Completed'|'Rescheduled'|'Cancelled';
  scheduled_date: string; estimated_minutes: number; actual_minutes: number;
  category?: string|null; reschedule_count?: number;
};
export function eligibleTasks<T extends TaskRecord>(tasks: T[]): T[] { return tasks.filter(t => t.status !== 'Cancelled'); }
export function completionPercent(tasks: TaskRecord[]): number {
  const eligible = eligibleTasks(tasks);
  return eligible.length === 0 ? 0 : Math.round(10000 * eligible.filter(t=>t.status === 'Completed').length / eligible.length)/100;
}
/** Only completed tasks with both time estimates are used, avoiding misleading infinity/zero. */
export function timeEfficiencyPercent(tasks: TaskRecord[]): number|null {
  const completed = tasks.filter(t => t.status === 'Completed' && t.estimated_minutes > 0 && t.actual_minutes > 0);
  if (!completed.length) return null;
  const estimated = completed.reduce((sum,t)=>sum+t.estimated_minutes,0);
  const actual = completed.reduce((sum,t)=>sum+t.actual_minutes,0);
  return Math.round(10000*estimated/actual)/100;
}
export function reschedulingPercent(tasks: TaskRecord[]): number {
  const eligible = eligibleTasks(tasks);
  return eligible.length ? Math.round(10000*eligible.filter(t=>(t.reschedule_count||0)>0).length/eligible.length)/100 : 0;
}
export function categoryCompletion(tasks: TaskRecord[]) {
  const names = [...new Set(tasks.map(t=>t.category?.trim()||'Uncategorized'))];
  return names.map(category=>{
    const records = tasks.filter(t=>(t.category?.trim()||'Uncategorized')===category);
    return {category, count:records.length, completion_rate:completionPercent(records)};
  }).sort((a,b)=>b.completion_rate-a.completion_rate);
}
