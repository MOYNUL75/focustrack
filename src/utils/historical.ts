/** The immutable daily observations are the source of truth for closed days. */
export type DailySnapshot={task_id:string;snapshot_date:string;status:string;estimated_minutes:number;actual_minutes:number;category:string|null};
export function reportFromSnapshots(rows:DailySnapshot[]){
  const eligible=rows.filter(t=>t.status!=='Cancelled');
  const completed=eligible.filter(t=>t.status==='Completed');
  const minutesEstimated=completed.reduce((n,t)=>n+t.estimated_minutes,0);
  const minutesActual=completed.reduce((n,t)=>n+t.actual_minutes,0);
  return {planned:rows.length,eligible:eligible.length,completed:completed.length,
    incomplete:eligible.length-completed.length,
    completionRate:eligible.length?Math.round(completed.length/eligible.length*10000)/100:0,
    timeEfficiency:minutesActual?Math.round(minutesEstimated/minutesActual*10000)/100:null};
}
export function seriesFromSnapshots(rows:DailySnapshot[],from:string,to:string){
  const result:Array<ReturnType<typeof reportFromSnapshots>&{date:string}>=[];
  const d=new Date(`${from}T12:00:00`); const end=new Date(`${to}T12:00:00`);
  while(d<=end){const date=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
    result.push({date,...reportFromSnapshots(rows.filter(r=>r.snapshot_date===date))});d.setDate(d.getDate()+1)}
  return result;
}
