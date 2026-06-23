# 🥚 AveGestoria — Reestruturação 3 Planos (2 Públicos)

> **Criado:** 22 Jun 2026 | **Status:** Aguardando aprovação
> **Base:** Sistema existente (MVP funcional com landing, dashboard, CRUDs, chat IA, Stripe)

---

## Resumo da Mudança

| De (atual) | Para (novo) |
|---|---|
| 2 planos: Esencial / Profesional | 3 planos: Esencial / Profesional / Profesional+ |
| Foco único: granjas pequenas | 2 públicos: ≤50k aves / >50k aves |
| Consultoria inexistente | Consultoria via WhatsApp + /admin |
| Chat IA ilimitado | 30 msg/semana no Profesional |
| Sem data sharing | Toggle de compartilhamento no /perfil |
| Sem analytics interno | /admin com analytics + visualização por granja |
| Sem lista de espera | Waitlist para Profesional+ |

---

## 1. Visão Geral dos 3 Planos

### Plano 1 — Esencial (USD 9.99/mês)
**Público:** Granjas ≤50k galinhas, foco em controle financeiro

| Módulo | O que fica |
|---|---|
| Finanzas | Dashboard financeiro, gastos por categoria, vendas |
| Ventas | Registro de vendas (cliente nome, docenas, valor) |
| Dashboard | KPIs financeiros (não produção) |
| Chat IA | ❌ Não incluso |
| Consultoria | ❌ Não incluso |

### Plano 2 — Profesional (USD 19.99/mês)
**Público:** Granjas ≤50k galinhas, querem consultoria + IA

| Módulo | O que fica |
|---|---|
| Tudo do Esencial | Finanzas + Ventas |
| Chat IA | 30 mensagens/semana |
| Consultoria WhatsApp | Link wa.me no dashboard |
| /perfil | Toggle "Compartir datos con consultor" |
| /admin (só Luan) | Visualização dos dados da granja |

### Plano 3 — Profesional+ (preço a definir, lista de espera)
**Público:** Granjas >50k galinhas

| Módulo | O que fica |
|---|---|
| Tudo do Profesional | Finanzas + Ventas + Chat IA + Consultoria |
| Controle de Ração | Módulo dedicado |
| Controle de Produção | Dashboard completo de produção |
| Controle de Clientes | CRM com histórico |
| Calculadora ROI | Ferramenta investimento vs retorno |
| WhatsApp Funcionários | Bot n8n para entrada de dados via WhatsApp |
| Lista de Espera | Captura email, telefone, nome da granja |

---

## 2. Mudanças no Banco de Dados (Prisma)

### 2.1 Alterações no Model `User`

```prisma
model User {
  // ... campos existentes mantidos ...

  // NOVOS CAMPOS
  plan           String    @default("none")  // "none" | "esencial" | "profesional" | "profesional_plus"
  dataShared     Boolean   @default(false)   @map("data_shared")   // toggle /perfil
  whatsappNumber String?   @map("whatsapp_number")
}
```

### 2.2 Novo Model `Waitlist`

```prisma
model Waitlist {
  id          String   @id @default(cuid())
  email       String
  phone       String
  granjaName  String   @map("granja_name")
  plan        String   @default("profesional_plus")
  createdAt   DateTime @default(now())

  @@map("waitlist")
}
```

### 2.3 Novo Model `PageView` (para analytics do /admin)

```prisma
model PageView {
  id        String   @id @default(cuid())
  path      String
  section   String?  // hero, pricing, features, etc.
  ctaClick  String?  // qual CTA foi clicado
  createdAt DateTime @default(now())

  @@index([path, createdAt])
  @@map("page_views")
}
```

### 2.4 Índice no ChatLog (ajuste para limite semanal)

```prisma
model ChatLog {
  // mantido como está, o limite semanal será calculado via query
  // WHERE createdAt >= week_start
}
```

---

## 3. Novas Páginas

