export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}sitemap.xml`);

  if (!res.ok) {
    return new Response('Failed to fetch sitemap', { status: 500 });
  }

  const xml = await res.text();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
