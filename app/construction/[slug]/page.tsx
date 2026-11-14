import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';
import { ProjectDetailView } from '@/components/project-detail-view';
import { getProject } from '@/lib/supabase/data';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project?.division === 'construction' ? project.title : 'Construction project' };
}

export default async function ConstructionProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project || project.division !== 'construction') notFound();
  return (
    <SiteShell>
      <section className="page-hero compact">
        <p className="eyebrow">CONSTRUCTION / PROJECT DETAIL</p>
        <h1>{project.title}</h1>
        <p className="hero-lede">{project.location} · {project.status}</p>
      </section>
      <ProjectDetailView project={project} backHref="/construction" />
    </SiteShell>
  );
}