### 3.1 `/es/perfil` — Página de Perfil do Usuário

```
┌─────────────────────────────────────────────────┐
│ ⚙️ Mi Perfil                                    │
├─────────────────────────────────────────────────┤
│ 📋 Datos Personales                             │
│   Nombre: [Carlos Rodríguez]                    │
│   Email:  carlos@email.com                      │
│   Granja: Granja El Sol                         │
│   Plan:   Profesional                           │
│                                                 │
│ 🔗 Consultoría                                  │
│   ☐ Compartir mis datos con el consultor        │
│   [toggle switch]                               │
│                                                 │
│   Cuando activas esta opción, Luan (consultor)  │
│   puede ver los datos de tu granja para darte   │
│   recomendaciones personalizadas.               │
│                                                 │
│ 💬 WhatsApp                                     │
│   Número: [+57 300 123 4567]                    │
│   [Guardar cambios]                             │
└─────────────────────────────────────────────────┘
```

**Arquivo:** `src/app/[locale]/perfil/page.tsx`
**API:** `GET|PUT /api/user/profile`

### 3.2 `/es/admin` — Painel Admin (só Luan)

```
┌─────────────────────────────────────────────────┐
│ 🛡️ Panel de Administración                      │
├─────────────────────────────────────────────────┤
│ 📊 Analytics del Sitio                          │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│   │ Visitantes│ │  Páginas │ │CTA Clicks│       │
│   │   1,247   │ │   3,892  │ │   342    │       │
│   └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│   Top páginas (7 días):                         │
│   / .................... 542 visitas             │
│   /prices .............. 231 visitas             │
│   /demo ................ 89 visitas              │
│                                                 │
│   CTAs más clickeados:                          │
│   Hero "Probar gratis" . 156                    │
│   Pricing "Comenzar" ... 98                     │
│                                                 │
├─────────────────────────────────────────────────┤
│ 🏠 Granjas que Comparten Datos                  │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ Granja El Sol (Carlos R.)                    │ │
│ │ Plan: Profesional | 12.000 aves | 3 lotes   │ │
│ │ Último acceso: 22/06/2026                    │ │
│ │ [Ver datos completos →]                      │ │
│ └─────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────┐ │
│ │ Avícola Los Andes (María G.)                 │ │
│ │ Plan: Profesional | 8.500 aves | 2 lotes    │ │
│ │ Último acceso: 21/06/2026                    │ │
│ │ [Ver datos completos →]                      │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

**Arquivo:** `src/app/[locale]/admin/page.tsx`
**APIs:**
- `GET /api/admin/analytics` — dados agregados do site
- `GET /api/admin/granjas` — lista de granjas com dataShared=true
- `GET /api/admin/granjas/[id]` — dados completos de UMA granja

### 3.3 `/es/admin/granjas/[id]` — Visualização de Granja Individual

Mostra dashboard completo da granja selecionada (igual ao /dashboard do usuário, mas read-only, visão admin).

**Arquivo:** `src/app/[locale]/admin/granjas/[id]/page.tsx`

### 3.4 `/es/waitlist` — Lista de Espera (Plano 3)

```
┌─────────────────────────────────────────────────┐
│ 🚀 Profesional+ — Lista de Espera               │
├─────────────────────────────────────────────────┤
│ ¿Tu granja tiene más de 50.000 gallinas?        │
│ Este plan es para ti.                           │
│                                                 │
│ Accede antes que nadie a:                       │
│ ✅ Control de ración                            │
│ ✅ Control de producción avanzado               │
│ ✅ CRM de clientes                              │
│ ✅ Calculadora de ROI                           │
│ ✅ WhatsApp para tus empleados                  │
│                                                 │
│ 📝 Únete a la lista:                            │
│   Nombre de la granja: [_______________]        │
│   Email:               [_______________]        │
│   Teléfono:            [_______________]        │
│                                                 │
│   [Quiero ser de los primeros →]                │
└─────────────────────────────────────────────────┘
```

**Arquivo:** `src/app/[locale]/waitlist/page.tsx`
**API:** `POST /api/waitlist`

---

## 4. Mudanças em Páginas Existentes

### 4.1 Landing Page (`/[locale]/page.tsx`)

- Seção Pricing: 3 cards em vez de 2
- Card Profesional+: badge "Lista de Espera", CTA diferente
- Novos bullets de venda alinhados com os planos

### 4.2 Prices Page (`/[locale]/prices/page.tsx`)

- 3 cards de plano
- Plano 1 "Esencial": checkout Stripe normal
- Plano 2 "Profesional": checkout Stripe normal
- Plano 3 "Profesional+": botão redireciona para /waitlist (sem Stripe)

### 4.3 Dashboard (`/[locale]/dashboard/page.tsx`)

**Se plano = esencial:** Mostrar só cards financeiros + vendas
**Se plano = profesional:** Mostrar tudo + banner de consultoria WhatsApp
**Se plano = profesional_plus:** Tudo + módulos avançados (quando implementados)

### 4.4 DashboardShell / Sidebar

- Adicionar link "Perfil" ao final da sidebar
- Se role=admin, adicionar link "Admin" (só visível para admin)
- Condicionar links visíveis por plano:
  - Esencial: só Finanzas
  - Profesional: Finanzas + Chat IA
  - Profesional+: tudo

### 4.5 Chat IA Page (`/[locale]/granja/chat/page.tsx`)

- Mudar rate limit: de 50/dia para 30/semana
- Se plano = esencial: redirecionar ou mostrar upgrade prompt

### 4.6 Stripe Webhook

- Atualizar `checkout.session.completed`: setar `plan` no User (não só `role`)
- Manter retrocompatibilidade com `role`

---

## 5. Novas APIs

### 5.1 `GET|PUT /api/user/profile`

```ts
// GET — retorna dados do perfil
{
  name, email, nombreGranja, ciudad, pais, moneda,
  plan, dataShared, whatsappNumber
}

