import { NextRequest, NextResponse } from "next/server";

import { resend } from "@/server/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { to, subject, html, from } = body;

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, html" },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: from || "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
