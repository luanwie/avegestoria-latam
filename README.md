# 🥚 AveGestoria

**SaaS LATAM para Granjas de Ponedoras (Postura Comercial)**

Gestión inteligente de granjas avícolas con IA — controla producción, finanzas y rentabilidad desde tu celular.

## Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, motion/react
- **Auth:** Auth.js v5 (NextAuth) + Credentials
- **Database:** Neon (Postgres) + Prisma ORM v7
- **Payments:** Stripe (USD 1 trial → USD 9.99/mes)
- **IA:** OpenRouter (Claude 3 Haiku) → DeepSeek
- **i18n:** next-intl (Español neutro LATAM)
- **Deploy:** Vercel

## Quick Start

```bash
# Install
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
pnpm postinstall

# Run migrations
npx prisma migrate dev

# Seed demo data (requires DEMO_USER_ID in .env)
pnpm seed

# Dev server
pnpm dev
```

## Environment Variables

```
DATABASE_URL=postgres://...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
OPENROUTER_API_KEY=sk-or-...           # Chat IA (legado - use DEEPSEEK_API_KEY)
DEEPSEEK_API_KEY=sk-...                # Chat IA (recomendado)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX         # Google Analytics (optional)
DEMO_USER_ID=...                        # User ID for seed script
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── auth/          # Login, Register
│   │   ├── onboarding/    # 5-step wizard
│   │   ├── granja/
│   │   │   ├── galpones/  # CRUD Galpones
│   │   │   ├── lotes/     # CRUD Lotes
│   │   │   ├── razas/     # CRUD Razas
│   │   │   ├── clientes/  # CRUD Clientes
│   │   │   ├── produccion/ # Producción diaria
│   │   │   ├── finanzas/  # Dashboard, Gastos, Ventas
│   │   │   ├── informes/  # Producción, Financiero, Lote
│   │   │   └── chat/      # Chat IA
│   │   └── dashboard/     # Dashboard principal
│   ├── api/
│   │   ├── auth/          # NextAuth handlers
│   │   ├── dashboard/     # Dashboard data API
│   │   ├── stripe/        # Stripe webhooks
│   │   └── granja/        # All CRUD APIs
│   └── sitemap.ts
├── components/
│   ├── dashboard/         # DashboardShell, Charts, PeriodFilter, PredictionsCards
│   ├── seo/               # GoogleAnalytics
│   └── ui/                # Theme provider
├── lib/                   # Auth, Prisma client
├── i18n/                  # next-intl config
└── generated/prisma/      # Prisma client
```

## Phases (MVP — 3 semanas)

| Fase | Status | Descrição |
|------|--------|-----------|
| 0 — Infraestrutura | ✅ | Repo, Deploy, Prisma, Neon, Auth, Stripe |
| 1 — Auth + Landing | ✅ | Landing 7 seções, Signup, Checkout |
| 2 — Dashboard MVP | ✅ | KPIs, Gráficos, Ações rápidas |
| 3 — Módulos Core | ✅ | Galpones, Lotes, Razas, Clientes, Producción, Finanzas, Informes |
| 4 — IA + Alertas | ✅ | Chat IA, Previsões |
| 5 — Polimento + Ads | ✅ | Seed, Onboarding, SEO, Analytics, Meta Ads plan |

## Features por Módulo

### Dashboard
- KPIs: Huevos Hoy, Tasa de Postura, Ingreso, Mortalidad
- Gráficos: Ingresos vs Gastos, Producción de Huevos
- Predicciones IA: Producción 30 días, tendencia, costos estimados
- Filtros: 7/30/60 días

### Módulo Cadastrar
- **Galpones:** CRUD completo con capacidad y estado
- **Lotes:** CRUD con raza, galpón, edad calculada, estado
- **Razas:** CRUD con productividad esperada y peso promedio
- **Clientes:** CRUD con teléfono, dirección, toggle activo

### Módulo Producción
- Registro diario por lote: huevos colectados, rotos, sucios, partidos, mortalidad
- Filtros por período y lote
- Edición y eliminación

### Módulo Finanzas
- Dashboard financiero con KPIs y período selecionable
- Gastos por categoría (ração, medicinas, electricidad, etc.) com badges coloridos
- Ventas com cliente, método de pago, total calculado
- Custos por lote (visão agregada)
- Resumen com gastos por categoria, por lote, ingresos/gastos por mes

### Informes
- Relatório de Producción (tabela + resumo)
- Relatório Financiero (tabela + gastos por categoria)
- Relatório por Lote (desempenho individual)
- Impressão / PDF via `window.print()`

### IA
- Chat com dados reais da granja via Claude 3 Haiku
- Previsões de produção (regressão linear, 30 dias)
- Previsão de custos

### Onboarding
- Wizard de 5 passos: Galpão → Raça → Lote → Venda → Dashboard
- Cria registros reais no banco
- Opção de pular

### SEO & Analytics
- Meta tags OpenGraph e Twitter
- Sitemap XML e robots.txt
- Google Analytics via next/script (opt-in via env)

## Meta Ads

[Plano de lançamento](docs/meta-ads-launch-plan.md)

- **Países:** Colômbia, Chile, Argentina
- **Orçamento:** USD 15-20/dia
- **Formatos:** Imagem, Vídeo 48s, Carrossel
- **CTA:** "Probar gratis" → trial USD 1/7 dias

## Pricing

| Plano | Mensal | Anual |
|-------|--------|-------|
| Esencial | USD 9.99 | USD 99.90 |
| Profesional | USD 19.99 | USD 199.90 |

Trial: USD 1.00 pelos primeiros 7 dias.
