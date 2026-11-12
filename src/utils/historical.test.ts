import {describe,it,expect} from 'vitest';
import {reportFromSnapshots,seriesFromSnapshots,type DailySnapshot} from './historical';
const task=(status:string,date='2026-11-11'):DailySnapshot=>({task_id:status,snapshot_date:date,status,estimated_minutes:30,actual_minutes:60,category:'Work'});
describe('immutable historical reporting',()=>{
 it('excludes cancelled tasks from eligible count',()=>{const r=reportFromSnapshots([task('Completed'),task('Cancelled'),task('Pending')]);expect(r.completionRate).toBe(50);expect(r.eligible).toBe(2)});
 it('does not confuse time efficiency with completion',()=>{const r=reportFromSnapshots([task('Completed')]);expect(r.completionRate).toBe(100);expect(r.timeEfficiency).toBe(50)});
 it('handles no tasks',()=>expect(reportFromSnapshots([]).completionRate).toBe(0));
 it('generates a date sequence',()=>expect(seriesFromSnapshots([task('Completed')],'2026-11-11','2026-11-12')).toHaveLength(2));
});
