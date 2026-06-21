"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-emerald-950 text-stone-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/es" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-200 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <h1 className="text-3xl font-bold text-stone-100 mb-8">Política de Privacidad</h1>

        <div className="space-y-6 text-sm leading-relaxed text-stone-300">
          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">1. Información que Recopilamos</h2>
            <p>Recopilamos información necesaria para el funcionamiento del servicio: nombre, email, datos de producción de tu granja, y métricas de uso del sistema.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">2. Uso de la Información</h2>
            <p>Usamos tus datos para proveer el servicio de gestión avícola, generar reportes, mejorar la plataforma y enviar comunicaciones relacionadas al servicio. No usamos tus datos de producción para entrenar modelos de IA sin tu consentimiento explícito.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">3. Almacenamiento y Seguridad</h2>
            <p>Tus datos se almacenan en servidores seguros con cifrado en tránsito y en reposo. Realizamos backups automáticos periódicos. Implementamos medidas de seguridad estándar de la industria.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">4. Compartición de Datos</h2>
            <p>No vendemos tus datos personales. Compartimos información solo con procesadores de pago (Stripe) para facturación, y cuando sea requerido por ley.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">5. Retención de Datos</h2>
            <p>Conservamos tus datos mientras mantengas una cuenta activa. Al cancelar, puedes solicitar la exportación o eliminación de tus datos dentro de los 30 días posteriores.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">6. Cookies</h2>
            <p>Usamos cookies esenciales para el funcionamiento de la plataforma. No usamos cookies de rastreo de terceros sin tu consentimiento.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">7. Tus Derechos</h2>
            <p>Tienes derecho a acceder, corregir y eliminar tus datos personales. Puedes solicitar una copia exportada de tus datos en cualquier momento.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-stone-100 mb-2">8. Contacto</h2>
            <p>Para ejercer tus derechos de privacidad o hacer preguntas, contáctanos a través de los canales de soporte de AveGestoria.</p>
          </section>
        </div>

        <p className="text-xs text-stone-500 mt-12">Última actualización: Junio 2026</p>
      </div>
    </div>
  );
}
