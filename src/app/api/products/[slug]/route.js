import { NextResponse } from "next/server";
import { PRODUCTS_DATA } from "../route";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const product = PRODUCTS_DATA.find(
    (p) => String(p.id) === String(slug) || p.slug === slug
  );

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}