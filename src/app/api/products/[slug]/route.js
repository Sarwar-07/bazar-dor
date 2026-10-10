import { NextResponse } from "next/server";
import { PRODUCTS_DATA } from "../route";

const PRIMARY_API_URL = "https://api.api-store.workers.dev/api/bazardor";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  let product = null;

  // 1. Fetch live item from the official worker
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const primaryRes = await fetch(`${PRIMARY_API_URL}/products/${slug}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    clearTimeout(timeout);

    if (primaryRes.ok) {
      const data = await primaryRes.json();
      if (data && !data.error) {
        product = data;
      }
    }
  } catch (err) {}

  // 2. Fall back to local dataset if worker request fails
  if (!product) {
    product = PRODUCTS_DATA.find(
      (p) => String(p.id) === String(slug) || p.slug === slug
    );
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}