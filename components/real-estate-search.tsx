'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Property } from '@/lib/supabase/data';
import { PropertyGrid } from '@/components/property-grid';

type Transaction = 'buy' | 'rent' | 'sell';

export function RealEstateSearch({ properties }: { properties: Property[] }) {
  const [query, setQuery] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [minimum, setMinimum] = useState('');
  const [maximum, setMaximum] = useState('');
  const [transaction, setTransaction] = useState<Transaction>('buy');

  const propertyTypes = useMemo(
    () => Array.from(new Set(properties.map((property) => property.property_type).filter(Boolean))).sort(),
    [properties],
  );

  const filtered = useMemo(() => properties.filter((property) => {
    const search = query.trim().toLocaleLowerCase();
    const matchesSearch = !search || [property.location, property.title, property.property_type, property.size]
      .some((value) => value.toLocaleLowerCase().includes(search));
    const matchesType = propertyType === 'all' || property.property_type === propertyType;
    const matchesPurpose = transaction === 'sell' || property.purpose === (transaction === 'buy' ? 'sale' : 'rent');
    const matchesMinimum = minimum === '' || (property.price !== null && property.price >= Number(minimum));
    const matchesMaximum = maximum === '' || (property.price !== null && property.price <= Number(maximum));
    return matchesSearch && matchesType && matchesPurpose && matchesMinimum && matchesMaximum;
  }), [properties, query, propertyType, minimum, maximum, transaction]);

  function resetFilters() {
    setQuery('');
    setPropertyType('all');
    setMinimum('');
    setMaximum('');
    setTransaction('buy');
  }

  return (
    <>
      <div className="filter-bar" aria-label="Property search filters">
        <label>
          Location or keyword
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location or property" />
        </label>
        <label>
          Property type
          <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
            <option value="all">All types</option>
            {propertyTypes.map((type) => <option value={type} key={type}>{type}</option>)}
          </select>
        </label>
        <label>
          Minimum price
          <input type="number" min="0" inputMode="numeric" value={minimum} onChange={(event) => setMinimum(event.target.value)} placeholder="No minimum" />
        </label>
        <label>
          Maximum price
          <input type="number" min="0" inputMode="numeric" value={maximum} onChange={(event) => setMaximum(event.target.value)} placeholder="No maximum" />
        </label>
        <div className="transaction-switch" role="group" aria-label="Transaction type">
          {(['buy', 'sell', 'rent'] as const).map((value) => (
            <button type="button" key={value} aria-pressed={transaction === value} onClick={() => setTransaction(value)}>
              {value.toUpperCase()}
            </button>
          ))}
        </div>
        <button type="button" className="filter-reset" onClick={resetFilters}>Reset</button>
      </div>

      {transaction === 'sell' ? (
        <div className="sell-intent">
          <div>
            <p className="eyebrow">SELL A PROPERTY</p>
            <h3>Share your property details with MAAK.</h3>
            <p className="muted">Send your requirements to the team. No listing or valuation is promised by this form.</p>
          </div>
          <Link className="button" href="/contact">Submit a property enquiry</Link>
        </div>
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">01</span>
          <h3>No properties published yet</h3>
          <p>Our team is preparing verified property information. Contact us with your preferred area, property type and budget.</p>
          <Link href="/contact" className="button">Send a property enquiry <span aria-hidden="true">→</span></Link>
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="filter-result-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found</p>
          <PropertyGrid properties={filtered} />
        </>
      ) : (
        <div className="empty-state" role="status">
          <h3>No matching properties</h3>
          <p>Try changing your search terms or resetting the filters.</p>
          <button type="button" className="button button-outline" onClick={resetFilters}>Reset filters</button>
        </div>
      )}
    </>
  );
}
