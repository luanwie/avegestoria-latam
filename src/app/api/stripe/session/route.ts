import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      email: session.customer_details?.email || null,
      name: session.customer_details?.name || null,
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
}
