import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

// Price IDs com Adaptive Pricing multi-moeda ativado
const PRICE_IDS: Record<string, string> = {
  esencial: "price_1TkyfIKIvxBctS1xXMd6PruR",
  profesional: "price_1TkyaIKIvxBctS1xsI46hSzw",
  "profesional-anual": "price_1TkydMKIvxBctS1xTJsQbqTe",
};

const SETUP_FEE_PRICE_ID = "price_1TkyZLKIvxBctS1xZk48N3Bz";

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json();

    const priceId = PRICE_IDS[plan];

    if (!priceId) {
      return NextResponse.json(
        { error: `Plan "${plan}" no válido. Opciones: ${Object.keys(PRICE_IDS).join(", ")}` },
        { status: 400 }
      );
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://avegestoria.vercel.app").replace(/\/+$/, "");

    const lineItems = [{ price: priceId, quantity: 1 }];
    if (SETUP_FEE_PRICE_ID) {
      lineItems.push({ price: SETUP_FEE_PRICE_ID, quantity: 1 });
    }

    // Annual plans don't have trial — they're billed immediately
    const isAnnual = plan.endsWith("-anual");

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      subscription_data: {
        ...(isAnnual ? {} : { trial_period_days: 7 }),
        metadata: { plan },
      },
      success_url: `${appUrl}/es/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/es/prices?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: `Error al crear el pago: ${message}` },
      { status: 500 }
    );
  }
}
