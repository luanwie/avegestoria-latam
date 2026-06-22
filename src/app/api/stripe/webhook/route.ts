import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get customer email and name from Stripe
      const email = session.customer_details?.email;
      const name = session.customer_details?.name || (email ? email.split("@")[0] : "Productor");
      const stripeCustomerId = session.customer as string;
      const sessionId = session.id;
      const plan = session.metadata?.plan || "esencial";

      if (email) {
        // Check if user already exists
        const existing = await prisma.user.findUnique({
          where: { email },
        });

        if (existing) {
          // Update existing user
          await prisma.user.update({
            where: { id: existing.id },
            data: { role: "trial" },
          });
          console.log(`🔵 Existing user ${existing.id} started trial (plan: ${plan})`);
        } else {
          // Create new user from Stripe data
          const user = await prisma.user.create({
            data: {
              email,
              name,
              role: "trial",
            },
          });
          console.log(`🆕 User created from Stripe: ${user.id} (${email}, plan: ${plan})`);
        }

        // Store the session-to-email mapping for the onboarding page
        // We use a simple approach: the session ID will be passed to onboarding
        // and the onboarding page will fetch the session to get the email
        console.log(`✅ Checkout completed — session: ${sessionId}, email: ${email}`);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerEmail = invoice.customer_email;

      if (customerEmail) {
        const user = await prisma.user.findUnique({
          where: { email: customerEmail },
        });
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "premium" },
          });
          console.log(`✅ User ${user.id} paid — upgraded to premium`);
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const failedInvoice = event.data.object as Stripe.Invoice;
      const failedEmail = failedInvoice.customer_email;
      if (failedEmail) {
        const user = await prisma.user.findUnique({ where: { email: failedEmail } });
        if (user) {
          await prisma.alerta.create({
            data: {
              userId: user.id,
              tipo: "economico",
              mensaje: "Pago rechazado. Actualiza tu método de pago para no perder el acceso.",
            },
          });
          console.log(`❌ Payment failed for user ${user.id}`);
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // Find user by email from subscription customer
      if (typeof subscription.customer === "string") {
        const customers = await stripe.customers.list({ limit: 1, email: undefined });
        // Fallback: we don't have easy email lookup from subscription alone
        console.log(`↩️ Subscription ${subscription.id} deleted`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
