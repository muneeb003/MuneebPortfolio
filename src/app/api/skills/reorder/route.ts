import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // items: Array<{ id: string; order: number }>
  const { items } = await req.json();
  const supabase = createAdminClient();

  await Promise.all(
    items.map(({ id, order }: { id: string; order: number }) =>
      supabase.from("skills").update({ order }).eq("id", id)
    )
  );

  return NextResponse.json({ ok: true });
}
