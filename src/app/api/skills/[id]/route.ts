import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { auth } from "@/lib/auth";
import { skillSchema, skillCategorySchema } from "@/lib/validations/skill.schema";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const isCategory = body.type === "category";
  const schema = isCategory ? skillCategorySchema.partial() : skillSchema.partial();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const supabase = createAdminClient();
  const table = isCategory ? "skill_categories" : "skills";
  // strip the `type` discriminator before writing to DB
  const { type: _type, ...payload } = parsed.data as typeof parsed.data & { type?: string };

  const { data, error } = await supabase.from(table).update(payload).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const url = new URL(req.url);
  const type = url.searchParams.get("type");
  const supabase = createAdminClient();

  const table = type === "category" ? "skill_categories" : "skills";
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
