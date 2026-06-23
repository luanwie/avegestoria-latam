export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  keywords: string[];
  content: string;
}

const posts: BlogPost[] = [
  {
    slug: "como-proteger-granja-caida-precio-huevo-estrategias",
    title: "¿Cómo Proteger tu Granja Cuando el Precio del Huevo se Desploma?",
    description:
      "Descubre 3 estrategias para proteger tu granja cuando el precio del huevo cae. Aprende a calcular tu costo real por huevo e identificar lotes deficitarios a tiempo.",
    date: "2026-06-23",
    category: "Mercado",
    keywords: [
      "precio del huevo bajo",
      "crisis avícola sobreproducción",
      "cómo reducir costos granja ponedoras",
      "rentabilidad huevo precio bajo",
      "cuándo vender lote gallinas",
      "manejo crisis mercado avícola",
      "costo producción huevo Latinoamérica",
    ],
    content: `¿Cuánto está perdiendo realmente tu granja cuando el precio del huevo se desploma? La respuesta depende de un solo número: tu costo de producción por huevo. Si no lo conoces con precisión, estás tomando decisiones a ciegas mientras el mercado te come el margen.

## ¿Por qué cae el precio del huevo?

El mercado del huevo en Latinoamérica es cíclico. Cuando los precios suben, los productores aumentan sus planteles. Seis meses después, cuando esas aves entran en producción, hay más huevo del que el mercado puede absorber y los precios se desploman. Es la historia de siempre, repetida en México, Colombia, Perú y toda la región.

En México, el kilo de huevo blanco promediaba 39 pesos a inicios de 2026, con variaciones regionales entre 30 y 55 pesos. Para un productor con costo de producción de 34 pesos por kilo, vender a 30 significa perder 4 pesos en cada kilo. Multiplica eso por los 3.000 kilos mensuales de un lote mediano: son **$12.000 pesos de pérdida al mes** en un solo lote.

Y no es solo sobreproducción. En Chile, 600.000 gallinas fueron sacrificadas en marzo de 2026 por un brote de influenza aviar H5N1. En otras regiones, el costo del maíz y la soya sigue apretando los márgenes. El resultado: productores vendiendo aves a precio de remate porque "es preferible perder un dedo antes que la mano".

## 3 estrategias para proteger tu granja

### 1. Conoce tu costo real por huevo

Sin este número no puedes tomar ninguna decisión. Tu costo por huevo incluye:

1. **Ración:** entre el 65% y 87% del costo total
2. **Mortalidad:** aves perdidas y su costo de reposición
3. **Mano de obra:** aunque sea familiar, tiene un costo real
4. **Sanidad:** vacunas, medicinas, desinfectantes
5. **Servicios:** electricidad, agua, mantenimiento del galpón

La mayoría de los productores subestima sus costos porque no registra todo. Con AveGestoria puedes registrar cada gasto diariamente y obtener tu costo real por huevo calculado automáticamente, sin planillas ni fórmulas manuales.

### 2. Identifica lotes deficitarios y actúa

No todos los lotes pierden dinero al mismo tiempo. Un lote joven en pico de postura puede seguir siendo rentable incluso con precios bajos. Un lote viejo con FCR alto probablemente ya está en números rojos.

¿Cómo saber cuál es cuál? Necesitas el lucro neto por lote actualizado en tiempo real. AveGestoria calcula esto automáticamente y te muestra en un dashboard qué lotes están ganando y cuáles están perdiendo. Así sabes exactamente dónde cortar, sin emociones ni corazonadas.

### 3. Ajusta sin sacrificar postura

Cuando los márgenes se aprietan, la tentación es comprar ración más barata. Cuidado: una fórmula de menor calidad puede desplomar tu tasa de postura en semanas, y recuperar esa producción te costará más de lo que ahorraste.

En lugar de eso, monitorea tu FCR diariamente. Si el FCR se desvía de la curva esperada para la genética de tu lote, actúa de inmediato. AveGestoria te envía alertas automáticas cuando el FCR o la tasa de postura se salen de los parámetros normales, para que corrijas antes de que la pérdida se acumule.

## ¿Cuándo conviene reducir el plantel?

No hay una respuesta única, pero sí una regla práctica: si un lote tiene más de 70 semanas y su lucro neto es negativo durante dos semanas consecutivas, probablemente es momento de venderlo.

El error más común es esperar "a que el precio mejore". Si tu costo de producción está por encima del precio de venta, cada día que mantienes ese lote estás acumulando pérdidas. Los productores que sobreviven a las crisis de precio no son los que tienen más suerte: son los que conocen sus números y actúan rápido.

## El dato que define todo

Tu costo de producción por huevo. Si no lo sabes con precisión, no sabes si estás ganando o perdiendo. Y en un mercado con precios tan volátiles como el actual, ese dato es la diferencia entre sobrevivir y quebrar.

Prueba AveGestoria 7 días gratis. Registra tus datos reales durante una semana y obtén tu costo por huevo calculado automáticamente. Sin fórmulas, sin planillas, sin sorpresas a fin de mes.`,
  },
  {
    slug: "como-calcular-rentabilidad-por-lote-granja-ponedoras",
    title: "Cómo Calcular la Rentabilidad Real por Lote en tu Granja de Ponedoras",
    description:
      "Aprende a calcular el lucro neto por lote de gallinas ponedoras, considerando costos de ración, mano de obra y mortalidad. Deja de adivinar y empieza a tomar decisiones con datos.",
    date: "2026-06-15",
    category: "Finanzas",
    keywords: [
      "rentabilidad por lote",
      "lucro granja ponedoras",
      "costos avícolas",
      "gestión financiera avícola",
      "cómo calcular ganancias granja de huevos",
    ],
    content: `Saber si tu granja está ganando o perdiendo dinero no debería ser un misterio que resuelves a fin de mes. Sin embargo, la mayoría de los productores de huevo en Latinoamérica todavía dependen de cuadernos y cálculos manuales que llegan tarde.

## ¿Por qué es crítico calcular la rentabilidad por lote?

Cada lote de gallinas tiene costos distintos. La ración representa entre el 65% y el 87% de tus gastos operativos, y ese porcentaje varía según la edad de las aves, la genética y hasta la temperatura del galpón. Si no sabes exactamente cuánto está costando cada lote, no puedes tomar decisiones.

### Los 4 números que necesitas

1. **Ingresos del lote:** huevos producidos × precio de venta por unidad
2. **Costo de ración:** kilos consumidos × precio por kilo
3. **Mortalidad:** aves perdidas × costo de reposición
4. **Gastos adicionales:** medicinas, vacunas, electricidad, mantenimiento

### La fórmula simple

\`\`\`
Lucro del lote = (Huevos × Precio) − (Ración + Mortalidad + Gastos)
\`\`\`

Pero hacer esto manualmente para 5 lotes distintos es casi imposible. Ahí es donde un sistema como AveGestoria automatiza todo: registras tus datos diarios en segundos y el dashboard te muestra el lucro neto por lote en tiempo real.

### El error más común

Muchos productores miran solo el ingreso total: "Vendí $5,000 este mes, voy bien." Pero no descuentan los $3,800 que gastaron en ración, los $300 en medicinas ni los $200 de electricidad. El resultado real: $700 de lucro. Y si un lote está consumiendo más ración de la necesaria, ese número puede ser negativo.

**No necesitas ser contador.** Necesitas una herramienta que haga los cálculos por ti.`,
  },
  {
    slug: "indice-conversion-alimentar-fcr-ponedoras",
    title: "Índice de Conversión Alimentar (FCR): El Número que Define tu Margen",
    description:
      "El FCR mide cuántos kilos de ración necesitas para producir un kilo de huevo. Una diferencia de 0.3 puntos puede costarte miles de dólares al mes. Aprende a monitorearlo.",
    date: "2026-06-18",
    category: "Producción",
    keywords: [
      "FCR ponedoras",
      "índice conversión alimentar",
      "eficiencia alimentar gallinas",
      "costos de ración avícola",
      "cómo mejorar FCR",
    ],
    content: `El Índice de Conversión Alimentar (FCR, por sus siglas en inglés) es probablemente el número más importante de tu granja. Y también el más ignorado.

## ¿Qué es el FCR?

Es la cantidad de kilos de alimento que necesitas para producir un kilo de huevo.

\`\`\`
FCR = Kilos de ración consumida ÷ Kilos de huevo producidos
\`\`\`

Un FCR de 2.0 significa que necesitas 2 kg de ración para producir 1 kg de huevo. Un FCR de 2.5 significa que necesitas 2.5 kg para lo mismo.

### El impacto real en tu bolsillo

Imagina un lote de 10.000 gallinas:

- **FCR de 2.0:** consumes 2.000 kg de ración por cada 1.000 kg de huevo
- **FCR de 2.3:** consumes 2.300 kg de ración por cada 1.000 kg de huevo

Esa diferencia de 300 kg de ración, a $0.35/kg, son **$105 adicionales por día** — **$3.150 al mes** en un solo lote.

### ¿Qué afecta el FCR?

1. **Genética:** líneas como Hy-Line o Lohmann tienen curvas de FCR predecibles
2. **Edad del lote:** el FCR empeora naturalmente después del pico de postura
3. **Temperatura:** estrés térmico aumenta el consumo sin aumentar producción
4. **Calidad de la ración:** una fórmula mal balanceada dispara el FCR
5. **Manejo sanitario:** parásitos y enfermedades reducen la eficiencia

### Cómo monitorearlo sin volverte loco

En papel, necesitarías pesar la ración servida, pesar la sobra, pesar los huevos, y hacer el cálculo cada día. Con AveGestoria registras los datos en segundos y el sistema calcula el FCR automáticamente, comparándolo contra la curva genética esperada. Si se desvía, recibes una alerta inmediata.`,
  },
  {
    slug: "gestion-granja-sin-internet-offline-first",
    title: "¿Sin Internet en el Galpón? Cómo Gestionar tu Granja Offline",
    description:
      "El 77% de las zonas rurales en Latinoamérica tienen conectividad deficiente. Descubre cómo un sistema offline-first te permite registrar datos sin señal y sincronizar después.",
    date: "2026-06-22",
    category: "Tecnología",
    keywords: [
      "software avícola offline",
      "gestión granja sin internet",
      "app para galpón sin señal",
      "offline-first avicultura",
      "sistema gestión rural",
    ],
    content: `Si tu galpón está a 500 metros de la casa y no llega el WiFi, no estás solo. En Latinoamérica, el 77% de las zonas rurales tienen conectividad deficiente o inexistente.

## El problema de los sistemas "solo cloud"

Muchos softwares de gestión avícola fueron diseñados para funcionar exclusivamente con internet. Esto significa que:

- No puedes registrar la producción directamente en el galpón
- Tienes que anotar en papel y después pasar los datos a la computadora
- Pierdes tiempo y cometes errores de transcripción
- Los datos no están actualizados en tiempo real

### La solución: Offline-First

Un sistema offline-first guarda los datos directamente en tu celular. No importa si tienes señal o no. Cuando vuelves a una zona con internet, los datos se sincronizan automáticamente con la nube.

### Cómo funciona en la práctica

1. Llegas al galpón con tu celular
2. Abres AveGestoria (funciona sin internet)
3. Registras: huevos recolectados, mortalidad, ración suministrada
4. El sistema calcula tasa de postura y FCR al instante, incluso offline
5. Al volver a casa, el celular se conecta al WiFi y sincroniza todo

### ¿Qué datos puedes registrar offline?

- Producción diaria por lote (huevos, rotos, sucios)
- Mortalidad
- Consumo de ración
- Observaciones
- Ventas y gastos básicos

Todo queda guardado localmente y se sincroniza cuando haya conexión. Sin papel, sin doble trabajo, sin errores.

### ¿Qué pasa si cambio de celular?

Tus datos están seguros en la nube. Al iniciar sesión en un nuevo dispositivo, toda tu información se recupera automáticamente.`,
  },
];

export function getAllPosts(): BlogPost[] {
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
