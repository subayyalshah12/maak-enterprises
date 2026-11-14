import {setPropertyStatus} from '@/app/admin/mutations';
export function PropertyActions({id,status}:{id:string;status:string}){
 return <form action={setPropertyStatus} className="table-actions">
  <input type="hidden" name="id" value={id}/>
  {status!=='available'&&<button name="status" value="available">Publish / set available</button>}
  {status!=='sold'&&<button name="status" value="sold">Mark sold</button>}
  {status!=='archived'&&<button name="status" value="archived">Archive</button>}
 </form>;
}
