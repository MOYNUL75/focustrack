import {useEffect,useState} from 'react';
import {supabase,type Task} from '../lib';
type Item={id:string;title:string;completed:boolean};
export default function Subtasks({task,uid}:{task:Task;uid:string}){
 const [items,setItems]=useState<Item[]>([]),[title,setTitle]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function reload(){const {data,error}=await supabase.from('task_subtasks').select('id,title,completed').eq('user_id',uid).eq('task_id',task.id).order('created_at');if(error)setError(error.message);else setItems(data||[])}
 useEffect(()=>{void reload()},[task.id,uid]);
 async function mutate(job:()=>Promise<{error:{message:string}|null}>){setBusy(true);setError('');try{const r=await job();if(r.error)throw Error(r.error.message);await reload()}catch(e){setError(String(e))}finally{setBusy(false)}}
 return <section className="mt-3 border-t pt-3 text-sm"><strong>Subtasks ({items.filter(i=>i.completed).length}/{items.length})</strong>
 {items.map(i=><div key={i.id} className="flex gap-2 mt-2"><input type="checkbox" checked={i.completed} disabled={busy} onChange={e=>void mutate(()=>supabase.from('task_subtasks').update({completed:e.target.checked}).eq('id',i.id).eq('user_id',uid))}/><span className="flex-1">{i.title}</span><button disabled={busy} className="text-red-500" onClick={()=>void mutate(()=>supabase.from('task_subtasks').delete().eq('id',i.id).eq('user_id',uid))}>Remove</button></div>)}
 <form className="flex gap-2 mt-3" onSubmit={async e=>{e.preventDefault();if(!title.trim())return;await mutate(()=>supabase.from('task_subtasks').insert({user_id:uid,task_id:task.id,title:title.trim()}));setTitle('')}}><input className="field flex-1" placeholder="Smaller step" value={title} onChange={e=>setTitle(e.target.value)}/><button disabled={busy||!title.trim()} className="btn">Add</button></form>{error&&<p role="alert" className="text-red-500">{error}</p>}</section>
}
