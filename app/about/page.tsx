import type { Metadata } from 'next';
import { SiteShell } from '@/components/site-shell';
import { SectionHeading } from '@/components/section-heading';
import { company } from '@/lib/site';

export const metadata: Metadata = { title: 'About Us' };

const approachCards = [
  { title: 'Mission', copy: '[Insert the company-approved mission statement.]' },
  { title: 'Vision', copy: '[Insert the company-approved vision statement.]' },
  { title: 'Philosophy', copy: '[Insert the company-approved company philosophy.]' },
];

export default function About() {
  return (
    <SiteShell>
      <section className="section about-intro">
        <div className="about-intro-copy">
          <p className="eyebrow">ABOUT MAAK</p>
          <h1>A company built around progress.</h1>
          <p className="hero-lede">Company profile content is editable and should be confirmed by MAAK before launch.</p>
        </div>
        <div className="about-image-placeholder" role="img" aria-label="Placeholder for an approved MAAK company or team photograph">
          <span>COMPANY / TEAM IMAGE PLACEHOLDER</span>
          <small>Replace with a company-approved photograph</small>
        </div>
      </section>

      <section className="section about-approach">
        <SectionHeading
          eyebrow="OUR APPROACH"
          title="Purpose, people and possibility"
          copy="Mission, vision and company philosophy — editable approved copy."
        />
        <div className="about-approach-grid">
          {approachCards.map((card, index) => (
            <article className="about-approach-card" key={card.title}>
              <div className="about-card-placeholder" aria-hidden="true">0{index + 1} · IMAGE PLACEHOLDER</div>
              <div className="about-card-copy">
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="LEADERSHIP"
          title="The people leading MAAK"
          copy="Company leadership contacts, as provided for this website."
        />
        <div className="leadership-grid">
          {company.leadership.map((person) => (
            <article className="leadership-card" key={person.title}>
              <p className="eyebrow">{person.title}</p>
              <h3>{person.name}</h3>
              <a href={`tel:${person.phone.replaceAll('-', '')}`}>{person.phone}</a>
            </article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
