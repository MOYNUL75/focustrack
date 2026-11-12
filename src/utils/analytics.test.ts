import {describe,expect,it} from 'vitest';
import {completionPercent,timeEfficiencyPercent,reschedulingPercent,categoryCompletion,type TaskRecord} from './analytics';
const make = (values:Partial<TaskRecord>):TaskRecord=>({id:'a',status:'Pending',scheduled_date:'2026-11-12',estimated_minutes:0,actual_minutes:0,...values});
describe('analytics calculations',()=>{
 it('excludes cancelled from eligible completion denominator',()=>expect(completionPercent([make({status:'Completed'}),make({status:'Pending'}),make({status:'Cancelled'})])).toBe(50));
 it('does not inflate empty-day completion',()=>expect(completionPercent([])).toBe(0));
 it('separates time efficiency from completion rate',()=>expect(timeEfficiencyPercent([make({status:'Completed',estimated_minutes:30,actual_minutes:60}),make({status:'Pending',estimated_minutes:50,actual_minutes:10})])).toBe(50));
 it('shows unavailable rather than inventing efficiency',()=>expect(timeEfficiencyPercent([make({status:'Pending'})])).toBeNull());
 it('counts unique tasks rescheduled',()=>expect(reschedulingPercent([make({reschedule_count:3}),make({reschedule_count:0})])).toBe(50));
 it('computes category performance',()=>expect(categoryCompletion([make({category:'Study',status:'Completed'}),make({category:'Study',status:'Pending'})])[0].completion_rate).toBe(50));
});
