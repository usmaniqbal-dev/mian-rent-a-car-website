import Link from "next/link";

export default function NotFound() {
  return <main className="section-pad"><div className="container center"><span className="eyebrow">404</span><h1 className="section-title">Page Not Found</h1><p className="section-sub">The page you are looking for is not available.</p><Link className="gold-btn" href="/">Back Home</Link></div></main>;
}
