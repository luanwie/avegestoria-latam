# /plan — Reestruturação das Páginas por Plano (Baseado nas Dores Reais)

> **Criado:** 23 Jun 2026 | **Status:** Aguardando aprovação
> **Contexto:** O sistema atual tem informação demais, destaque de menos, e a estrutura de adição de dados não reflete o dia a dia real do avicultor.

---

## 1. Diagnóstico: As Dores Reais do Avicultor

| Dor | O que ele faz hoje | O que o sistema deveria fazer |
|---|---|---|
| **"Não sei se estou ganhando ou perdendo"** | Soma receita no fim do mês, ignora custos | Mostrar **lucro líquido por lote** como métrica #1, não receita bruta |
| **"A ração tá comendo meu lucro"** | Compra ração, serve, nunca calcula FCR | **Alerta de FCR** automático. Se o FCR subir 0.2 pontos, avisar IMEDIATAMENTE |
| **"Anoto tudo num caderno"** | Papel no galpão, passa pra planilha depois | Registro em **< 15 segundos**, offline, 3 toques |
| **"Perdi um lote inteiro por vacina atrasada"** | Calendário mental, esquece | **Alertas programados** de vacinação, desparasitação, troca de lote |
| **"Não sei qual lote tá me dando mais lucro"** | Todos os ovos vão pro mesmo balde | **Comparativo entre lotes** com ranking visual de rentabilidade |
| **"Meu funcionário não sabe usar sistema"** | Não usa, ou erra tudo | Interface **à prova de erro**: campos grandes, validação imediata, confirmação visual |
| **"Quando vejo o problema, já perdi dinheiro"** | Descobre no fim do mês | **Alertas em tempo real**: mortalidade > 3%, postura < 80%, FCR desviado |

---

## 2. Problemas do Sistema Atual (Plano Profissional)

### 2.1 Dashboard
- **4 KPIs genéricos** (Huevos Hoy, Tasa Postura, Ingreso, Mortalidad) — ok, mas sem **ranking entre lotes**
- **DRECard** isolado, sem contexto visual forte
- **Gráficos** ocupam espaço mas não entregam insight acionável
- **Tabela de lotes** só lista dados, não compara, não rankeia
- **Resumo rápido** são números soltos, sem hierarquia visual
- **Fundo e cards** sem contraste suficiente — parece tudo igual

### 2.2 Producción
- **Header + 3 quick links** (Galpones, Lotes, Razas) — ok, mas a página de registro diário é **lenta e cheia de campos**
- **Formulário de registro** pede: lote, huevos coletados, rotos, sucios, partidos, mortalidad, ração fornecida, sobra de ração, observações — **9 campos**. Um galponeiro não preenche 9 campos.
- **Tabela de produções** lista tudo — útil, mas poderia ter visualização por lote com gráfico de tendência

### 2.3 Finanzas
- **Dashboard financeiro** separado em página própria, não integrado ao dashboard principal
- **Gastos** listados em tabela com categoria, sem **visualização de peso relativo** (quanto da receita vai pra ração vs vacina?)
- **Ventas** só tabela — não mostra tendência de preço por docena
- **Falta DRE consolidado** com comparação mês a mês

### 2.4 Chat IA
- Funciona, mas o contexto é só um resumo de dados — **não sugere ações proativamente**
- **30 msg/semana** é suficiente, mas o chat não "aprende" com o histórico

---

## 3. Proposta: Reestruturação por Plano

### 3.1 Plano Esencial (Foco: Sobrevivência Financeira)

**Dashboard:**
```
┌─────────────────────────────────────────────────────┐
│  💰 VISÃO FINANCEIRA        [7d] [30d] [Este mês]   │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ INGRESOS  │  │  GASTOS   │  │   LUCRO LÍQUIDO   │  │
│  │  $4.280   │  │  $3.150   │  │    $1.130 (26%)   │  │
│  │  ↑ 12%    │  │  ↑ 8%     │  │    ↑ 18%          │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ GASTOS POR CATEGORIA            │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ Ración      $2.100  (67%)  ← ALERTA │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓ Mano Obra     $450  (14%)          │
│  ▓▓▓▓▓▓▓▓ Medicinas   $280   (9%)                  │
│  ▓▓▓▓▓▓▓▓ Transporte $180   (6%)                   │
│  ▓▓▓▓ Otros      $140   (4%)                        │
│                                                      │
│  [+ Nova Venta]  [+ Novo Gasto]                      │
└─────────────────────────────────────────────────────┘
```

**Fluxo de adição (Venta):**
- Tela única: Cliente (autocomplete), Docenas, Precio/docena, Método pago
- Confirmação visual (checkmark animado)
- Volta pro dashboard

**Fluxo de adição (Gasto):**
- Tela única: Categoria (ícones grandes), Valor, Descrição (opcional)
- Sem obrigatoriedade de associar a lote

---

### 3.2 Plano Profesional (Foco: Eficiência + Consultoria)

**Dashboard (visão COMPLETA):**
```
┌───────────────────────────────────────────────────────┐
│  📊 DASHBOARD                    [Hoje] [Semana] [Mês] │
├───────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ LUCRO/MÊS│ │  FCR HOJE │ │ POSTURA  │ │MORTALIDAD│ │
│  │ $1.130   │ │   2.12    │ │  87.3%   │ │    2     │ │
│  │  ▲ 18%   │ │  ⚠ +0.3  │ │  ▼ 1.2%  │ │  ✓ Normal│ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                        │
│  ⚠ ALERTA: Lote B - FCR subiu 0.3 pontos.              │
│     Custo extra estimado: $47/dia. [Ver detalhes →]    │
│                                                        │
│  RANKING DE LOTES (Lucro/dia):                          │
│  🥇 Lote A  Hy-Line    $42.30/dia  ████████████ 92%    │
│  🥈 Lote C  Lohmann    $38.10/dia  ██████████   89%    │
│  🥉 Lote B  Hy-Line    $31.20/dia  ████████     85% ⚠  │
│                                                        │
│  [+ Registrar Produção] [+ Nova Venta] [+ Novo Gasto]  │
└───────────────────────────────────────────────────────┘
```

