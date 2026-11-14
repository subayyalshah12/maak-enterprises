import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/lib/supabase/data';
import { InquiryForm } from '@/components/inquiry-form';

export function ProjectDetailView({ project, backHref = '/projects' }: { project: Project; backHref?: string }) {
  const images = (project.image_urls ?? []).filter(Boolean).slice(0, 5);
  return (
    <section className="section detail-layout">
      <div>
        {images.length > 0 ? (
          <div className="project-gallery">
            {images.map((url, index) => (
              <div className={index === 0 ? 'project-gallery-main' : 'project-gallery-small'} key={url}>
                <Image
                  src={url}
                  alt={`${project.title} project photograph ${index + 1}`}
                  fill
                  sizes={index === 0 ? '(max-width: 800px) 100vw, 60vw' : '(max-width: 800px) 50vw, 30vw'}
                  unoptimized
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="project-gallery-empty">
            <strong>APPROVED PROJECT PHOTOGRAPHY</strong>
            <span>Project images will appear here after company approval.</span>
          </div>
        )}
        <h2>Project overview</h2>
        <p className="muted">{project.description || 'Company-approved project description will be added here.'}</p>
        <Link href={backHref} className="text-link">← Back to projects</Link>
      </div>
      <aside>
        <div className="detail-meta">
          <p><strong>Division:</strong> {project.division}</p>
          <p><strong>Location:</strong> {project.location}</p>
          <p><strong>Status:</strong> {project.status}</p>
        </div>
        <InquiryForm division={project.division === 'construction' ? 'construction' : 'real-estate'} title={project.division === 'construction' ? 'Enquire about construction services' : 'Enquire about this project'} />
      </aside>
    </section>
  );
}
