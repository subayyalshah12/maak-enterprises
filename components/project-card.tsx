import Link from 'next/link';
import type { Project } from '@/lib/supabase/data';

export function ProjectCard({ project }: { project: Project }) {
  const detailHref = project.division === 'construction' ? `/construction/${project.slug}` : `/projects/${project.slug}`;
  return (
    <article className="project-card">
      <div
        className="project-image"
        style={project.image_urls?.[0] ? { backgroundImage: `url("${project.image_urls[0]}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        <span className="project-index">MAAK / PROJECT</span>
      </div>
      <div className="project-body">
        <p className="eyebrow">{project.division} · {project.status}</p>
        <h3>{project.title}</h3>
        <p className="location">{project.location}</p>
        <Link className="text-link" href={detailHref}>View project ↗</Link>
      </div>
    </article>
  );
}
