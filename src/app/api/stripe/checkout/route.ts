import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(request: NextRequest) {
  try {
    const { plan, userId } = await request.json();

    if (!plan || !["esencial", "profesional"].includes(plan)) {
      return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
    }

    const priceIds: Record<string, string> = {
      esencial: process.env.STRIPE_ESENCIAL_PRICE_ID!,
      profesional: process.env.STRIPE_PROFESIONAL_PRICE_ID!,
    };

    if (!priceIds[plan]) {
      return NextResponse.json(
        { error: "Plan no configurado — falta STRIPE_PRICE_ID en .env" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceIds[plan],
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          userId,
          plan,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/es/onboarding?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/es/prices?checkout=canceled`,
      client_reference_id: userId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Error al crear el checkout" },
      { status: 500 }
    );
  }
}
