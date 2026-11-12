-- Run AFTER 001_init.sql. RLS remains enabled for every added table.
-- Persist daily observations separately from the task's current scheduled date/status.
create table if not exists public.daily_task_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  snapshot_date date not null,
  task_title text not null,
  category text,
  planned_date date not null,
  estimated_minutes integer not null default 0,
  actual_minutes integer not null default 0,
  status text not null check (status in ('Pending','In Progress','Completed','Rescheduled','Cancelled')),
  captured_at timestamptz not null default now(),
  unique (user_id, task_id, snapshot_date)
);
create index if not exists snapshots_user_date_idx on public.daily_task_snapshots(user_id,snapshot_date);
alter table public.daily_task_snapshots enable row level security;
create policy "snapshot owner access" on public.daily_task_snapshots for all to authenticated
  using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

-- Never allow clients to reassign an existing row to a different account.
create or replace function public.enforce_task_ownership() returns trigger
language plpgsql set search_path=public as $$
begin
  if tg_op='UPDATE' and new.user_id<>old.user_id then raise exception 'Cannot change task owner'; end if;
  if tg_op='UPDATE' and (new.original_date is distinct from old.original_date or
    new.original_deadline is distinct from old.original_deadline) then
    raise exception 'Original task dates are immutable';
  end if;
  if tg_op='UPDATE' and (new.reschedule_count<>old.reschedule_count or
    new.scheduled_date is distinct from old.scheduled_date or new.deadline is distinct from old.deadline)
    and coalesce(current_setting('focustrack.rescheduling',true),'')<>'allowed' then
    raise exception 'Use reschedule_task to modify dates or rescheduling count';
  end if;
  return new;
end $$;
create trigger enforce_tasks_history before update on public.tasks
for each row execute function public.enforce_task_ownership();

-- All children must have the same owner as their parent, even when called directly through the API.
create or replace function public.enforce_related_owner() returns trigger
language plpgsql set search_path=public as $$
declare owner_id uuid;
begin
  if tg_op='UPDATE' and new.user_id<>old.user_id then raise exception 'Cannot change owner'; end if;
  if tg_table_name in ('task_subtasks','task_reschedule_history','task_status_history','daily_reviews','focus_sessions','daily_task_snapshots') and new.task_id is not null then
    select user_id into owner_id from public.tasks where id=new.task_id;
    if owner_id is distinct from new.user_id then raise exception 'Task does not belong to user'; end if;
  end if;
  if tg_table_name='habit_logs' then
    select user_id into owner_id from public.habits where id=new.habit_id;
    if owner_id is distinct from new.user_id then raise exception 'Habit does not belong to user'; end if;
  end if;
  return new;
end $$;
do $$ declare tab text; begin
  foreach tab in array array['task_subtasks','task_reschedule_history','task_status_history','daily_reviews','focus_sessions','daily_task_snapshots','habit_logs'] loop
    execute format('create trigger enforce_related_owner_%I before insert or update on public.%I for each row execute function public.enforce_related_owner()',tab,tab);
  end loop;
end $$;

-- Snapshot a day explicitly. Changes to the active task afterward do not rewrite that day's snapshot.
create or replace function public.capture_daily_snapshot(p_date date) returns integer
language plpgsql security invoker set search_path=public as $$
declare total integer;
begin
  if p_date is null or p_date>current_date then raise exception 'Choose today or an earlier date'; end if;
  insert into public.daily_task_snapshots(user_id,task_id,snapshot_date,task_title,category,planned_date,estimated_minutes,actual_minutes,status)
  select auth.uid(),t.id,p_date,t.title,t.category,t.scheduled_date,t.estimated_minutes,t.actual_minutes,t.status
  from public.tasks t where t.user_id=auth.uid() and t.scheduled_date=p_date
  on conflict(user_id,task_id,snapshot_date) do nothing;
  get diagnostics total=row_count;
  return total;
end $$;
revoke all on function public.capture_daily_snapshot(date) from public;
grant execute on function public.capture_daily_snapshot(date) to authenticated;

-- Preserve the OLD scheduled day's unfinished outcome before moving the same task to a new day.
create or replace function public.reschedule_task(p_task_id uuid,p_new_date date,p_new_deadline date,p_reason text,p_explanation text,p_action_plan text)
returns void language plpgsql security invoker set search_path=public as $$
declare t public.tasks%rowtype;
begin
  select * into t from public.tasks where id=p_task_id and user_id=auth.uid() for update;
  if not found then raise exception 'Task not found'; end if;
  if t.status in ('Completed','Cancelled') then raise exception 'Cannot reschedule a completed or cancelled task'; end if;
  if p_new_date is null or length(trim(coalesce(p_reason,'')))=0 then raise exception 'Date and reason required'; end if;
  if p_new_deadline is not null and p_new_deadline<p_new_date then raise exception 'Deadline is before planned date'; end if;
  if p_new_date=t.scheduled_date then raise exception 'New planned date must be different'; end if;
  insert into public.daily_task_snapshots(user_id,task_id,snapshot_date,task_title,category,planned_date,estimated_minutes,actual_minutes,status)
  values(auth.uid(),t.id,t.scheduled_date,t.title,t.category,t.scheduled_date,t.estimated_minutes,t.actual_minutes,'Rescheduled')
  on conflict(user_id,task_id,snapshot_date) do nothing;
  insert into public.task_reschedule_history(user_id,task_id,old_date,new_date,old_deadline,new_deadline,reason,explanation,action_plan)
  values(auth.uid(),p_task_id,t.scheduled_date,p_new_date,t.deadline,p_new_deadline,p_reason,p_explanation,p_action_plan);
  insert into public.daily_reviews(user_id,task_id,review_date,reason,explanation,action_plan)
  values(auth.uid(),p_task_id,current_date,p_reason,p_explanation,p_action_plan);
  perform set_config('focustrack.rescheduling','allowed',true);
  update public.tasks set scheduled_date=p_new_date,deadline=p_new_deadline,status='Rescheduled',reschedule_count=reschedule_count+1
  where id=p_task_id and user_id=auth.uid();
  perform set_config('focustrack.rescheduling','',true);
end $$;
revoke all on function public.reschedule_task(uuid,date,date,text,text,text) from public;
grant execute on function public.reschedule_task(uuid,date,date,text,text,text) to authenticated;
