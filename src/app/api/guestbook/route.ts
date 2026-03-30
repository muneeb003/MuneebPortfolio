import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { guestbookSchema } from "@/lib/validations/guestbook.schema";
import { getIP, checkRateLimit } from "@/lib/ratelimit";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("guestbook")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const limited = await checkRateLimit("guestbook", getIP(req));
  if (limited) return limited;

  const body = await req.json();
  const parsed = guestbookSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const avatarSeed = parsed.data.name.toLowerCase().replace(/\s+/g, "-");
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("guestbook")
    .insert({ ...parsed.data, avatar_seed: avatarSeed, status: "pending" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
