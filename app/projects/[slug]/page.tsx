import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/site-shell';
import { ProjectDetailView } from '@/components/project-detail-view';
import { getProject } from '@/lib/supabase/data';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project?.title ?? 'Project detail' };
}

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  return (
    <SiteShell>
      <section className="page-hero compact">
        <p className="eyebrow">PROJECT DETAIL / {project.division.toUpperCase()}</p>
        <h1>{project.title}</h1>
        <p className="hero-lede">{project.location} · {project.status}</p>
      </section>
      <ProjectDetailView project={project} />
    </SiteShell>
  );
}
