import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  esencial: {
    priceId: process.env.STRIPE_ESENCIAL_PRICE_ID!,
    name: "Esencial",
    monthlyAmount: 9.99,
    description: "Gestión completa para tu granja",
  },
  profesional: {
    priceId: process.env.STRIPE_PROFESIONAL_PRICE_ID!,
    name: "Profesional",
    monthlyAmount: 19.99,
    description: "Todo Esencial + Inteligencia Artificial",
  },
} as const;

export type PlanType = keyof typeof PLANS;
