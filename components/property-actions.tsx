import {setPropertyStatus} from '@/app/admin/mutations';
export function PropertyActions({id,status}:{id:string;status:string}){return <form action={setPropertyStatus} className="table-actions"><input type="hidden" name="id" value={id}/><button name="status" value={status==='available'?'archived':'available'}>{status==='available'?'Archive':'Set available'}</button></form>}
