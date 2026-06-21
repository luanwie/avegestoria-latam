import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export const PLAN_IDS: Record<string, string> = {
  esencial: process.env.STRIPE_ESENCIAL_PRICE_ID!,
  profesional: process.env.STRIPE_PROFESIONAL_PRICE_ID!,
};
