"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-emerald-950 text-stone-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/es" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-200 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <h1 className="text-3xl font-bold text-stone-100 mb-8">Términos y Condiciones</h1>

        <div className="space-y-6 text-sm leading-relaxed text-stone-300">
          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">1. Aceptación de los Términos</h2>
            <p>Al acceder y usar AveGestoria, aceptas estos términos. Si no estás de acuerdo, no uses el servicio.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">2. Descripción del Servicio</h2>
            <p>AveGestoria es un software de gestión avícola SaaS que permite a los productores controlar la producción, finanzas y rentabilidad de granjas de gallinas ponedoras.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">3. Registro y Cuenta</h2>
            <p>Eres responsable de mantener la confidencialidad de tu cuenta y contraseña. Debes proporcionar información precisa y actualizada.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">4. Planes y Pagos</h2>
            <p>Ofrecemos planes mensuales y anuales. Los pagos se procesan a través de Stripe. Puedes cancelar en cualquier momento. El reembolso se realiza solo dentro de los primeros 7 días del trial.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">5. Uso Aceptable</h2>
            <p>No debes usar el servicio para actividades ilegales, violar derechos de propiedad intelectual, o intentar dañar la infraestructura del sistema.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">6. Limitación de Responsabilidad</h2>
            <p>AveGestoria no se responsabiliza por daños indirectos o pérdidas derivadas del uso del servicio. El software se proporciona "tal cual".</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">7. Modificaciones</h2>
            <p>Podemos actualizar estos términos en cualquier momento. Los cambios serán notificados por email o al iniciar sesión.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">8. Contacto</h2>
            <p>Para dudas sobre estos términos, contáctanos a través de los canales de soporte.</p>
          </section>
        </div>

        <p className="text-xs text-stone-500 mt-12">Última actualización: Junio 2026</p>
      </div>
    </div>
  );
}