**Producción — REDESENHO TOTAL:**

Em vez de um formulário de 9 campos, **registro em 3 passos visuais**:

```
┌──────────────────────────────────────────┐
│  REGISTRAR PRODUÇÃO                      │
├──────────────────────────────────────────┤
│                                          │
│  PASSO 1: Qual lote?                     │
│  ┌────────────────────────────┐          │
│  │ 🥚 Lote A - Hy-Line        │ ← toque  │
│  │ 🥚 Lote B - Hy-Line        │          │
│  │ 🥚 Lote C - Lohmann        │          │
│  └────────────────────────────┘          │
│                                          │
│  PASSO 2: Quantos huevos?                │
│  ┌────────────────────────────┐          │
│  │ [ - ]   1.847   [ + ]      │ ← stepper│
│  │ Huevos rotos: [ 12 ]       │          │
│  │ Mortalidad:   [ 0  ]       │          │
│  └────────────────────────────┘          │
│                                          │
│  PASSO 3: Ración del día                 │
│  ┌────────────────────────────┐          │
│  │ Suministrado: [ 320 ] kg   │          │
│  │ Sobra:        [ 15  ] kg   │          │
│  └────────────────────────────┘          │
│                                          │
│  [✓ REGISTRAR]                           │
│                                          │
│  ⏱ Último registro: hoy 06:42           │
└──────────────────────────────────────────┘
```

**Finanzas — REDESENHO:**

Dashboard financeiro integrado com **DRE visual**:

```
┌─────────────────────────────────────────────────────┐
│  💰 FINANZAS                      [Este mês] [30d]   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  DEMONSTRATIVO DE RESULTADO                          │
│                                                      │
│  (+) Ingresos por ventas     ████████████  $4.280    │
│  (−) Ración                  ██████████    $2.100    │
│  (−) Mano de obra            ████          $450      │
│  (−) Medicinas/Vacunas       ███           $280      │
│  (−) Transporte              ██            $180      │
│  (−) Electricidad/Agua       █             $90       │
│  (−) Mantenimiento           █             $50       │
│  ─────────────────────────────────────────           │
│  (=) LUCRO NETO                             $1.130   │
│      Margen: 26.4%                                    │
│                                                      │
│  COMPARATIVO MENSAL                                  │
│  ┌────┬────────┬────────┬────────┬────────┐         │
│  │    │  MAR   │  ABR   │  MAY   │  JUN   │         │
│  ├────┼────────┼────────┼────────┼────────┤         │
│  │ 💰 │ $980   │ $1.050 │ $890   │ $1.130 │ ← 📈    │
│  └────┴────────┴────────┴────────┴────────┘         │
│                                                      │
│  [+ Registrar Venta]  [+ Registrar Gasto]            │
└─────────────────────────────────────────────────────┘
```

**Fluxo de adição (Produção) — mobile-first, 3 toques:**
1. Toca no lote (card grande com nome, raça, idade)
2. Stepper +/- para huevos (valor default = média dos últimos 7 dias)
3. Opcional: ajustar mortalidad, ración
4. Confirma → animação de sucesso → volta pro dashboard

**Fluxo de adição (Gasto) — categorias visuais:**
- Grid de ícones grandes: 🥩 Ración, 💊 Medicinas, 💉 Vacunas, ⚡ Electricidad, 💧 Agua, 🔧 Mantenimiento, 🚚 Transporte, 👷 Mano Obra
- Toque na categoria → abre modal só com valor + descrição opcional
- Confirmação visual

---

### 3.3 Plano Profesional+ (Foco: Escala Industrial)

Mesmo que o Profesional, mais:
- **Controle de ração** com inventário e alertas de reposição
- **CRM de clientes** com histórico de compras e preços
- **WhatsApp funcionários** para registro via bot (n8n)
- **Dashboard multi-galpão** com visão consolidada de até 10 galpões
- **Exportação de relatórios** em PDF/Excel com um toque

---

## 4. Prioridades de Implementação

| # | O que | Impacto | Esforço |
|---|---|---|---|
| 1 | **Dashboard redesenhado** — ranking de lotes, alertas visuais, KPIs com hierarquia | ⭐⭐⭐ | 2h |
| 2 | **Registro de produção em 3 passos** — substitui formulário de 9 campos | ⭐⭐⭐ | 2h |
| 3 | **Finanças com DRE visual** — barras de categoria, comparativo mensal | ⭐⭐⭐ | 1.5h |
| 4 | **Gastos com grid de ícones** — seleção visual de categoria | ⭐⭐ | 1h |
| 5 | **Chat IA proativo** — sugere ações baseado em anomalias | ⭐⭐ | 1.5h |
| 6 | **Cards com contraste melhorado** — hierarquia visual clara | ⭐⭐⭐ | 1h |
| 7 | **Alertas em tempo real** — FCR, mortalidade, postura | ⭐⭐⭐ | 1.5h |

---

## 5. Decisões para Aprovação

1. **Dashboard:** Prefere o layout com ranking de lotes (🥇🥈🥉) ou comparativo lado a lado?
2. **Producción:** O fluxo de 3 passos (lote → huevos → ración) substitui completamente o formulário atual de 9 campos?
3. **Finanzas:** O DRE visual com barras por categoria substitui a página de finanças atual?
4. **Gastos:** Grid de ícones pra selecionar categoria (como WhatsApp manda foto) ou manter dropdown?