// PUT — atualiza dataShared e whatsappNumber
{ dataShared: true, whatsappNumber: "+573001234567" }
```

### 5.2 `/api/admin/analytics`

```ts
// GET — retorna analytics do site
{
  totalVisitors: 1247,     // últimos 30 dias (PageView count distinct)
  totalPageViews: 3892,
  ctaClicks: 342,
  topPages: [{path, count}, ...],
  topCTAs: [{ctaClick, count}, ...],
  dailyViews: [{date, count}, ...]  // últimos 30 dias
}
```

### 5.3 `/api/admin/granjas`

```ts
// GET — lista granjas que compartilharam dados
[
  {
    id: "...",
    name: "Carlos Rodríguez",
    email: "carlos@...",
    granjaName: "Granja El Sol",
    plan: "profesional",
    totalAves: 12000,
    lotesCount: 3,
    lastAccess: "2026-06-22T..."
  },
  ...
]
```

### 5.4 `/api/admin/granjas/[id]`

```ts
// GET — dados completos de UMA granja (read-only, igual ao dashboard do user)
{
  profile: { name, email, granjaName, ... },
  resumen: { ... },      // KPIs financeiros
  lotes: [...],          // lotes com status
  ventas: [...],         // últimas 30 vendas
  gastos: [...],         // últimos 30 gastos
  produccion: [...],     // se plan >= profesional
}
```

### 5.5 `POST /api/waitlist`

```ts
// Body: { email, phone, granjaName }
// Validação: email único na waitlist
// Salva no model Waitlist
```

### 5.6 `POST /api/analytics/pageview` (chamado pelo client)

```ts
// Body: { path, section?, ctaClick? }
// Registra no model PageView
// Chamado em useEffect na landing e páginas públicas
```

---

## 6. Middleware / Autorização

### 6.1 Role-based access para /admin

**Arquivo:** `src/middleware.ts` (atualizar)

```ts
// Adicionar proteção de rota /admin:
// Se path começa com /admin e session.user.role !== "admin"
// → redirect para /dashboard
```

### 6.2 Proteção de API /admin/*

- Toda rota `/api/admin/*` verifica se `session.user.role === "admin"`
- Retorna 403 se não for admin

### 6.3 Verificação de plano no Chat IA

- `GET /api/granja/chat`: verifica `user.plan` antes de processar
- Se `plan = "esencial"` ou `plan = "none"`: retorna mensagem de upgrade
- Se `plan = "profesional"` ou `"profesional_plus"`: verifica limite semanal (30)

---

## 7. Script de Migração

### Migration SQL (manual ou via Prisma)

```sql
-- Adicionar colunas ao User
ALTER TABLE "User" ADD COLUMN "plan" TEXT NOT NULL DEFAULT 'none';
ALTER TABLE "User" ADD COLUMN "data_shared" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "whatsapp_number" TEXT;

-- Migrar usuários existentes: role 'premium' → plan 'profesional'
UPDATE "User" SET "plan" = 'profesional' WHERE "role" = 'premium';
UPDATE "User" SET "plan" = 'esencial' WHERE "role" = 'trial';

-- Criar tabelas novas
CREATE TABLE "waitlist" (...);
CREATE TABLE "page_views" (...);
```

---

## 8. Ordem de Execução

| Fase | O que | Duração estimada |
|---|---|---|
| **Fase 1: DB** | Migration + novos models (Waitlist, PageView) + campos User | 30 min |
| **Fase 2: Perfil** | Página /perfil + API /api/user/profile | 1h |
| **Fase 3: Admin** | Página /admin + /admin/granjas/[id] + APIs analytics/granjas | 2h |
| **Fase 4: Waitlist** | Página /waitlist + API + model | 30 min |
| **Fase 5: Landing/Prices** | Atualizar 3 cards de plano, copy, CTAs | 1h |
| **Fase 6: Dashboard condicional** | Sidebar por plano, KPIs condicionais | 1h |
| **Fase 7: Chat IA limite** | Rate limit semanal, bloqueio por plano | 30 min |
| **Fase 8: Stripe** | Novo Price ID Profesional+, atualizar webhook | 30 min |
| **Fase 9: Analytics client** | Componente de tracking na landing + página pública | 30 min |
| **Fase 10: Deploy + Teste** | Deploy Vercel, testar fluxo completo | 30 min |
| **Total** | | ~8h |

---

## 9. Decisões Pendentes

1. **Preço do Profesional+:** Quanto? Sugestão: USD 39.99/mês ou USD 49.99/mês para granjas >50k aves
2. **WhatsApp número:** Qual é o número que vai no link wa.me? (precisa ser formato internacional: +55xx...)
3. **n8n workflow:** Vai ser criado agora ou só depois que a lista de espera tiver inscritos suficientes?
4. **Limite de mensagens IA:** 30/semana tá bom? Ou prefere 10/dia?
5. **Stripe Profesional+:** Criar produto/price no Stripe agora ou só quando sair da lista de espera?

---

## 10. Notas Técnicas

- **Neon Auth:** O auth atual é NextAuth v5 com credentials (sem Google OAuth). O advisor-link mencionou "Auth url" do Neon mas o sistema atual usa Credentials puro com bcrypt.
- **Role admin:** Precisa definir COMO o Luan se torna admin. Sugestão: criar registro direto no banco (`UPDATE "User" SET role='admin' WHERE email='luan@...'`)
- **Tracking analytics:** O `PageView` será populado por um componente client que chama `/api/analytics/pageview`. Simples, sem dependência externa.
- **Plan em cookie vs DB:** O plano será lido do banco em cada request autenticado (via session callback no auth.ts), não precisa de cookie separado.
