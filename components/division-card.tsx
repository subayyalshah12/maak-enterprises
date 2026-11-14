import Link from 'next/link'; import {ArrowUpRight} from 'lucide-react';
export function DivisionCard({title,href,number,copy}:{title:string;href:string;number:string;copy:string}){return <Link className="division-card" href={href}><span className="card-number">{number}</span><div><h3>{title}</h3><p>{copy}</p></div><ArrowUpRight size={20}/></Link>}
