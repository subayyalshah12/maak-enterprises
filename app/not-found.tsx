import Link from 'next/link';
export default function NotFound(){return <main className="not-found"><p className="eyebrow">404 / NOT FOUND</p><h1>This page isn’t available.</h1><p className="muted">The item may be unpublished or the link may be incorrect.</p><Link href="/" className="button">Return home</Link></main>}
