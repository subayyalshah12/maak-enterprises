import type {Property} from '@/lib/supabase/data'; import {PropertyCard} from './property-card';
export function PropertyGrid({properties}:{properties:Property[]}){return <div className="property-grid">{properties.map(p=><PropertyCard key={p.id} property={p}/>)}</div>}
