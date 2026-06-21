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
      const userId = session.client_reference_id || session.metadata?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { role: "trial" },
        });
        console.log(`🔵 User ${userId} started trial`);
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const userId = invoice.metadata?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { role: "premium" },
        });
        console.log(`✅ User ${userId} paid — upgraded to premium`);
      }
      break;
    }

    case "invoice.payment_failed": {
      const failedInvoice = event.data.object as Stripe.Invoice;
      const failedUserId = failedInvoice.metadata?.userId;
      if (failedUserId) {
        console.log(`❌ Payment failed for user ${failedUserId}`);
        // Optionally create an alert for the user
        await prisma.alerta.create({
          data: {
            userId: failedUserId,
            tipo: "economico",
            mensaje: "Pago rechazado. Actualiza tu método de pago para no perder el acceso.",
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const cancelledUserId = subscription.metadata?.userId;
      if (cancelledUserId) {
        await prisma.user.update({
          where: { id: cancelledUserId },
          data: { role: "user" },
        });
        console.log(`↩️ User ${cancelledUserId} reverted to free`);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
