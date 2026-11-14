type Row = Record<string, unknown>;
const now = new Date().toISOString();
const store: Record<string, Row[]> = {
 properties: [{id:'10000000-0000-4000-8000-000000000001',title:'DEMO ONLY — Sample property (not real inventory)',slug:'demo-only-sample-property',property_type:'Demo apartment',purpose:'sale',price:null,currency:'PKR',location:'DEMO DATA — replace with verified location',size:'Demo size',bedrooms:2,bathrooms:1,description:'Illustrative admin record only. Not a MAAK listing.',image_urls:[],featured:false,status:'archived',published_at:null,created_at:now,updated_at:now}],
 construction_projects: [{id:'20000000-0000-4000-8000-000000000001',title:'DEMO ONLY — Sample project (not a company project)',slug:'demo-only-sample-project',division:'construction',location:'DEMO DATA — replace with verified location',status:'Example status',description:'Illustrative admin record only. Not a MAAK project.',image_urls:[],is_published:false,created_at:now,updated_at:now}],
 inquiries: [{id:'30000000-0000-4000-8000-000000000001',name:'DEMO CUSTOMER — not a real person',email:'demo@example.invalid',phone:'0000000000',division:'general',property_id:null,message:'DEMO ONLY — do not contact.',consent:true,source:'demo',status:'new',internal_notes:null,follow_up_at:null,created_at:now}],
 admin_users: [],
};

/** Volatile process-memory data. Never persistent and never enabled in production. */
export function createDemoClient(): any {
 return {from(table:string) {
  let operation:'select'|'insert'|'update'|'delete'='select';
  let values:Row[]=[]; let filters:Array<(row:Row)=>boolean>=[];
  let ordering:Array<{column:string;ascending:boolean}>=[]; let maxRows:number|undefined; let single=false;
  const builder:any={
   select(){return builder;},
   insert(input:Row|Row[]){operation='insert';values=Array.isArray(input)?input:[input];return builder;},
   update(input:Row){operation='update';values=[input];return builder;},
   delete(){operation='delete';return builder;},
   eq(column:string,value:unknown){filters.push(row=>row[column]===value);return builder;},
   not(column:string,operator:string,value:unknown){if(operator==='is'&&value===null)filters.push(row=>row[column]!==null&&row[column]!==undefined);return builder;},
   order(column:string,options?:{ascending?:boolean}){ordering.push({column,ascending:options?.ascending??true});return builder;},
   limit(count:number){maxRows=count;return builder;},
   maybeSingle(){single=true;return builder;},
   then(resolve:(value:unknown)=>unknown,reject?:(reason:unknown)=>unknown){return execute().then(resolve,reject);}
  };
  async function execute(){
   const rows=store[table]??(store[table]=[]);
   if(operation==='insert'){const inserted=values.map(value=>({id:crypto.randomUUID(),created_at:now,updated_at:now,...value}));rows.push(...inserted);return {data:inserted,error:null};}
   const selected=rows.filter(row=>filters.every(filter=>filter(row)));
   if(operation==='update'){selected.forEach(row=>Object.assign(row,values[0],{updated_at:new Date().toISOString()}));return {data:selected,error:null};}
   if(operation==='delete'){store[table]=rows.filter(row=>!filters.every(filter=>filter(row)));return {data:selected,error:null};}
   let result=[...selected];
   for(const sort of ordering){result.sort((a,b)=>{const compared=String(a[sort.column]??'').localeCompare(String(b[sort.column]??''),undefined,{numeric:true});return sort.ascending?compared:-compared;});}
   if(maxRows!==undefined)result=result.slice(0,maxRows);
   return {data:single?result[0]??null:result,error:null};
  }
  return builder;
 }};
}
