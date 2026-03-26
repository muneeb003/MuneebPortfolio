import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validations/contact.schema";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_submissions").insert(parsed.data);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
