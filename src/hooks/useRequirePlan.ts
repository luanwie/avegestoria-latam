"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Redirects to /es/dashboard if user's plan doesn't include the required plan.
 * Plans hierarchy: esencial < profesional < profesional_plus
 * "profesional" passes for minPlan "esencial" and "profesional"
 */
export function useRequirePlan(minPlan: "esencial" | "profesional" | "profesional_plus") {
  const { data: session, status } = useSession();
  const router = useRouter();

  const planOrder: Record<string, number> = {
    none: 0,
    esencial: 1,
    profesional: 2,
    profesional_plus: 3,
  };

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/es/auth/login");
      return;
    }

    const plan = (session?.user as { plan?: string } | undefined)?.plan || "none";
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (role === "admin") return; // admin can access everything

    if ((planOrder[plan] || 0) < (planOrder[minPlan] || 0)) {
      router.push("/es/prices");
    }
  }, [status, session, router, minPlan]);
}
