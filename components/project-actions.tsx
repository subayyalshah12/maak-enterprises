import {setProjectStatus} from '@/app/admin/mutations';
export function ProjectActions({id,isPublished,status}:{id:string;isPublished:boolean;status:string}){
 const archived=status.toLowerCase()==='archived';
 return <form action={setProjectStatus} className="table-actions">
  <input type="hidden" name="id" value={id}/>
  {!isPublished&&!archived&&<button name="status" value="published">Publish</button>}
  {isPublished&&<button name="status" value="draft">Unpublish</button>}
  {!archived&&<button name="status" value="archived">Archive</button>}
  {archived&&<button name="status" value="draft">Restore draft</button>}
 </form>;
}
