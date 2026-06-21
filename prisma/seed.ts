// ── Seed script: populate demo database with realistic farm data ──
// Usage: npx tsx prisma/seed.ts
// Requires a demo user to exist first (run via API or manually)

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEMO_USER_ID = process.env.DEMO_USER_ID || "";

const GALPONES = [
  { nombre: "Galpón Principal", descripcion: "Galpón automático con climatización", capacidadMaxima: 4000 },
  { nombre: "Galpón Norte", descripcion: "Estructura semipesada, ventilación natural", capacidadMaxima: 2500 },
  { nombre: "Galpón Sur", descripcion: "Galpón nuevo con sistema de baterías", capacidadMaxima: 3000 },
];

const RAZAS = [
  { nombre: "Hy-Line Brown", productividadEsperada: 92, pesoPromedio: 1950 },
  { nombre: "Dekalb White", productividadEsperada: 95, pesoPromedio: 1650 },
  { nombre: "Isa Brown", productividadEsperada: 90, pesoPromedio: 1900 },
  { nombre: "Lohmann Brown", productividadEsperada: 91, pesoPromedio: 1880 },
];

const CLIENTES = [
  { nombre: "Supermercados López", telefono: "+57 310 555 0101", direccion: "Cra 50 #45-30, Bogotá" },
  { nombre: "Feira Municipal de Medellín", telefono: "+57 315 555 0202", direccion: "Cl 67 #32-15, Medellín" },
  { nombre: "Distribuidora de Huevos Pérez", telefono: "+57 320 555 0303", direccion: "Av 4 #23-10, Cali" },
  { nombre: "Panadería El Trigal", telefono: "+57 300 555 0404", direccion: "Cl 12 #8-50, Bucaramanga" },
  { nombre: "Restaurante Campestre", telefono: "+57 311 555 0505", direccion: "Vda La María, km 5, Pereira" },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDecimal(min: number, max: number, decimals = 2) {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomDate(startDaysAgo: number, endDaysAgo: number) {
  const now = Date.now();
  const start = now - startDaysAgo * 86400000;
  const end = now - endDaysAgo * 86400000;
  return new Date(start + Math.random() * (end - start));
}

function formatDate(d: Date) {
  d.setHours(0, 0, 0, 0);
  return d;
}

const CATEGORIAS_GASTOS = [
  "racion", "medicinas", "vacunas", "electricidad",
  "agua", "mantenimiento", "transporte", "mano_obra", "otro",
];

const METODOS_PAGO = ["efectivo", "transferencia", "tarjeta", "efectivo", "efectivo"];

async function main() {
  if (!DEMO_USER_ID) {
    console.error("DEMO_USER_ID environment variable required");
    console.error("Run: DEMO_USER_ID=<user-id> npx tsx prisma/seed.ts");
    process.exit(1);
  }

  console.log(`Seeding data for user: ${DEMO_USER_ID}`);

  // 1. Clear existing demo data
  await prisma.prediccion.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.gasto.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.venta.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.produccionDiaria.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.cliente.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.lote.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.raza.deleteMany({ where: { userId: DEMO_USER_ID } });
  await prisma.galpon.deleteMany({ where: { userId: DEMO_USER_ID } });

  // 2. Create galpones
  const createdGalpones = await Promise.all(
    GALPONES.map((g) =>
      prisma.galpon.create({
        data: { userId: DEMO_USER_ID, ...g },
      })
    )
  );
  console.log(`✅ ${createdGalpones.length} galpones creados`);

  // 3. Create razas
  const createdRazas = await Promise.all(
    RAZAS.map((r) =>
      prisma.raza.create({
        data: { userId: DEMO_USER_ID, ...r },
      })
    )
  );
  console.log(`✅ ${createdRazas.length} razas creadas`);

  // 4. Create lotes (3 active + 1 finished)
  const lotes = [
    {
      nombre: "Lote A - Hy-Line Brown",
      galponId: createdGalpones[0].id,
      razaId: createdRazas[0].id,
      cantidadAves: 2000,
      fechaIngreso: new Date(Date.now() - 200 * 86400000), // ~28 weeks ago
      estado: "activo",
      costoAve: 4.5,
    },
    {
      nombre: "Lote B - Hy-Line Brown",
      galponId: createdGalpones[0].id,
      razaId: createdRazas[0].id,
      cantidadAves: 1500,
      fechaIngreso: new Date(Date.now() - 365 * 86400000), // ~52 weeks ago
      estado: "activo",
      costoAve: 4.2,
    },
    {
      nombre: "Lote C - Dekalb White",
      galponId: createdGalpones[1].id,
      razaId: createdRazas[1].id,
      cantidadAves: 2000,
      fechaIngreso: new Date(Date.now() - 105 * 86400000), // ~15 weeks ago
      estado: "activo",
      costoAve: 4.8,
    },
    {
      nombre: "Lote D - Isa Brown (Vendido)",
      galponId: createdGalpones[2].id,
      razaId: createdRazas[2].id,
      cantidadAves: 1800,
      fechaIngreso: new Date(Date.now() - 400 * 86400000),
      fechaFinalizado: new Date(Date.now() - 30 * 86400000),
      estado: "vendido",
      costoAve: 4.0,
    },
  ];

  const createdLotes = await Promise.all(
    lotes.map((l) =>
      prisma.lote.create({
        data: { userId: DEMO_USER_ID, ...l },
      })
    )
  );
  console.log(`✅ ${createdLotes.length} lotes creados`);

  // 5. Create production records (last 60 days for active lotes)
  const activeLotes = createdLotes.filter((l) => l.estado === "activo");
  let prodCount = 0;

  for (const lote of activeLotes) {
    const edadSemanas = Math.floor(
      (Date.now() - lote.fechaIngreso.getTime()) / (7 * 86400000)
    );

    for (let d = 59; d >= 0; d--) {
      const fecha = new Date(Date.now() - d * 86400000);
      formatDate(fecha);

      // Egg production declines with age
      const baseRate =
        edadSemanas < 20 ? 0.6 + (edadSemanas / 20) * 0.3 : // Ramp up
        edadSemanas < 45 ? 0.85 - (edadSemanas - 20) * 0.002 : // Peak then slight decline
        0.75 - (edadSemanas - 45) * 0.003; // Gradual decline

      const rate = Math.max(0.4, baseRate + randomDecimal(-0.05, 0.05));
      const huevos = Math.round(lote.cantidadAves * rate);
      const rotos = Math.round(huevos * randomDecimal(0.01, 0.04));
      const sucios = Math.round(huevos * randomDecimal(0.005, 0.02));
      const partidos = Math.round(huevos * randomDecimal(0.005, 0.015));
      const mortalidad = randomInt(0, Math.max(1, Math.round(lote.cantidadAves * 0.002)));

      // Skip some days to simulate missed records (~5% missing)
      if (Math.random() < 0.05) continue;

      await prisma.produccionDiaria.create({
        data: {
          userId: DEMO_USER_ID,
          loteId: lote.id,
          fecha,
          huevosColectados: huevos,
          huevosRotos: rotos,
          huevosSucios: sucios,
          huevosPartidos: partidos,
          mortalidad,
          observaciones: Math.random() < 0.1 ? "Registro normal" : null,
        },
      });
      prodCount++;
    }
  }
  console.log(`✅ ${prodCount} registros de producción creados`);

  // 6. Create clientes
  const createdClientes = await Promise.all(
    CLIENTES.map((c) =>
      prisma.cliente.create({
        data: { userId: DEMO_USER_ID, ...c },
      })
    )
  );
  console.log(`✅ ${createdClientes.length} clientes creados`);

  // 7. Create ventas (last 45 days)
  let ventaCount = 0;
  for (let d = 44; d >= 0; d--) {
    // Sales ~5x per week
    if (Math.random() > 0.28) continue;

    const cliente = createdClientes[randomInt(0, createdClientes.length - 1)];
    const docenas = randomInt(10, 200);
    const precio = randomDecimal(1.1, 1.6);

    await prisma.venta.create({
      data: {
        userId: DEMO_USER_ID,
        clienteId: cliente.id,
        fecha: new Date(Date.now() - d * 86400000),
        docenas,
        precioPorDocena: precio,
        metodoPago: METODOS_PAGO[randomInt(0, METODOS_PAGO.length - 1)],
        descripcion: Math.random() < 0.3 ? `Venta a ${cliente.nombre}` : null,
      },
    });
    ventaCount++;
  }
  console.log(`✅ ${ventaCount} ventas creadas`);

  // 8. Create gastos (last 45 days)
  let gastoCount = 0;
  for (const lote of activeLotes) {
    // Bi-weekly racion cost
    for (let d = 44; d >= 0; d -= randomInt(10, 16)) {
      await prisma.gasto.create({
        data: {
          userId: DEMO_USER_ID,
          loteId: lote.id,
          categoria: "racion",
          fecha: new Date(Date.now() - d * 86400000),
          monto: randomDecimal(120, 350),
          descripcion: `Ración para ${lote.nombre}`,
        },
      });
      gastoCount++;
    }

    // Monthly medicinas
    for (let d = 44; d >= 0; d -= randomInt(25, 35)) {
      await prisma.gasto.create({
        data: {
          userId: DEMO_USER_ID,
          loteId: lote.id,
          categoria: "medicinas",
          fecha: new Date(Date.now() - d * 86400000),
          monto: randomDecimal(30, 120),
          descripcion: Math.random() < 0.5 ? "Vitaminas y suplementos" : "Tratamiento preventivo",
        },
      });
      gastoCount++;
    }
  }

  // General expenses (electricity, water, transport, etc.)
  for (let d = 44; d >= 0; d -= randomInt(5, 10)) {
    const cat = CATEGORIAS_GASTOS[randomInt(2, CATEGORIAS_GASTOS.length - 1)];
    const monto =
      cat === "electricidad" ? randomDecimal(80, 250) :
      cat === "agua" ? randomDecimal(30, 80) :
      cat === "transporte" ? randomDecimal(40, 180) :
      cat === "mantenimiento" ? randomDecimal(20, 150) :
      cat === "mano_obra" ? randomDecimal(60, 200) :
      randomDecimal(10, 100);

    await prisma.gasto.create({
      data: {
        userId: DEMO_USER_ID,
        loteId: null,
        categoria: cat,
        fecha: new Date(Date.now() - d * 86400000),
        monto,
        descripcion: null,
      },
    });
    gastoCount++;
  }
  console.log(`✅ ${gastoCount} gastos creados`);

  // ── Summary ──
  const totalAves = activeLotes.reduce((s, l) => s + l.cantidadAves, 0);
  const gastosTotal = await prisma.gasto.aggregate({
    where: { userId: DEMO_USER_ID },
    _sum: { monto: true },
  });
  const ventasTotal = await prisma.venta.aggregate({
    where: { userId: DEMO_USER_ID },
    _sum: { docenas: true },
  });

  console.log(`
══════════════════════════════════════
  🌾 Seed Completo — AveGestoria
══════════════════════════════════════
  Galpones:     ${createdGalpones.length}
  Razas:        ${createdRazas.length}
  Lotes:        ${createdLotes.length} (${activeLotes.length} activos)
  Aves totales: ${totalAves.toLocaleString()}
  Producción:   ${prodCount} registros
  Clientes:     ${createdClientes.length}
  Ventas:       ${ventaCount} (${ventasTotal._sum.docenas || 0} docenas)
  Gastos:       ${gastoCount} ($${(gastosTotal._sum.monto || 0).toFixed(2)})
══════════════════════════════════════
`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
