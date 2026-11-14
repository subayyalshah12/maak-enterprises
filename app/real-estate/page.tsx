import type { Metadata } from 'next';
import { SiteShell } from '@/components/site-shell';
import { RealEstateSearch } from '@/components/real-estate-search';
import { getPublishedProperties } from '@/lib/supabase/data';

export const metadata: Metadata = { title: 'Real Estate' };

export default async function RealEstate() {
  const properties = await getPublishedProperties();
  return (
    <SiteShell>
      <section className="page-hero compact">
        <p className="eyebrow">REAL ESTATE</p>
        <h1>Find a place to move forward.</h1>
        <p className="hero-lede">Explore available opportunities. Only verified and published property information is shown.</p>
      </section>
      <section className="section">
        <div className="listing-toolbar">
          <div>
            <p className="eyebrow">PROPERTY LISTINGS</p>
            <h2>Available opportunities</h2>
          </div>
        </div>
        <RealEstateSearch properties={properties} />
      </section>
    </SiteShell>
  );
}
