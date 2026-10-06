import Link from "next/link";

export default function NotFound() { return <article className="prose-page"><div className="breadcrumb">404</div><h1>Page not found</h1><p className="intro">This component or page does not exist.</p><Link className="text-link" href="/components/button">Back to components</Link></article>; }
