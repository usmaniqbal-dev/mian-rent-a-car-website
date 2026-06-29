import PublicSite from "@/components/PublicSite";
import { getSiteData } from "@/lib/site-data";
import { getSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getSeo("/");
}

export default async function HomePage() {
  const data = await getSiteData();
  return <PublicSite data={data} />;
}
