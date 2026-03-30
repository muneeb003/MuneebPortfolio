import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { auth } from "@/lib/auth";
import { skillSchema, skillCategorySchema } from "@/lib/validations/skill.schema";

export async function GET() {
  const supabase = createAdminClient();
  const { data: categories, error } = await supabase
    .from("skill_categories")
    .select("*, skills(*)")
    .order("order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Support creating a skill or a category
  if (body.type === "category") {
    const parsed = skillCategorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("skill_categories")
      .insert({ name: parsed.data.name, order: parsed.data.order })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  }

  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("skills").insert(parsed.data).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
