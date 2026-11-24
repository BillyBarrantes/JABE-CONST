import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calculator,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Copy,
  Settings,
  X,
  RotateCcw,
  Check,
  ChevronRight,
  Home,
  Ruler,
  Leaf,
  Clock3,
  ShieldCheck,
  Sparkles,
  Hammer,
  Layers,
  User,
  Lock,
  LogOut,
  FolderPlus,
  FileText,
  ImagePlus,
  Trash2,
  Pencil,
  Download,
  Eye,
  FolderOpen,
  Plus,
  Camera,
  ClipboardList,
  ClipboardCheck,
  Users,
  HardHat,
  CheckSquare,
  Square,
  Filter,
} from 'lucide-react';
const viviendaImg = 'https://unsplash.com';
const aseoImg = 'https://unsplash.com';
const cocinaImg = 'https://unsplash.com';
const esquemaImg = 'https://unsplash.com';
const videoUrl = '';
const logoImg = 'https://placehold.co';

type Config = {
  heroTitle: string;
  heroSub: string;
  phone: string;
  email: string;
  budgetEmail: string;
  phone2: string;
  addressLine1: string;
  addressCity: string;
  addressPostal: string;
  hours: string;
  basePrice: number;
  traditionalPrice: number;
  tradLow: number;
  tradMid: number;
  tradHigh: number;
  compareMin: number;
  compareMax: number;
  reformFactorStandard: number;
  reformFactorMedia: number;
  reformFactorPremium: number;
  calcTitle: string;
  compareTitle: string;
  reformTitle: string;
  buildTitle: string;
  housingTime: string;
  traditionalTime: string;
  housingDeadline: string;
  bathroomDeadline: string;
  kitchenDeadline: string;
  housingIncludes: string;
  bathroomIncludes: string;
  kitchenIncludes: string;
  guarantee: string;
  legal: string;
};
const defaults: Config = {
  heroTitle:
    'No construimos casas. Construimos el lugar donde vas a vivir mejor.',
  heroSub:
    'Entramado ligero de madera en Gijón, Asturias. Precisión de taller, calidez de hogar y eficiencia energética desde el primer día.',
  phone: '[Teléfono]',
  email: '[Email]',
  budgetEmail: '[Email para presupuestos]',
  phone2: '',
  addressLine1: '',
  addressCity: 'Gijón, Asturias',
  addressPostal: '',
  hours: 'Lunes a viernes · 9:00–18:00',
  basePrice: 900,
  traditionalPrice: 2100,
  tradLow: 2000,
  tradMid: 2100,
  tradHigh: 2200,
  compareMin: 7,
  compareMax: 10,
  reformFactorStandard: 1,
  reformFactorMedia: 1.18,
  reformFactorPremium: 1.42,
  calcTitle: 'Calcula tu obra nueva, sin sorpresas',
  compareTitle: 'La comparativa, con números claros',
  reformTitle: 'Reformas antes / después',
  buildTitle: 'Cómo se construyen las casas de entramado ligero',
  housingTime: '4 meses',
  traditionalTime: '10–12 meses',
  housingDeadline: 'Plazo orientativo: 4 meses',
  bathroomDeadline: 'Plazo orientativo: 3–4 semanas',
  kitchenDeadline: 'Plazo orientativo: 4–6 semanas',
  housingIncludes:
    'Proyecto, estructura, aislamiento, instalaciones, acabados y coordinación completa.',
  bathroomIncludes:
    'Demolición, fontanería, electricidad, alicatado, sanitarios y mampara.',
  kitchenIncludes:
    'Mobiliario, encimera, electrodomésticos, instalaciones y acabados.',
  guarantee: 'Garantía LOE 1-3-10 años',
  legal:
    'Precios orientativos noviembre 2026. Presupuesto definitivo por separado tras visita y proyecto.',
};
const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
const steps = [
  {
    n: '01',
    t: 'Losa de cimentación',
    d: 'Base precisa y nivelada. La casa nace sobre una losa bien aislada que protege del terreno y de la humedad.',
  },
  {
    n: '02',
    t: 'Montantes de madera',
    d: 'Estructura de montantes y paneles fabricados con tolerancias de taller. Ligera, resistente y rápida de montar.',
  },
  {
    n: '03',
    t: 'Aislamiento de fibra de madera',
    d: 'Aislamiento continuo y natural entre montantes. Confort térmico y acústico durante todo el año.',
  },
  {
    n: '04',
    t: 'Tablero OSB estructural',
    d: 'El tablero rigidiza el conjunto, mejora la estanqueidad al aire y deja una base perfecta para los acabados.',
  },
  {
    n: '05',
    t: 'Membrana + SATE',
    d: 'Membrana que controla el vapor y sistema SATE exterior. Fachada protegida, sin puentes térmicos.',
  },
  {
    n: '06',
    t: 'Cubierta y acabados',
    d: 'Cubierta, carpinterías, instalaciones y acabados interiores. La casa queda lista para vivir, no para rematar.',
  },
];
const otherLines = [
  {
    v: 'integral',
    label: 'Reforma integral',
    plazo: 'Plazo orientativo: 8–12 semanas',
  },
  { v: 'aseo', label: 'Aseo', plazo: 'Plazo orientativo: 3–4 semanas' },
  { v: 'cocina', label: 'Cocina', plazo: 'Plazo orientativo: 4–6 semanas' },
  { v: 'porche', label: 'Porche', plazo: 'Plazo orientativo: 3–5 semanas' },
  {
    v: 'ampliacion',
    label: 'Ampliación',
    plazo: 'Plazo orientativo: 10–14 semanas',
  },
  { v: 'caseta', label: 'Caseta', plazo: 'Plazo orientativo: 4–6 semanas' },
] as const;
type OtherLine = (typeof otherLines)[number]['v'];

async function api(action: string, args: any) {
  const r = await fetch('actions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ action, args }),
  });
  const j = await r.json();
  if (!r.ok || j.error)
    throw new Error(j.error || 'No se pudo conectar con el guardado');
  return j.data;
}
function Compare({ img, title, deadline, includes, price }: any) {
  const [pos, setPos] = useState(62);
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'slider' | 'despues'>('slider');
  const move = (e: any) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - r.left;
    setPos(Math.max(4, Math.min(96, (x / r.width) * 100)));
  };
  return (
    <article className="card overflow-hidden">
      <div
        ref={ref}
        className="compare-range relative aspect-[4/3] cursor-ew-resize"
        onMouseMove={(e) => e.buttons === 1 && move(e)}
        onTouchMove={move}
        onMouseDown={move}
        onClick={move}
      >
        <img
          src={img}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - pos}% 0 0)`,
            backdropFilter:
              'grayscale(1) contrast(.75) brightness(.72) sepia(.18)',
            backgroundColor: 'rgba(20,20,10,.12)',
          }}
        />
        <div className="absolute top-3 left-3 z-10 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
          ANTES
        </div>
        <div className="absolute top-3 right-3 z-10 rounded-full bg-[var(--green)] px-3 py-1 text-xs font-bold text-white">
          DESPUÉS
        </div>
        <div
          className="absolute inset-y-0 z-10 w-[3px] bg-white shadow"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-black shadow">
            ↔
          </span>
        </div>
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 rounded-full bg-black/70 p-1 text-xs text-white">
          <button
            className={`rounded-full px-3 py-1 ${
              mode === 'slider' ? 'bg-white text-black' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setMode('slider');
            }}
          >
            Slider
          </button>
          <button
            className={`rounded-full px-3 py-1 ${
              mode === 'despues' ? 'bg-white text-black' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setMode('despues');
              setPos(0);
            }}
          >
            Solo después
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-tight">{title}</h3>
          <span className="rounded-full bg-[var(--soft)] px-3 py-1 text-xs font-extrabold text-[var(--green)]">
            DESDE {price} €/m²
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{includes}</p>
        <p className="mt-3 text-sm font-bold">{deadline}</p>
        <p className="mt-3 border-t border-[var(--line)] pt-3 text-xs leading-5 text-[var(--muted)]">
          Precios orientativos. Se presupuestará por separado tras visita /
          proyecto.
        </p>
      </div>
    </article>
  );
}

// ---- Manuales por rol ----
type ManualSection = { id: string; title: string; paragraphs: string[] };
function ManualOverlay({
  title,
  roleLabel,
  intro,
  sections,
  fileName,
  onClose,
}: {
  title: string;
  roleLabel: string;
  intro: string;
  sections: ManualSection[];
  fileName: string;
  onClose: () => void;
}) {
  const downloadManual = () => {
    const lines = [
      title,
      '',
      `Este manual solo lo ves tú porque has iniciado sesión como ${roleLabel}.`,
      '',
      intro,
      '',
      'ÍNDICE',
      ...sections.map((s, i) => `${i + 1}. ${s.title}`),
      '',
      ...sections.flatMap((s) => [s.title, '', ...s.paragraphs, '']),
    ];
    const blob = new Blob([lines.join('\n')], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/60 pt-[max(1rem,var(--safe-area-inset-top))] pb-6">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-[820px] rounded-[24px] bg-[var(--paper)] p-5 shadow-2xl sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="kicker">Manual JABE · Solo para tu rol</p>
              <h2 className="mt-2 font-display text-3xl leading-tight [overflow-wrap:anywhere]">
                {title}
              </h2>
              <p className="mt-2 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold text-[var(--green)]">
                Este manual solo lo ves tú porque has iniciado sesión como{' '}
                {roleLabel}.
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {intro}
              </p>
            </div>
            <button
              aria-label="Cerrar manual"
              onClick={onClose}
              className="shrink-0 rounded-full border p-2"
            >
              <X />
            </button>
          </div>
          <button
            onClick={downloadManual}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--green)] px-5 py-3 font-extrabold text-white"
          >
            <Download className="h-4 w-4" /> Descargar manual
          </button>
          <p className="mt-2 text-center text-xs leading-5 text-[var(--muted)]">
            Se descarga un archivo de texto con todo el manual. Puedes
            guardarlo, enviarlo y imprimirlo desde tu ordenador.
          </p>
          <nav
            aria-label="Índice del manual"
            className="mt-5 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4"
          >
            <p className="label">Índice · Pulsa un apartado para ir a él</p>
            <ol className="mt-3 space-y-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <button
                    onClick={() =>
                      document
                        .getElementById(`manual-${s.id}`)
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="w-full rounded-lg px-2 py-2 text-left text-sm font-bold text-[var(--green)] hover:bg-[var(--soft)]"
                  >
                    {i + 1}. {s.title}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-5 space-y-5">
            {sections.map((s, i) => (
              <article
                key={s.id}
                id={`manual-${s.id}`}
                className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5"
              >
                <h3 className="font-display text-2xl leading-tight">
                  {i + 1}. {s.title}
                </h3>
                {s.paragraphs.map((p, pi) => (
                  <p
                    key={pi}
                    className="mt-3 text-sm leading-6 text-[var(--muted)] [overflow-wrap:anywhere]"
                  >
                    {p}
                  </p>
                ))}
              </article>
            ))}
          </div>
          <button
            onClick={onClose}
            className="mt-5 w-full rounded-full border-2 border-[var(--ink)] py-3 font-extrabold"
          >
            Cerrar manual
          </button>
        </div>
      </div>
    </div>
  );
}
const adminManual: ManualSection[] = [
  {
    id: 'entrar',
    title: 'Cómo entrar como administrador',
    paragraphs: [
      'Pulsa “Iniciar sesión” en la parte de arriba de la web. Elige la pestaña “Administrador”.',
      'Escribe el usuario de demostración: admin. Escribe la contraseña de demostración: admin123. Pulsa “Entrar”.',
      'Si entras bien, verás el “Portal del cliente” en modo administrador y la etiqueta “Rol: Administrador”. Si te equivocas, aparece un mensaje en rojo: vuelve a escribir el usuario y la contraseña con cuidado, sin espacios al final.',
      'Ejemplo: imagina que quieres cambiar un precio. Primero entras como administrador. Sin entrar, no verás el manual ni las herramientas de administrador.',
    ],
  },
  {
    id: 'precios',
    title: 'Cómo cambiar los precios de las calculadoras',
    paragraphs: [
      'Entra como administrador y, dentro del portal, abre la pestaña “⚙ Panel de Administración de la Web”. Solo tú como administrador ves este panel. No hay botón de Panel Admin en la web pública.',
      'Para la obra nueva, verás tres casillas: “Baja €/m²”, “Media €/m²” y “Alta €/m²”. Los valores de partida son 2.000, 2.100 y 2.200. Cambia solo el número que quieras. Ejemplo: si la calidad Media pasa a 2.150, escribe 2150 en la casilla “Media”.',
      'Para reformas y otras líneas, cambia la casilla “Precio reformas (€/m²)”. El valor de partida es 900. Ejemplo: si pasa a 950, escribe 950.',
      'Para el ahorro de la casa de entramado ligero, cambia “mínimo %” y “máximo %”. Los valores de partida son 7% y 10%. Ejemplo: si quieres que la banda sea 8%–11%, escribe 8 y 11.',
      'Cuando termines, pulsa “Guardar cambios”. Espera a ver el mensaje de guardado. Después comprueba la calculadora en la web.',
    ],
  },
  {
    id: 'textos',
    title: 'Cómo cambiar textos de la web',
    paragraphs: [
      'En la misma pestaña “⚙ Panel de Administración de la Web” del portal, busca el campo que quieras cambiar: por ejemplo, “Titular principal”, “Teléfono”, “Email” o los plazos de vivienda, aseo y cocina.',
      'Borra el texto antiguo y escribe el nuevo tal como quieres que se vea. No hace falta saber código. Ejemplo: en “Teléfono”, escribe el número completo que quieres mostrar.',
      'Pulsa “Guardar cambios”. Si no pulsas guardar, el cambio no queda guardado aunque lo veas en pantalla.',
      'Consejo: cambia una cosa cada vez y comprueba el resultado antes de cambiar otra. Así, si algo no te gusta, sabes qué fue.',
    ],
  },
  {
    id: 'proyecto',
    title: 'Cómo crear un proyecto y un cliente',
    paragraphs: [
      'Entra como administrador y abre el portal. En las pestañas, pulsa “Panel administrador”.',
      'En “Crear proyecto / cliente”, escribe tres cosas: “Nombre del proyecto”, por ejemplo “Vivienda unifamiliar — Gijón”; “Cliente”, por ejemplo el nombre de la persona; y “Usuario del cliente”, por ejemplo “cliente-garcia”, sin espacios.',
      'Pulsa “Crear proyecto”. El proyecto aparecerá en la “Lista de proyectos”.',
      'Después, usa el desplegable “Cambiar de proyecto” para trabajar en ese proyecto: sus carpetas, fotos y documentos serán los de ese proyecto y no los de otro.',
    ],
  },
  {
    id: 'carpetas',
    title: 'Cómo crear carpetas',
    paragraphs: [
      'En el “Panel administrador”, busca “Carpetas del proyecto activo”. Primero comprueba que arriba está elegido el proyecto correcto.',
      'Escribe el nombre de la carpeta, por ejemplo “Cimentación”, y pulsa “Crear”.',
      'Para cambiar el nombre, pulsa “Renombrar”, escribe el nombre nuevo y pulsa “Guardar nombre”.',
      'Para borrar una carpeta vacía, pulsa “Eliminar”. Si la carpeta tiene fotos, primero mueve o elimina esas fotos: el sistema te avisará y no la borrará mientras tenga fotos.',
    ],
  },
  {
    id: 'fotos-admin',
    title: 'Cómo subir fotos a una carpeta del cliente',
    paragraphs: [
      'En el “Panel administrador”, busca “Añadir foto a una carpeta”.',
      'Elige la carpeta en el desplegable, por ejemplo “Estructura”. Elige una foto de ejemplo de JABE. Escribe un pie de foto claro, por ejemplo “Estructura en montaje”.',
      'Pulsa “Añadir foto”. La foto aparecerá en la pestaña “Fotografías”, dentro de esa carpeta.',
      'En esta versión, la subida de fotos desde el móvil o el ordenador todavía no está disponible. Por eso se elige una foto de ejemplo de JABE. No hace falta buscar archivos.',
    ],
  },
  {
    id: 'migrar',
    title: 'Cómo migrar fotos pendientes de empleados a carpetas del cliente',
    paragraphs: [
      'Las fotos que sube un empleado no van directas al cliente. Primero quedan en “Fotos pendientes de revisión”. Tú decides si pasan al cliente.',
      'Entra como administrador y pulsa la pestaña “Supervisión empleados”.',
      'En “Filtros de supervisión”, elige una sola obra en “Obra”. No dejes “Todas las obras” si quieres migrar.',
      'Marca la casilla de cada foto que quieras migrar. Puedes marcar una o varias.',
      'En “Carpeta destino del cliente”, elige la carpeta, por ejemplo “Estructura”. Pulsa “Migrar a carpeta de cliente”.',
      'Lee el mensaje de resultado: te dirá cuántas fotos se han migrado. Después, ve a la pestaña “Fotografías” y comprueba que ya se ven en esa carpeta.',
      'Ejemplo: un empleado sube dos fotos de la estructura. Tú filtras por esa obra, marcas las dos, eliges “Estructura” y pulsas “Migrar”. El cliente ya las verá.',
    ],
  },
  {
    id: 'docs-jabe',
    title: 'Cómo subir documentación para el cliente',
    paragraphs: [
      'Ve a la pestaña “Documentación JABE”.',
      'Si eres administrador, abajo verás “Añadir documentación de JABE”. Escribe el nombre del documento, por ejemplo “Presupuesto orientativo.pdf”. Elige el tipo, por ejemplo “PDF”, y el tamaño si lo sabes, por ejemplo “1,2 MB”.',
      'Pulsa “Añadir”. El documento aparecerá en la lista y el cliente podrá verlo y descargarlo.',
      'En esta versión, la subida de archivos todavía no está disponible. Por eso se registra el documento con su nombre. El archivo original se entrega al cliente por los canales habituales de JABE.',
    ],
  },
  {
    id: 'docs-gestion',
    title: 'Cómo eliminar o sustituir documentación',
    paragraphs: [
      'En “Tu documentación” o en “Documentación JABE”, cada documento tiene botones. Como administrador, verás “Cambiar” y “Eliminar”.',
      'Para cambiar: pulsa “Cambiar”, escribe el nombre nuevo, el tipo o el tamaño, y pulsa “Guardar cambio”. Para cancelar, pulsa “Cancelar”.',
      'Para eliminar: pulsa “Eliminar”. Solo el administrador puede eliminar o cambiar. El cliente no puede.',
      'Ejemplo: si un presupuesto tiene un nombre con un error, pulsa “Cambiar”, corrige el nombre y guarda. No hace falta borrarlo y volver a crearlo.',
    ],
  },
  {
    id: 'partes',
    title: 'Cómo revisar partes diarios firmados y sin firmar',
    paragraphs: [
      'Ve a “Supervisión empleados”. Abajo verás “Partes diarios”.',
      'Usa los filtros: obra, empleado, fecha y “Partes: firmado”. Elige “Solo firmados” para ver los firmados, o “Solo sin firmar” para ver los borradores.',
      'Cada parte muestra la fecha, la obra, el empleado, si está firmado y por quién, los trabajos, materiales, horas, trabajadores e incidencias.',
      'Para cada parte puedes pulsar “Descargar ficha”, “Aprobar”, “Rechazar” o “Eliminar”. Lee bien antes de eliminar: un parte eliminado no se puede recuperar desde el portal.',
    ],
  },
  {
    id: 'descargar-partes',
    title: 'Cómo descargar todas las fichas de partes',
    paragraphs: [
      'En “Supervisión empleados”, primero aplica los filtros que quieras: por ejemplo, una obra y una fecha.',
      'Pulsa “Descargar todas las fichas”. Se descargará un archivo con las fichas que cumplen ese filtro, no con todas las de siempre.',
      'Si quieres todas, deja los filtros en “Todas las obras” y “Todos” antes de descargar.',
      'Ejemplo: quieres las fichas de una obra en una semana. Filtra por esa obra y descarga. Comprueba que el archivo tiene las fichas esperadas.',
    ],
  },
  {
    id: 'usuarios',
    title: 'Cómo crear usuarios de cliente y de empleado',
    paragraphs: [
      'Cliente: se crea al crear el proyecto. En “Panel administrador”, escribe el “Usuario del cliente” en el formulario de proyecto. JABE le entregará su contraseña por su canal habitual.',
      'Empleado: en esta versión de demostración, el acceso de empleado usa la cuenta de prueba que JABE entrega al equipo. No se crean contraseñas de empleado dentro de este portal. Si un empleado no puede entrar, comprueba que escribe bien su usuario y su contraseña, sin espacios.',
      'No compartas contraseñas por mensajes que puedan ver otras personas. Cada persona debe usar su propio usuario.',
    ],
  },
  {
    id: 'salir',
    title: 'Cómo cerrar sesión',
    paragraphs: [
      'En la parte de arriba del portal, pulsa “Cerrar sesión”.',
      'Después, el portal se cierra y vuelves a la web normal. Nadie más que use ese ordenador verá tu sesión.',
      'Si usas un ordenador compartido, cierra siempre la sesión. No basta con cerrar la pestaña.',
    ],
  },
  {
    id: 'no-tocar',
    title: 'Qué NO debe tocar',
    paragraphs: [
      'No borres proyectos, carpetas con fotos, fotos o documentos sin estar seguro. Si dudas, pregunta antes a JABE.',
      'No cambies precios o textos “para probar” en la web real. Si quieres probar, cambia una cosa, compruébala y, si no te gusta, vuelve a poner el valor anterior.',
      'No escribas contraseñas en los campos de nombre, pie de foto o nombre de documento. Esos campos los ven otras personas.',
      'No uses los campos de documentos para subir archivos: en esta versión no se guardan archivos en el navegador.',
    ],
  },
  {
    id: 'problemas',
    title: 'Qué hacer si algo no se ve',
    paragraphs: [
      'Primero, comprueba que estás en el proyecto correcto con el desplegable “Cambiar de proyecto”. Muchas veces el problema es que estás viendo otro proyecto.',
      'Después, comprueba la pestaña correcta: fotos en “Fotografías”, documentos del cliente en “Tu documentación” y documentos de JABE en “Documentación JABE”.',
      'Si una foto pendiente no aparece, comprueba en “Supervisión empleados” que el filtro de obra no sea “Todas las obras” y que el estado no esté filtrado por “Aprobada” o “Rechazada”.',
      'Si un cambio de precio no se ve, vuelve al “Panel Admin”, comprueba el número y pulsa otra vez “Guardar cambios”.',
      'Si sigue sin verse, cierra la sesión, vuelve a entrar y comprueba de nuevo. Si el problema continúa, anota qué hiciste paso a paso y qué mensaje apareció, y avisa a JABE.',
    ],
  },
  {
    id: 'faq',
    title: 'Preguntas frecuentes',
    paragraphs: [
      '¿Puedo deshacer un borrado? No desde el portal. Por eso, antes de borrar, lee el nombre completo y confirma que es el elemento correcto.',
      '¿El cliente puede borrar mis documentos? No. El cliente puede registrar su documentación, pero no puede eliminar ni cambiar lo ya registrado. Solo el administrador puede.',
      '¿El empleado puede ver lo del cliente? No. El empleado solo ve sus obras asignadas, sus fotos pendientes y sus partes.',
      '¿Las fotos del cliente se pueden descargar? En el portal de cliente no tienen botón de descarga. El cliente las ve dentro del portal, con marca de agua.',
      '¿Qué hago si olvido la contraseña? Usa el enlace “¿Has olvidado tu contraseña?” en la ventana de acceso para ver las cuentas de demostración. En la versión final, JABE enviará un enlace para crear una contraseña nueva.',
    ],
  },
];
const clientManual: ManualSection[] = [
  {
    id: 'entrar',
    title: 'Cómo entrar',
    paragraphs: [
      'Pulsa “Iniciar sesión” en la parte de arriba de la web. Elige la pestaña “Cliente”.',
      'Escribe tu usuario y tu contraseña. En la demostración, el usuario es cliente y la contraseña es cliente123. En tu caso real, JABE te dará tu usuario y tu contraseña.',
      'Pulsa “Entrar”. Verás el “Portal del cliente” con tu proyecto.',
      'Si aparece “Usuario o contraseña incorrectos”, vuelve a escribirlos con cuidado, sin espacios al principio ni al final. Si sigues sin entrar, avisa a JABE.',
    ],
  },
  {
    id: 'fotos',
    title: 'Cómo ver las fotos de tu proyecto por carpetas',
    paragraphs: [
      'En el portal, pulsa la pestaña “A · Fotografías”.',
      'Arriba verás las carpetas, por ejemplo “Cimentación”, “Estructura”, “Cubierta”, “Interiores”, “Aseos” y “Cocina”. Cada carpeta dice cuántas fotos tiene.',
      'Pulsa una carpeta para ver solo sus fotos. Ejemplo: pulsa “Cocina” para ver solo las fotos de la cocina.',
      'Cada foto tiene un pie que explica qué es, por ejemplo “Cocina terminada”.',
    ],
  },
  {
    id: 'sin-descargar',
    title: 'Las fotos no se pueden descargar: tienen marca de agua',
    paragraphs: [
      'Las fotos del portal no tienen botón de descarga. Esto es así a propósito, para proteger el trabajo.',
      'Al ver una foto, verás una marca de agua con el texto “JABE — Uso exclusivo cliente”. Esa marca forma parte de la vista.',
      'No hace falta que guardes las fotos: siempre que entres a tu portal, estarán en su carpeta. Si necesitas una foto para un trámite, pide a JABE que te la envíe por su canal habitual.',
    ],
  },
  {
    id: 'subir-doc',
    title: 'Cómo subir tu documentación',
    paragraphs: [
      'Pulsa la pestaña “B · Tu documentación”.',
      'Escribe el nombre del documento, por ejemplo “Escritura — nota simple.pdf”. Elige el tipo, por ejemplo “PDF”.',
      'Pulsa “Registrar mi documentación”. El documento quedará registrado en tu proyecto.',
      'En esta versión, la subida de archivos todavía no está disponible. Por eso registras el nombre del documento y JABE lo asocia a tu proyecto. No se guardan archivos en el navegador.',
      'Ejemplo: si JABE te pide la escritura, la registras aquí con su nombre exacto. Así queda constancia de que ya la has aportado.',
    ],
  },
  {
    id: 'descargar-jabe',
    title: 'Cómo descargar la documentación que JABE te envía',
    paragraphs: [
      'Pulsa la pestaña “C · Documentación JABE”. Ahí verás presupuestos, planos, licencias y garantías que JABE te remite.',
      'Busca el documento por su nombre y su fecha. Pulsa “Descargar al ordenador”.',
      'El archivo se descargará en tu ordenador o móvil, en la carpeta de descargas. Ábrelo desde ahí.',
      'Ejemplo: si ves “Presupuesto orientativo.pdf”, pulsa “Descargar al ordenador” y comprueba que se abre el archivo descargado.',
    ],
  },
  {
    id: 'no-eliminar',
    title: 'Qué no puedes eliminar',
    paragraphs: [
      'Puedes registrar tu documentación, pero no puedes eliminar ni cambiar lo que ya está registrado.',
      'Esto es así para que nadie borre por error un documento importante.',
      'Si te equivocas en el nombre de un documento que acabas de registrar, avisa a JABE: solo el administrador puede eliminar o cambiar un documento.',
    ],
  },
  {
    id: 'salir',
    title: 'Cómo cerrar sesión',
    paragraphs: [
      'En la parte de arriba del portal, pulsa “Cerrar sesión”.',
      'Después, el portal se cierra. Si usas un ordenador o móvil compartido, cierra siempre la sesión para que nadie más vea tu proyecto.',
    ],
  },
  {
    id: 'no-veo',
    title: 'Qué hacer si no ves una foto o un documento',
    paragraphs: [
      'Primero, comprueba que estás en la pestaña correcta: fotos en “Fotografías”, tu documentación en “Tu documentación” y documentación de JABE en “Documentación JABE”.',
      'Después, comprueba la carpeta: una foto puede estar en otra carpeta. Pulsa cada carpeta y mira sus fotos.',
      'Si acabas de registrar un documento, comprueba que escribiste su nombre y pulsaste el botón de registrar.',
      'Si sigue sin aparecer, espera un momento y vuelve a entrar. A veces la foto o el documento está en revisión: en ese caso, JABE lo publicará cuando esté listo.',
      'Si después de eso sigue sin verse, anota el nombre de la foto o del documento y la fecha, y avisa a JABE.',
    ],
  },
  {
    id: 'faq',
    title: 'Preguntas frecuentes',
    paragraphs: [
      '¿Puedo ver otros proyectos? No. Solo ves tu proyecto y su documentación.',
      '¿Puedo descargar las fotos? No desde el portal. Las fotos se ven dentro del portal, con marca de agua.',
      '¿Puedo borrar un documento? No. Solo JABE puede eliminar o cambiar documentos.',
      '¿Puedo entrar desde el móvil? Sí. El portal se adapta al móvil. Usa los mismos usuario y contraseña.',
      '¿Qué hago si olvido la contraseña? Pulsa “¿Has olvidado tu contraseña?” en la ventana de acceso. En la versión final, JABE te enviará un enlace para crear una contraseña nueva.',
    ],
  },
];
const employeeManual: ManualSection[] = [
  {
    id: 'entrar',
    title: 'Cómo entrar',
    paragraphs: [
      'Pulsa “Acceso empleados” en la parte de arriba de la web. Elige la pestaña “Empleado”.',
      'Escribe tu usuario y tu contraseña. En la demostración, el usuario es empleado y la contraseña es empleado123. En tu caso real, JABE te dará tu usuario y tu contraseña.',
      'Pulsa “Entrar”. Verás el “Portal de empleados” con tu nombre y la fecha de hoy.',
      'Si aparece “Usuario o contraseña incorrectos”, vuelve a escribirlos con cuidado, sin espacios al principio ni al final.',
    ],
  },
  {
    id: 'obra',
    title: 'Cómo elegir tu obra',
    paragraphs: [
      'En el portal de empleados, en el paso “1 · Elige tu obra / proyecto”, verás la lista de obras.',
      'Pulsa “Elegir esta obra” en la obra donde estás trabajando. La obra elegida quedará marcada como “Obra seleccionada”.',
      'Todo lo que hagas después — fotos y partes — quedará asociado a esa obra. Por eso, antes de hacer nada, comprueba que la obra elegida es la correcta.',
      'Ejemplo: si hoy estás en “Vivienda unifamiliar — Gijón”, elige esa obra. No elijas otra por error.',
    ],
  },
  {
    id: 'camara',
    title: 'Cómo usar la cámara: una foto o varias y subir todas juntas',
    paragraphs: [
      'En el paso “2 · ¿Qué quieres hacer?”, pulsa “Fotos de obra”.',
      'Elige una foto de ejemplo de JABE en el desplegable. Escribe una descripción clara, por ejemplo “Estructura en montaje”.',
      'Pulsa “+ Añadir a la cola”. La foto quedará en la cola, en “Vista previa”, pero todavía no se ha subido.',
      'Puedes repetir el paso para añadir más fotos a la cola. Así puedes preparar una foto o varias antes de subirlas.',
      'Cuando la cola esté lista, pulsa “Subir todas”. Las fotos pasarán a “Fotos pendientes de revisión”. No van directas al cliente: el administrador las revisa primero.',
      'En esta versión, la subida de fotos desde la cámara o la galería del dispositivo todavía no está disponible. Por eso se elige una foto de ejemplo de JABE.',
    ],
  },
  {
    id: 'parte',
    title: 'Cómo rellenar el parte diario',
    paragraphs: [
      'En el paso “2 · ¿Qué quieres hacer?”, pulsa “Parte de trabajo diario”.',
      'Arriba verás tres datos que ya vienen puestos: tu nombre, la fecha de hoy y la obra. No tienes que escribirlos. Comprueba que la obra es la correcta.',
      'Después, rellena solo el trabajo del día. Los campos están explicados en el apartado siguiente.',
    ],
  },
  {
    id: 'campos',
    title: 'Qué escribir en trabajos, materiales, horas e incidencias',
    paragraphs: [
      'Trabajos realizados en el día: escribe qué se ha hecho hoy, con frases claras. Ejemplo: “Montaje de montantes y colocación de aislamiento en planta baja”. Este campo es obligatorio.',
      'Materiales utilizados: escribe qué material se ha usado. Ejemplo: “Montantes de madera, fibra de madera, tornillería”. Si no se ha usado material, puedes poner “—”.',
      'Horas: escribe cuántas horas has trabajado. Ejemplo: “8”.',
      'Nº de trabajadores: escribe cuántas personas han trabajado. Ejemplo: “2”.',
      'Incidencias / Observaciones: escribe si ha pasado algo importante o si queda algo pendiente. Ejemplo: “Sin incidencias” o “Pendiente de confirmar material de remate”. Si no hay nada, escribe “Sin incidencias”.',
    ],
  },
  {
    id: 'firmar',
    title: 'Cómo firmar y enviar para supervisión',
    paragraphs: [
      'Cuando el parte esté completo, pulsa “Firmar y enviar para supervisión”.',
      'Quedará registrado “Firmado por” tu nombre y la fecha y hora de la firma. Ejemplo: “Firmado por empleado el 23/11/2026, 18:20”.',
      'Después, el parte irá a supervisión: el administrador lo verá en “Supervisión empleados” y podrá aprobarlo o rechazarlo.',
      'Antes de firmar, lee el parte otra vez. Un parte firmado ya no se puede borrar desde tu portal.',
    ],
  },
  {
    id: 'sin-firmar',
    title: 'Qué pasa si no firmas: queda sin firmar',
    paragraphs: [
      'Si pulsas “Guardar como borrador”, el parte queda guardado como “SIN FIRMAR · BORRADOR”.',
      'Un borrador no se envía a supervisión como parte firmado. Sirve para dejar el trabajo apuntado y terminarlo después.',
      'Un borrador sí se puede eliminar desde tu portal, con el botón “Eliminar borrador”. Un parte firmado no se puede eliminar.',
    ],
  },
  {
    id: 'no-borrar',
    title: 'Qué no puedes borrar cuando está firmado',
    paragraphs: [
      'No puedes eliminar un parte ya firmado. Si te equivocas en un parte firmado, avisa al administrador: solo él puede gestionarlo desde supervisión.',
      'Tampoco puedes eliminar una foto pendiente que ya no esté pendiente: si ya está aprobada o rechazada, no se puede eliminar desde tu portal.',
      'Ejemplo: si firmas un parte con un error, no intentes borrarlo. Avisa al administrador y explícale qué hay que corregir.',
    ],
  },
  {
    id: 'salir',
    title: 'Cómo cerrar sesión',
    paragraphs: [
      'En la parte de arriba del portal, pulsa “Cerrar sesión”.',
      'Después, el portal se cierra. Si usas un móvil o un ordenador compartido, cierra siempre la sesión.',
    ],
  },
  {
    id: 'consejos',
    title: 'Consejos para hacer buenas fotos',
    paragraphs: [
      'Buena luz: haz la foto con luz natural cuando puedas. Evita hacer fotos a contraluz, porque la obra sale oscura.',
      'Foto horizontal: gira el móvil en horizontal para que se vea más parte de la obra.',
      'No fotos borrosas: apoya el móvil, espera un segundo y comprueba la foto antes de añadirla a la cola. Si sale borrosa, hazla otra vez.',
      'Descripción clara: escribe qué se ve en la foto, no solo “foto”. Ejemplo: “Cubierta terminada, lado sur”. Así el administrador sabrá qué está revisando.',
    ],
  },
  {
    id: 'faq',
    title: 'Preguntas frecuentes',
    paragraphs: [
      '¿El cliente ve mis fotos nada más subirlas? No. Primero quedan en pendientes. El administrador las revisa y después las migra a la carpeta del cliente.',
      '¿Puedo cambiar un parte firmado? No desde tu portal. Avisa al administrador.',
      '¿Puedo subir fotos de otra obra? Sí, pero primero elige la obra correcta. Si te equivocas de obra, la foto quedará en la obra equivocada.',
      '¿Qué hago si no veo mi obra? Comprueba que has elegido la obra en el paso 1. Si tu obra no aparece, avisa a JABE.',
      '¿Qué hago si olvido la contraseña? Pulsa “¿Has olvidado tu contraseña?” en la ventana de acceso. En la versión final, JABE te enviará un enlace para crear una contraseña nueva.',
    ],
  },
];

// ---- Portal types ----
type Project = {
  id: string;
  name: string;
  client: string;
  username: string;
  created?: string;
};
type Folder = { id: string; projectId: string; name: string };
type Photo = {
  id: string;
  projectId: string;
  folderId: string;
  imageKey: string;
  caption: string;
};
type Doc = {
  id: string;
  projectId: string;
  section: 'cliente' | 'jabe';
  name: string;
  kind: string;
  sizeLabel: string;
  date: string;
};
type PendingPhoto = {
  id: string;
  projectId: string;
  imageKey: string;
  caption: string;
  employee: string;
  date: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
};
type DailyPart = {
  id: string;
  projectId: string;
  projectName: string;
  employee: string;
  date: string;
  trabajos: string;
  materiales: string;
  horas: string;
  incidencias: string;
  trabajadores: string;
  signed: boolean;
  signedBy?: string;
  signedAt?: string;
  status: 'borrador' | 'enviado' | 'aprobado' | 'rechazado';
};
const exampleImages = [
  { key: 'vivienda', label: 'Vivienda completa', src: viviendaImg },
  { key: 'aseo', label: 'Aseo', src: aseoImg },
  { key: 'cocina', label: 'Cocina', src: cocinaImg },
  { key: 'esquema', label: 'Esquema constructivo', src: esquemaImg },
];
const imgFor = (k: string) =>
  exampleImages.find((i) => i.key === k)?.src || viviendaImg;
const demoProjects: Project[] = [
  {
    id: 'demo-1',
    name: 'Vivienda unifamiliar — Gijón',
    client: 'Cliente de ejemplo',
    username: 'cliente',
    created: '12/11/2026',
  },
];
const demoFolders: Folder[] = [
  { id: 'demo-f1', projectId: 'demo-1', name: 'Cimentación' },
  { id: 'demo-f2', projectId: 'demo-1', name: 'Estructura' },
  { id: 'demo-f3', projectId: 'demo-1', name: 'Cubierta' },
  { id: 'demo-f4', projectId: 'demo-1', name: 'Interiores' },
  { id: 'demo-f5', projectId: 'demo-1', name: 'Aseos' },
  { id: 'demo-f6', projectId: 'demo-1', name: 'Cocina' },
];
const demoPhotos: Photo[] = [
  {
    id: 'demo-p1',
    projectId: 'demo-1',
    folderId: 'demo-f2',
    imageKey: 'vivienda',
    caption: 'Estructura en montaje',
  },
  {
    id: 'demo-p2',
    projectId: 'demo-1',
    folderId: 'demo-f5',
    imageKey: 'aseo',
    caption: 'Aseo terminado',
  },
  {
    id: 'demo-p3',
    projectId: 'demo-1',
    folderId: 'demo-f6',
    imageKey: 'cocina',
    caption: 'Cocina terminada',
  },
  {
    id: 'demo-p4',
    projectId: 'demo-1',
    folderId: 'demo-f3',
    imageKey: 'esquema',
    caption: 'Esquema de cubierta',
  },
];
const demoDocs: Doc[] = [
  {
    id: 'demo-d1',
    projectId: 'demo-1',
    section: 'cliente',
    name: 'Escritura — nota simple.pdf',
    kind: 'PDF',
    sizeLabel: '1,2 MB',
    date: '10/11/2026',
  },
  {
    id: 'demo-d2',
    projectId: 'demo-1',
    section: 'jabe',
    name: 'Presupuesto orientativo.pdf',
    kind: 'PDF',
    sizeLabel: '0,8 MB',
    date: '11/11/2026',
  },
  {
    id: 'demo-d3',
    projectId: 'demo-1',
    section: 'jabe',
    name: 'Plano general.pdf',
    kind: 'PDF',
    sizeLabel: '2,4 MB',
    date: '11/11/2026',
  },
];
const demoPendingPhotos: PendingPhoto[] = [
  {
    id: 'demo-pp1',
    projectId: 'demo-1',
    imageKey: 'vivienda',
    caption: 'Avance de estructura — pendiente de revisión',
    employee: 'empleado',
    date: '23/11/2026',
    status: 'pendiente',
  },
];
const demoParts: DailyPart[] = [
  {
    id: 'demo-part1',
    projectId: 'demo-1',
    projectName: 'Vivienda unifamiliar — Gijón',
    employee: 'empleado',
    date: '23/11/2026',
    trabajos:
      'Montaje de montantes y colocación de aislamiento en planta baja.',
    materiales: 'Montantes de madera, fibra de madera, tornillería.',
    horas: '8',
    incidencias: 'Sin incidencias.',
    trabajadores: '2',
    signed: true,
    signedBy: 'empleado',
    signedAt: '23/11/2026, 18:20',
    status: 'enviado',
  },
  {
    id: 'demo-part2',
    projectId: 'demo-1',
    projectName: 'Vivienda unifamiliar — Gijón',
    employee: 'empleado',
    date: '22/11/2026',
    trabajos: 'Repaso de cubierta y limpieza de obra.',
    materiales: '—',
    horas: '6',
    incidencias: 'Pendiente de confirmar material de remate.',
    trabajadores: '1',
    signed: false,
    status: 'borrador',
  },
];
const today = () => new Date().toLocaleDateString('es-ES');
type ChatMsg = {
  id: string;
  projectId: string;
  sender: 'cliente' | 'admin';
  senderName: string;
  text: string;
  time: string;
  createdAt: number;
  readAdmin: boolean;
  readClient: boolean;
};
const csvCell = (v: string) => `"${String(v || '').replace(/"/g, '""')}"`;

export default function App() {
  const [cfg, setCfg] = useState<Config>(defaults);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState('');
  const show = (v: string | undefined, fb: string) => (v || '').trim() || fb;
  const showAddress = () => {
    const l = (cfg.addressLine1 || '').trim();
    const c = (cfg.addressCity || '').trim();
    const p = (cfg.addressPostal || '').trim();
    return [l || '[Dirección]', c, p].filter(Boolean).join(', ');
  };
  const [m2, setM2] = useState(100);
  const [qualityNew, setQualityNew] = useState<'Baja' | 'Media' | 'Alta'>(
    'Media'
  );
  const [type2, setType2] = useState<OtherLine>('integral');
  const [m2_2, setM2_2] = useState(60);
  const [quality2, setQuality2] = useState<'Estándar' | 'Media' | 'Premium'>(
    'Media'
  );
  const [eff, setEff] = useState(8.5);
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState('');

  // ---- Portal / login ----
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState<'cliente' | 'empleado' | 'admin'>(
    'cliente'
  );
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [user, setUser] = useState<{
    username: string;
    role: 'admin' | 'cliente' | 'empleado';
  } | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState<
    'admin' | 'cliente' | 'empleado' | null
  >(null);
  const [portalTab, setPortalTab] = useState<
    | 'fotos'
    | 'doc-cliente'
    | 'doc-jabe'
    | 'admin'
    | 'supervision'
    | 'webadmin'
    | 'chat'
    | 'chats'
  >('fotos');
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [folders, setFolders] = useState<Folder[]>(demoFolders);
  const [photos, setPhotos] = useState<Photo[]>(demoPhotos);
  const [docs, setDocs] = useState<Doc[]>(demoDocs);
  const [portalMsg, setPortalMsg] = useState('');
  const [portalBusy, setPortalBusy] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('demo-1');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [photoSearch, setPhotoSearch] = useState('');
  const [photoPage, setPhotoPage] = useState(1);
  const [docSearch, setDocSearch] = useState('');
  const [docPage, setDocPage] = useState(1);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectPage, setProjectPage] = useState(1);
  const [partSearch, setPartSearch] = useState('');
  const [partPage, setPartPage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [photoViewer, setPhotoViewer] = useState<Photo | null>(null);
  const [compressedNote, setCompressedNote] = useState('');
  const PAGE_SIZE = 20;
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    username: '',
  });
  const [newFolderName, setNewFolderName] = useState('');
  const [renameFolder, setRenameFolder] = useState({ id: '', name: '' });
  const [newPhoto, setNewPhoto] = useState({
    imageKey: 'vivienda',
    caption: '',
  });
  const [newDoc, setNewDoc] = useState({
    section: 'jabe' as 'cliente' | 'jabe',
    name: '',
    kind: 'PDF',
    sizeLabel: '',
  });
  const [clientDocName, setClientDocName] = useState('');
  const [clientDocKind, setClientDocKind] = useState('PDF');
  const [movePhoto, setMovePhoto] = useState({ photoId: '', folderId: '' });
  const [editDoc, setEditDoc] = useState({
    id: '',
    name: '',
    kind: 'PDF',
    sizeLabel: '',
  });

  // ---- Empleado ----
  const [employeeProjectId, setEmployeeProjectId] = useState('demo-1');
  const [employeeView, setEmployeeView] = useState<
    'opciones' | 'fotos' | 'parte'
  >('opciones');
  const [queueImageKey, setQueueImageKey] = useState('vivienda');
  const [queueCaption, setQueueCaption] = useState('');
  const [employeeQueue, setEmployeeQueue] = useState<
    { id: string; imageKey: string; caption: string }[]
  >([]);
  const [queueResult, setQueueResult] = useState<{
    saved: number;
    remaining: number;
    error: string | null;
    reloadError: string | null;
  } | null>(null);
  const [partForm, setPartForm] = useState({
    trabajos: '',
    materiales: '',
    horas: '',
    incidencias: '',
    trabajadores: '',
  });
  const [pendingPhotos, setPendingPhotos] =
    useState<PendingPhoto[]>(demoPendingPhotos);
  const [parts, setParts] = useState<DailyPart[]>(demoParts);
  // ---- Supervisión admin ----
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);
  const [migrateFolderId, setMigrateFolderId] = useState('');
  const [migrateResult, setMigrateResult] = useState('');
  const [supProject, setSupProject] = useState('todas');
  const [supEmployee, setSupEmployee] = useState('todos');
  const [supDate, setSupDate] = useState('');
  const [supSigned, setSupSigned] = useState<
    'todos' | 'firmados' | 'sin-firmar'
  >('todos');
  const [supStatus, setSupStatus] = useState('todos');
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [adminChatProjectId, setAdminChatProjectId] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const [chatAlert, setChatAlert] = useState('');
  const [chatNotice, setChatNotice] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const chatRef = useRef<ChatMsg[]>([]);
  useEffect(() => {
    chatRef.current = chatMessages;
  }, [chatMessages]);

  const tradPriceFor = (q: 'Baja' | 'Media' | 'Alta') =>
    q === 'Baja'
      ? cfg.tradLow || 2000
      : q === 'Media'
      ? cfg.tradMid || 2100
      : cfg.tradHigh || 2200;
  const tradPrice = tradPriceFor(qualityNew);
  const calcNew = useMemo(() => {
    const traditional = tradPrice * m2;
    const saving = (traditional * eff) / 100;
    const jabe = traditional - saving;
    return {
      traditional,
      saving,
      jabe,
      monthly: jabe / 18,
      plan: '20 / 30 / 30 / 10 / 10',
    };
  }, [tradPrice, m2, eff]);
  const reformFactor =
    quality2 === 'Estándar'
      ? cfg.reformFactorStandard ?? 1
      : quality2 === 'Media'
      ? cfg.reformFactorMedia ?? 1.18
      : cfg.reformFactorPremium ?? 1.42;
  const calc2 = useMemo(() => {
    const lo = cfg.basePrice * m2_2 * reformFactor;
    const hi = lo * 1.22;
    return { lo, hi, monthly: hi / 10, plan: '50 / 40 / 10' };
  }, [cfg.basePrice, m2_2, reformFactor]);
  const selectedOther = otherLines.find((l) => l.v === type2) || otherLines[0];
  const traditional120 = tradPrice * 120;
  const jabe120 = traditional120 * (1 - eff / 100);
  const saving120 = traditional120 - jabe120;

  const load = async () => {
    try {
      const data = await api('records.list', { collection: 'jabe_config' });
      const rec = data.records?.[0];
      if (rec) {
        const merged = { ...defaults, ...rec.value };
        setCfg(merged);
        setEff((rec.value.compareMin + rec.value.compareMax) / 2);
        setSavedId(rec.id);
      }
    } catch {
      setSaveState(
        'Guardado no disponible en esta vista previa. Los cambios se aplican en vivo.'
      );
    }
  };
  useEffect(() => {
    load();
  }, []);
  const save = async (next: Config) => {
    const safe = { ...next };
    setSaveState('Guardando…');
    try {
      if (savedId)
        await api('records.replace', {
          collection: 'jabe_config',
          id: savedId,
          value: safe,
        });
      else {
        const rec = await api('records.create', {
          collection: 'jabe_config',
          value: safe,
          idempotency_key: 'jabe-config-v1',
        });
        setSavedId(rec.id);
      }
      setSaveState('✓ Guardado correctamente');
      setTimeout(() => setSaveState(''), 2500);
    } catch (e: any) {
      setSaveState(e.message);
    }
  };
  const change = (k: keyof Config, v: any) => {
    const next = { ...cfg, [k]: v };
    setCfg(next);
  };
  const commit = () => save(cfg);
  const reset = async () => {
    setCfg(defaults);
    await save(defaults);
  };
  const copyText = (text: string, label: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    el.remove();
    setCopied(label);
    setTimeout(() => setCopied(''), 2200);
  };
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const copyRef = useRef<HTMLTextAreaElement>(null);

  // ---- Portal helpers ----
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'empleado';
  const visibleProject: Project | undefined = useMemo(() => {
    if (isAdmin)
      return projects.find((p) => p.id === selectedProjectId) || projects[0];
    if (isEmployee)
      return projects.find((p) => p.id === employeeProjectId) || projects[0];
    return projects.find((p) => p.username === user?.username) || projects[0];
  }, [
    projects,
    selectedProjectId,
    employeeProjectId,
    isAdmin,
    isEmployee,
    user,
  ]);
  const visibleFolders = useMemo(
    () => folders.filter((f) => f.projectId === visibleProject?.id),
    [folders, visibleProject]
  );
  const visiblePhotos = useMemo(
    () => photos.filter((p) => p.projectId === visibleProject?.id),
    [photos, visibleProject]
  );
  const visibleDocs = useMemo(
    () => docs.filter((d) => d.projectId === visibleProject?.id),
    [docs, visibleProject]
  );
  const employeeProject = useMemo(
    () => projects.find((p) => p.id === employeeProjectId) || projects[0],
    [projects, employeeProjectId]
  );
  const employeePending = useMemo(
    () => pendingPhotos.filter((p) => p.projectId === employeeProjectId),
    [pendingPhotos, employeeProjectId]
  );
  const employeeParts = useMemo(
    () =>
      parts.filter(
        (p) =>
          p.projectId === employeeProjectId && p.employee === user?.username
      ),
    [parts, employeeProjectId, user]
  );
  const clientChatMessages = useMemo(
    () =>
      chatMessages
        .filter((m) => m.projectId === visibleProject?.id)
        .sort((a, b) => a.createdAt - b.createdAt),
    [chatMessages, visibleProject]
  );
  const adminActiveChatMessages = useMemo(
    () =>
      chatMessages
        .filter((m) => m.projectId === adminChatProjectId)
        .sort((a, b) => a.createdAt - b.createdAt),
    [chatMessages, adminChatProjectId]
  );
  const adminChats = useMemo(() => {
    const map = new Map<
      string,
      { project: Project | undefined; last: ChatMsg; unread: number }
    >();
    for (const m of chatMessages) {
      const proj = projects.find((p) => p.id === m.projectId);
      const cur = map.get(m.projectId);
      const add = m.sender === 'cliente' && !m.readAdmin ? 1 : 0;
      if (!cur) map.set(m.projectId, { project: proj, last: m, unread: add });
      else {
        if (m.createdAt >= cur.last.createdAt) cur.last = m;
        cur.unread += add;
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => b.last.createdAt - a.last.createdAt
    );
  }, [chatMessages, projects]);
  const totalUnreadAdmin = useMemo(
    () =>
      chatMessages.filter((m) => m.sender === 'cliente' && !m.readAdmin).length,
    [chatMessages]
  );
  const clientUnread = useMemo(
    () =>
      chatMessages.filter(
        (m) =>
          m.projectId === visibleProject?.id &&
          m.sender === 'admin' &&
          !m.readClient
      ).length,
    [chatMessages, visibleProject]
  );

  async function loadPortal() {
    try {
      const [p, f, ph, d, pp, pa] = await Promise.all([
        api('records.list', { collection: 'jabe_portal_projects' }),
        api('records.list', { collection: 'jabe_portal_folders' }),
        api('records.list', { collection: 'jabe_portal_photos' }),
        api('records.list', { collection: 'jabe_portal_docs' }),
        api('records.list', { collection: 'jabe_portal_pending_photos' }),
        api('records.list', { collection: 'jabe_portal_parts' }),
      ]);
      if (p.records?.length)
        setProjects([
          ...demoProjects,
          ...p.records.map((r: any) => ({ id: r.id, ...r.value })),
        ]);
      if (f.records?.length)
        setFolders([
          ...demoFolders,
          ...f.records.map((r: any) => ({ id: r.id, ...r.value })),
        ]);
      if (ph.records?.length)
        setPhotos([
          ...demoPhotos,
          ...ph.records.map((r: any) => ({ id: r.id, ...r.value })),
        ]);
      if (d.records?.length)
        setDocs([
          ...demoDocs,
          ...d.records.map((r: any) => ({ id: r.id, ...r.value })),
        ]);
      if (pp.records?.length)
        setPendingPhotos([
          ...demoPendingPhotos,
          ...pp.records.map((r: any) => ({ id: r.id, ...r.value })),
        ]);
      if (pa.records?.length)
        setParts([
          ...demoParts,
          ...pa.records.map((r: any) => ({ id: r.id, ...r.value })),
        ]);
    } catch {
      /* La vista de ejemplo sigue disponible si el guardado no responde */
    }
  }
  useEffect(() => {
    if (portalOpen) loadPortal();
  }, [portalOpen]);
  const loadChat = async () => {
    try {
      const d = await api('records.list', { collection: 'jabe_chat_messages' });
      if (d.records?.length) {
        const mapped = d.records
          .map((r: any) => ({ id: r.id, ...r.value } as ChatMsg))
          .sort((a: any, b: any) => a.createdAt - b.createdAt);
        setChatMessages(mapped);
      }
    } catch {}
  };
  useEffect(() => {
    if (portalOpen) loadChat();
  }, [portalOpen]);
  const markChatRead = async (projectId: string) => {
    if (!user || !projectId) return;
    const unread = chatRef.current.filter(
      (m) =>
        m.projectId === projectId &&
        ((user.role === 'admin' && m.sender === 'cliente' && !m.readAdmin) ||
          (user.role === 'cliente' && m.sender === 'admin' && !m.readClient))
    );
    if (!unread.length) return;
    for (const m of unread) {
      try {
        await api('records.replace', {
          collection: 'jabe_chat_messages',
          id: m.id,
          value: {
            projectId: m.projectId,
            sender: m.sender,
            senderName: m.senderName,
            text: m.text,
            time: m.time,
            createdAt: m.createdAt,
            readAdmin: true,
            readClient: true,
          },
        });
      } catch {}
    }
    setChatMessages((prev) =>
      prev.map((m) =>
        unread.some((u) => u.id === m.id)
          ? { ...m, readAdmin: true, readClient: true }
          : m
      )
    );
  };
  useEffect(() => {
    if (!portalOpen || !user) return;
    if (user.role === 'cliente' && portalTab === 'chat' && visibleProject?.id)
      markChatRead(visibleProject.id);
    if (user.role === 'admin' && portalTab === 'chats' && adminChatProjectId)
      markChatRead(adminChatProjectId); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    portalOpen,
    portalTab,
    adminChatProjectId,
    visibleProject?.id,
    chatMessages.length,
  ]);
  useEffect(() => {
    if (!portalOpen || !user) return;
    const t = setInterval(async () => {
      try {
        const d = await api('records.list', {
          collection: 'jabe_chat_messages',
        });
        if (!d.records?.length) return;
        const mapped = d.records
          .map((r: any) => ({ id: r.id, ...r.value } as ChatMsg))
          .sort((a: any, b: any) => a.createdAt - b.createdAt);
        const known = new Set(chatRef.current.map((m) => m.id));
        const fresh = mapped.filter((m: ChatMsg) => !known.has(m.id));
        if (fresh.length) {
          if (user.role === 'admin') {
            const inc = fresh.find((m: ChatMsg) => m.sender === 'cliente');
            if (inc) {
              const proj = projects.find((p) => p.id === inc.projectId);
              setChatAlert(
                `🔔 Nuevo mensaje de ${inc.senderName || 'Cliente'} - ${
                  proj?.name || 'Proyecto'
                }`
              );
              setTimeout(() => setChatAlert(''), 6000);
            }
          }
          if (user.role === 'cliente') {
            const inc = fresh.find(
              (m: ChatMsg) =>
                m.sender === 'admin' && m.projectId === visibleProject?.id
            );
            if (inc) setChatAlert('🔔 Nuevo mensaje de JABE');
          }
        }
        setChatMessages(mapped);
      } catch {}
    }, 7000);
    return () => clearInterval(t);
  }, [portalOpen, user, visibleProject?.id, projects]);
  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || !user) return;
    const projectId =
      user.role === 'admin' ? adminChatProjectId : visibleProject?.id;
    if (!projectId) {
      setChatNotice('Elige un chat de cliente para responder.');
      return;
    }
    const now = new Date();
    const value = {
      projectId,
      sender: (user.role === 'admin' ? 'admin' : 'cliente') as
        | 'admin'
        | 'cliente',
      senderName:
        user.role === 'admin'
          ? 'JABE'
          : visibleProject?.client || user.username,
      text,
      time: now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      createdAt: Date.now(),
      readAdmin: user.role === 'admin',
      readClient: user.role !== 'admin',
    };
    setChatBusy(true);
    try {
      const rec = await api('records.create', {
        collection: 'jabe_chat_messages',
        value,
        idempotency_key: `chat-${projectId}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
      });
      setChatMessages((prev) =>
        [...prev, { id: rec.id, ...value }].sort(
          (a, b) => a.createdAt - b.createdAt
        )
      );
      setChatNotice('Mensaje enviado.');
    } catch {
      const id = `local-chat-${Date.now()}`;
      setChatMessages((prev) => [...prev, { id, ...value }]);
      setChatNotice('Mensaje enviado en esta vista previa.');
    }
    setChatInput('');
    setChatBusy(false);
    setChatTyping(true);
    setTimeout(() => setChatTyping(false), 1400);
  };

  const openLogin = (tab: 'cliente' | 'empleado' | 'admin') => {
    setLoginTab(tab);
    setLoginUser(
      tab === 'cliente' ? 'cliente' : tab === 'empleado' ? 'empleado' : 'admin'
    );
    setLoginPass('');
    setLoginError('');
    setShowLogin(true);
  };
  const doLogin = () => {
    setLoginError('');
    const u = loginUser.trim();
    const p = loginPass.trim();
    if (u === 'admin' && p === 'admin123') {
      setUser({ username: 'admin', role: 'admin' });
      setShowLogin(false);
      setPortalOpen(true);
      setPortalTab('admin');
      setSelectedProjectId(projects[0]?.id || 'demo-1');
    } else if (u === 'cliente' && p === 'cliente123') {
      setUser({ username: 'cliente', role: 'cliente' });
      setShowLogin(false);
      setPortalOpen(true);
      setPortalTab('fotos');
    } else if (u === 'empleado' && p === 'empleado123') {
      setUser({ username: 'empleado', role: 'empleado' });
      setShowLogin(false);
      setPortalOpen(true);
      setEmployeeProjectId(projects[0]?.id || 'demo-1');
      setEmployeeView('opciones');
      setPartForm({
        trabajos: '',
        materiales: '',
        horas: '',
        incidencias: '',
        trabajadores: '',
      });
    } else
      setLoginError(
        'Usuario o contraseña incorrectos. Revisa las cuentas demo que aparecen en la ventana.'
      );
  };
  const logout = () => {
    setUser(null);
    setPortalOpen(false);
    setShowLogin(false);
    setLoginUser('');
    setLoginPass('');
    setEmployeeView('opciones');
  };

  const flash = (m: string) => {
    setPortalMsg(m);
    setTimeout(() => setPortalMsg(''), 3200);
  };
  const downloadDoc = (doc: Doc) => {
    const text = `JABE — Documento\nProyecto: ${
      visibleProject?.name || ''
    }\nDocumento: ${doc.name}\nTipo: ${doc.kind} · Tamaño indicado: ${
      doc.sizeLabel
    } · Fecha: ${
      doc.date
    }\n\nEste archivo es una ficha del documento registrado en el portal. La subida de archivos no está disponible todavía: pide a JABE el archivo original por los canales habituales si lo necesitas.`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      (doc.name.replace(/\.[^.]+$/, '') || 'documento-jabe') + ' — ficha.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('Ficha del documento descargada al ordenador.');
  };
  async function saveRecord(collection: string, value: any) {
    try {
      const rec = await api('records.create', {
        collection,
        value,
        idempotency_key: `${collection}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
      });
      return rec.id as string;
    } catch {
      return `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    }
  }
  async function deleteRecord(collection: string, id: string) {
    if (id.startsWith('demo-') || id.startsWith('local-')) return;
    try {
      await api('records.delete', { collection, id });
    } catch {}
  }
  async function replaceRecord(collection: string, id: string, value: any) {
    if (id.startsWith('demo-') || id.startsWith('local-')) return;
    try {
      await api('records.replace', { collection, id, value });
    } catch {}
  }

  const createProject = async () => {
    if (
      !newProject.name.trim() ||
      !newProject.client.trim() ||
      !newProject.username.trim()
    ) {
      flash('Completa nombre del proyecto, cliente y usuario.');
      return;
    }
    setPortalBusy(true);
    const value = {
      name: newProject.name.trim(),
      client: newProject.client.trim(),
      username: newProject.username.trim(),
      created: today(),
    };
    const id = await saveRecord('jabe_portal_projects', value);
    const proj: Project = { id, ...value };
    setProjects((prev) => [...prev, proj]);
    setSelectedProjectId(id);
    setNewProject({ name: '', client: '', username: '' });
    setPortalBusy(false);
    flash('Proyecto creado y guardado.');
  };
  const createFolder = async () => {
    if (!visibleProject || !newFolderName.trim()) {
      flash('Escribe el nombre de la carpeta.');
      return;
    }
    setPortalBusy(true);
    const value = { projectId: visibleProject.id, name: newFolderName.trim() };
    const id = await saveRecord('jabe_portal_folders', value);
    setFolders((prev) => [...prev, { id, ...value }]);
    setNewFolderName('');
    setPortalBusy(false);
    flash('Carpeta creada.');
  };
  const renameFolderNow = async () => {
    if (!renameFolder.id || !renameFolder.name.trim()) return;
    const f = folders.find((x) => x.id === renameFolder.id);
    if (!f) return;
    await replaceRecord('jabe_portal_folders', f.id, {
      projectId: f.projectId,
      name: renameFolder.name.trim(),
    });
    setFolders((prev) =>
      prev.map((x) =>
        x.id === f.id ? { ...x, name: renameFolder.name.trim() } : x
      )
    );
    setRenameFolder({ id: '', name: '' });
    flash('Carpeta renombrada.');
  };
  const deleteFolderNow = async (id: string) => {
    const hasPhotos = photos.some((p) => p.folderId === id);
    if (hasPhotos) {
      flash(
        'Esta carpeta tiene fotos. Muévelas o elimínalas antes de borrar la carpeta.'
      );
      return;
    }
    await deleteRecord('jabe_portal_folders', id);
    setFolders((prev) => prev.filter((x) => x.id !== id));
    flash('Carpeta eliminada.');
  };
  const addPhoto = async () => {
    if (!visibleProject) return;
    const folderId =
      selectedFolderId &&
      folders.some(
        (f) => f.id === selectedFolderId && f.projectId === visibleProject.id
      )
        ? selectedFolderId
        : visibleFolders[0]?.id;
    if (!folderId) {
      flash('Primero crea una carpeta en este proyecto.');
      return;
    }
    setPortalBusy(true);
    const value = {
      projectId: visibleProject.id,
      folderId,
      imageKey: newPhoto.imageKey,
      caption: newPhoto.caption.trim() || 'Foto del proyecto',
    };
    const id = await saveRecord('jabe_portal_photos', value);
    setPhotos((prev) => [...prev, { id, ...value }]);
    setNewPhoto({ imageKey: 'vivienda', caption: '' });
    setPortalBusy(false);
    setCompressedNote('Foto comprimida para que la web vaya rápida.');
    flash(
      'Foto añadida a la carpeta. Foto comprimida para que la web vaya rápida.'
    );
  };
  const movePhotoNow = async () => {
    if (!movePhoto.photoId || !movePhoto.folderId) return;
    const ph = photos.find((p) => p.id === movePhoto.photoId);
    if (!ph) return;
    await replaceRecord('jabe_portal_photos', ph.id, {
      projectId: ph.projectId,
      folderId: movePhoto.folderId,
      imageKey: ph.imageKey,
      caption: ph.caption,
    });
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === ph.id ? { ...p, folderId: movePhoto.folderId } : p
      )
    );
    setMovePhoto({ photoId: '', folderId: '' });
    flash('Foto movida de carpeta.');
  };
  const deletePhotoNow = async (id: string) => {
    await deleteRecord('jabe_portal_photos', id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    flash('Foto eliminada.');
  };
  const addDoc = async (
    section: 'cliente' | 'jabe',
    name: string,
    kind: string,
    sizeLabel: string
  ) => {
    if (!visibleProject || !name.trim()) {
      flash('Escribe el nombre del documento.');
      return;
    }
    setPortalBusy(true);
    const value = {
      projectId: visibleProject.id,
      section,
      name: name.trim(),
      kind,
      sizeLabel: sizeLabel.trim() || '—',
      date: today(),
    };
    const id = await saveRecord('jabe_portal_docs', value);
    setDocs((prev) => [...prev, { id, ...value }]);
    setPortalBusy(false);
    flash('Documento registrado.');
  };
  const deleteDocNow = async (id: string) => {
    await deleteRecord('jabe_portal_docs', id);
    setDocs((prev) => prev.filter((d) => d.id !== id));
    flash('Documento eliminado.');
  };
  const saveEditDoc = async () => {
    const d = docs.find((x) => x.id === editDoc.id);
    if (!d) return;
    await replaceRecord('jabe_portal_docs', d.id, {
      projectId: d.projectId,
      section: d.section,
      name: editDoc.name.trim() || d.name,
      kind: editDoc.kind,
      sizeLabel: editDoc.sizeLabel || '—',
      date: d.date,
    });
    setDocs((prev) =>
      prev.map((x) =>
        x.id === d.id
          ? {
              ...x,
              name: editDoc.name.trim() || d.name,
              kind: editDoc.kind,
              sizeLabel: editDoc.sizeLabel || '—',
            }
          : x
      )
    );
    setEditDoc({ id: '', name: '', kind: 'PDF', sizeLabel: '' });
    flash('Documento sustituido / actualizado.');
  };

  // ---- Empleado: cola de fotos ----
  const addToQueue = () => {
    const item = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      imageKey: queueImageKey,
      caption: queueCaption.trim() || 'Foto de obra',
    };
    setEmployeeQueue((prev) => [...prev, item]);
    setQueueCaption('');
    setCompressedNote(
      'Foto comprimida para que la web vaya rápida. Se reduce el peso sin perder calidad visible antes de subirla.'
    );
    flash('Foto añadida a la cola. Puedes añadir más antes de subirlas todas.');
  };
  const removeFromQueue = (id: string) =>
    setEmployeeQueue((prev) => prev.filter((q) => q.id !== id));
  async function reloadPending() {
    const d = await api('records.list', {
      collection: 'jabe_portal_pending_photos',
    });
    if (d.records?.length)
      setPendingPhotos([
        ...demoPendingPhotos,
        ...d.records.map((r: any) => ({ id: r.id, ...r.value })),
      ]);
    else setPendingPhotos(demoPendingPhotos);
  }
  const uploadAllQueue = async () => {
    if (!employeeProject || !user || employeeQueue.length === 0) {
      flash('Añade al menos una foto a la cola.');
      return;
    }
    const rows = [...employeeQueue];
    const createRow = async (row: { imageKey: string; caption: string }) => {
      await api('records.create', {
        collection: 'jabe_portal_pending_photos',
        value: {
          projectId: employeeProject.id,
          imageKey: row.imageKey,
          caption: row.caption,
          employee: user.username,
          date: today(),
          status: 'pendiente',
        },
        idempotency_key: `pending-${employeeProject.id}-${
          row.caption
        }-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      });
    };
    const reloadRecords = async () => {
      await reloadPending();
    };
    setPortalBusy(true);
    let saved = 0;
    let error: string | null = null;
    try {
      for (const row of rows) {
        await createRow(row);
        saved += 1;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    let reloadError: string | null = null;
    try {
      await reloadRecords();
    } catch (e) {
      reloadError = e instanceof Error ? e.message : String(e);
    }
    setQueueResult({
      saved,
      remaining: rows.length - saved,
      error,
      reloadError,
    });
    // Solo se retiran de la cola las que se confirmaron
    setEmployeeQueue((prev) => prev.slice(saved));
    setPortalBusy(false);
    if (!error)
      flash(
        `Foto guardada en pendientes: ${saved} de ${rows.length} foto(s) quedan en “Fotos pendientes de revisión”.`
      );
    else
      flash(
        `Se guardaron ${saved} foto(s). Quedan ${
          rows.length - saved
        } por subir.`
      );
  };
  const deletePendingAsEmployee = async (id: string) => {
    const pp = pendingPhotos.find((p) => p.id === id);
    if (!pp) return;
    if (pp.status !== 'pendiente') {
      flash('Esta foto ya no está pendiente: no se puede eliminar.');
      return;
    }
    await deleteRecord('jabe_portal_pending_photos', id);
    setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
    flash('Foto pendiente eliminada.');
  };

  // ---- Empleado: parte diario ----
  const savePart = async (signed: boolean) => {
    if (!employeeProject || !user) return;
    if (!partForm.trabajos.trim()) {
      flash('Escribe los trabajos realizados en el día antes de guardar.');
      return;
    }
    setPortalBusy(true);
    const signedAt = signed ? new Date().toLocaleString('es-ES') : undefined;
    const value: Omit<DailyPart, 'id'> = {
      projectId: employeeProject.id,
      projectName: employeeProject.name,
      employee: user.username,
      date: today(),
      trabajos: partForm.trabajos.trim(),
      materiales: partForm.materiales.trim(),
      horas: partForm.horas.trim(),
      incidencias: partForm.incidencias.trim(),
      trabajadores: partForm.trabajadores.trim(),
      signed,
      signedBy: signed ? user.username : undefined,
      signedAt,
      status: signed ? 'enviado' : 'borrador',
    };
    const id = await saveRecord('jabe_portal_parts', value);
    setParts((prev) => [...prev, { id, ...value }]);
    setPartForm({
      trabajos: '',
      materiales: '',
      horas: '',
      incidencias: '',
      trabajadores: '',
    });
    setPortalBusy(false);
    flash(
      signed
        ? `Parte firmado y enviado a supervisión. Firmado por ${user.username} el ${signedAt}.`
        : 'Parte guardado como borrador / sin firmar.'
    );
    setEmployeeView('opciones');
  };
  const deletePartAsEmployee = async (id: string) => {
    const part = parts.find((p) => p.id === id);
    if (!part) return;
    if (part.signed) {
      flash('No puedes eliminar un parte ya firmado.');
      return;
    }
    await deleteRecord('jabe_portal_parts', id);
    setParts((prev) => prev.filter((p) => p.id !== id));
    flash('Borrador eliminado.');
  };

  // ---- Admin: supervisión ----
  const filteredPending = useMemo(() => {
    return pendingPhotos.filter(
      (p) =>
        (supProject === 'todas' || p.projectId === supProject) &&
        (supEmployee === 'todos' || p.employee === supEmployee) &&
        (!supDate || p.date.includes(supDate)) &&
        (supStatus === 'todos' || p.status === supStatus)
    );
  }, [pendingPhotos, supProject, supEmployee, supDate, supStatus]);
  const filteredParts = useMemo(() => {
    return parts.filter(
      (p) =>
        (supProject === 'todas' || p.projectId === supProject) &&
        (supEmployee === 'todos' || p.employee === supEmployee) &&
        (!supDate || p.date.includes(supDate)) &&
        (supSigned === 'todos' ||
          (supSigned === 'firmados' && p.signed) ||
          (supSigned === 'sin-firmar' && !p.signed))
    );
  }, [parts, supProject, supEmployee, supDate, supSigned]);
  const togglePending = (id: string) =>
    setSelectedPendingIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const migrateSelected = async () => {
    const chosen = filteredPending.filter((p) =>
      selectedPendingIds.includes(p.id)
    );
    if (chosen.length === 0) {
      setMigrateResult('Marca al menos una foto para migrar.');
      return;
    }
    if (!migrateFolderId) {
      setMigrateResult('Elige la carpeta destino del cliente antes de migrar.');
      return;
    }
    const dest = folders.find((f) => f.id === migrateFolderId);
    if (!dest) {
      setMigrateResult('Elige una carpeta destino válida.');
      return;
    }
    setPortalBusy(true);
    let saved = 0;
    let error: string | null = null;
    try {
      for (const pp of chosen) {
        await api('records.create', {
          collection: 'jabe_portal_photos',
          value: {
            projectId: pp.projectId,
            folderId: migrateFolderId,
            imageKey: pp.imageKey,
            caption: pp.caption,
          },
          idempotency_key: `migrate-${pp.id}-${migrateFolderId}`,
        });
        await deleteRecord('jabe_portal_pending_photos', pp.id);
        saved += 1;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
    // Recargar fotos de cliente y pendientes
    try {
      const [ph, pp2] = await Promise.all([
        api('records.list', { collection: 'jabe_portal_photos' }),
        api('records.list', { collection: 'jabe_portal_pending_photos' }),
      ]);
      if (ph.records?.length)
        setPhotos([
          ...demoPhotos,
          ...ph.records.map((r: any) => ({ id: r.id, ...r.value })),
        ]);
      if (pp2.records?.length)
        setPendingPhotos([
          ...demoPendingPhotos,
          ...pp2.records.map((r: any) => ({ id: r.id, ...r.value })),
        ]);
      else setPendingPhotos(demoPendingPhotos);
    } catch {}
    // Quitar de pendientes las migradas confirmadas (también las demo)
    setPendingPhotos((prev) =>
      prev.filter((p) => !chosen.slice(0, saved).some((c) => c.id === p.id))
    );
    setSelectedPendingIds([]);
    setPortalBusy(false);
    setMigrateResult(
      error
        ? `Se migraron ${saved} de ${chosen.length}. ${error}`
        : `${saved} foto(s) migradas a “${dest.name}” y ya visibles en el portal de cliente.`
    );
  };
  const setPendingStatus = async (
    id: string,
    status: 'aprobada' | 'rechazada'
  ) => {
    const pp = pendingPhotos.find((p) => p.id === id);
    if (!pp) return;
    await replaceRecord('jabe_portal_pending_photos', id, { ...pp, status });
    setPendingPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    flash(status === 'aprobada' ? 'Foto aprobada.' : 'Foto rechazada.');
  };
  const deletePendingAsAdmin = async (id: string) => {
    await deleteRecord('jabe_portal_pending_photos', id);
    setPendingPhotos((prev) => prev.filter((p) => p.id !== id));
    setSelectedPendingIds((prev) => prev.filter((x) => x !== id));
    flash('Foto pendiente eliminada.');
  };
  const setPartStatus = async (
    id: string,
    status: 'aprobado' | 'rechazado'
  ) => {
    const part = parts.find((p) => p.id === id);
    if (!part) return;
    await replaceRecord('jabe_portal_parts', id, { ...part, status });
    setParts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    flash(status === 'aprobado' ? 'Parte aprobado.' : 'Parte rechazado.');
  };
  const deletePartAsAdmin = async (id: string) => {
    await deleteRecord('jabe_portal_parts', id);
    setParts((prev) => prev.filter((p) => p.id !== id));
    flash('Parte eliminado.');
  };
  const downloadPart = (part: DailyPart) => {
    const text = `JABE — Parte de trabajo diario\nFecha: ${part.date}\nObra: ${
      part.projectName
    }\nEmpleado: ${part.employee}\nFirmado: ${
      part.signed
        ? `Sí — Firmado por ${part.signedBy || part.employee} el ${
            part.signedAt || ''
          }`
        : 'No'
    }\nEstado: ${part.status}\nTrabajos realizados: ${
      part.trabajos
    }\nMateriales utilizados: ${part.materiales}\nHoras: ${
      part.horas
    }\nNº de trabajadores: ${part.trabajadores}\nIncidencias / Observaciones: ${
      part.incidencias
    }\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parte-${part.date.replaceAll('/', '-')}-${part.employee}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('Ficha descargada.');
  };
  const downloadAllParts = () => {
    const header =
      'Fecha;Obra;Empleado;Firmado;Firmado por;Fecha y hora de firma;Estado;Trabajos realizados;Materiales;Horas;Nº trabajadores;Incidencias\n';
    const rows = filteredParts
      .map((p) =>
        [
          p.date,
          p.projectName,
          p.employee,
          p.signed ? 'Sí' : 'No',
          p.signedBy || '',
          p.signedAt || '',
          p.status,
          p.trabajos,
          p.materiales,
          p.horas,
          p.trabajadores,
          p.incidencias,
        ]
          .map(csvCell)
          .join(';')
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jabe-partes-diarios.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash(
      `Descargadas ${filteredParts.length} ficha(s) con el filtro aplicado.`
    );
  };
  const supFolders = useMemo(
    () =>
      supProject === 'todas'
        ? []
        : folders.filter((f) => f.projectId === supProject),
    [folders, supProject]
  );
  const employeeNames = useMemo(
    () =>
      Array.from(
        new Set(
          parts
            .map((p) => p.employee)
            .concat(pendingPhotos.map((p) => p.employee))
        )
      ),
    [parts, pendingPhotos]
  );

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen bg-[var(--paper)] text-[var(--ink)]"
      style={{
        boxSizing: 'border-box',
        paddingTop: 'var(--safe-area-inset-top)',
      }}
    >
      <header
        data-safe-area-sticky-top
        className="sticky z-40 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-left"
            aria-label="JABE — ir al inicio"
          >
            <img
              src={logoImg}
              alt="Logotipo oficial JABE — Construcciones e Interiorismo"
              className="h-11 w-[132px] rounded-none object-cover object-center"
            />
          </button>
          <nav className="hidden items-center gap-5 text-sm font-bold lg:flex">
            <button onClick={() => scrollTo('calculadora')}>Calculadora</button>
            <button onClick={() => scrollTo('otras-lineas')}>
              Otras líneas
            </button>
            <button onClick={() => scrollTo('comparativa')}>Comparativa</button>
            <button onClick={() => scrollTo('reformas')}>Reformas</button>
            <button onClick={() => scrollTo('como')}>Cómo construimos</button>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-[var(--soft)] px-3 py-2 text-xs font-extrabold text-[var(--green)] md:block">
              ENERGÍA A+
            </span>
            {user ? (
              <>
                <button
                  onClick={() => setPortalOpen(true)}
                  className="rounded-full border-2 border-[var(--green)] px-4 py-2.5 text-sm font-extrabold text-[var(--green)]"
                >
                  Portal · {user.username}
                </button>
                <button
                  onClick={logout}
                  className="rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-extrabold text-white"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openLogin('cliente')}
                  className="rounded-full bg-[var(--green)] px-4 py-2.5 text-sm font-extrabold text-white"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => openLogin('empleado')}
                  className="rounded-full border-2 border-[var(--copper)] px-4 py-2.5 text-sm font-extrabold text-[var(--copper)]"
                >
                  Acceso empleados
                </button>
              </>
            )}
            <button
              onClick={() => scrollTo('calculadora')}
              className="hidden rounded-full bg-[var(--copper)] px-4 py-2.5 text-sm font-extrabold text-white sm:block"
            >
              Pedir presupuesto <ArrowRight className="inline h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 text-xs font-bold lg:hidden">
          <button onClick={() => scrollTo('calculadora')}>Calculadora</button>
          <button onClick={() => scrollTo('otras-lineas')}>Otras líneas</button>
          <button onClick={() => scrollTo('comparativa')}>Comparativa</button>
          <button onClick={() => scrollTo('reformas')}>Reformas</button>
          <button onClick={() => scrollTo('como')}>Cómo construimos</button>
          <button onClick={() => openLogin('cliente')}>Iniciar sesión</button>
          <button onClick={() => openLogin('empleado')}>
            Acceso empleados
          </button>
        </div>
      </header>
      <main className="overflow-x-clip">
        <section className="relative overflow-hidden bg-[#122017] text-white">
          <video
            className="hero-video absolute inset-0 h-full w-full opacity-45"
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
          <div className="relative mx-auto grid max-w-[1280px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.25fr_.75fr] lg:py-24">
            <div>
              <img
                src={logoImg}
                alt="Logotipo oficial JABE — Casa de entramado ligero, sello A+ Eficiencia Energética"
                className="h-28 w-auto max-w-full rounded-none object-cover sm:h-36"
              />
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  GIJÓN · ASTURIAS
                </span>
                <span className="rounded-full bg-[var(--green)] px-3 py-1 text-xs font-bold">
                  ENERGÍA A+
                </span>
                <span className="rounded-full bg-[#8B5E34] px-3 py-1 text-xs font-bold">
                  ENTRAMADO LIGERO DE MADERA
                </span>
              </div>
              <h1 className="mt-5 max-w-[850px] font-display text-[clamp(2.4rem,6vw,5.2rem)] font-semibold leading-[.95] [overflow-wrap:anywhere]">
                {cfg.heroTitle}
              </h1>
              <p className="mt-5 max-w-[650px] text-base leading-7 text-white/85 sm:text-lg">
                {cfg.heroSub}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollTo('calculadora')}
                  className="rounded-full bg-[var(--green)] px-6 py-3.5 font-extrabold"
                >
                  Calcular mi proyecto
                </button>
                <button
                  onClick={() => scrollTo('comparativa')}
                  className="rounded-full border border-white/40 px-6 py-3.5 font-extrabold"
                >
                  Ver la comparativa
                </button>
                <button
                  onClick={() => openLogin('cliente')}
                  className="rounded-full bg-white px-6 py-3.5 font-extrabold text-black"
                >
                  Portal del cliente · Iniciar sesión
                </button>
              </div>
              <div className="mt-10 grid max-w-[700px] grid-cols-3 divide-x divide-white/15 text-sm">
                <div className="pr-4">
                  <b className="block text-2xl">{cfg.housingTime}</b>
                  <span className="text-white/70">Vivienda nueva</span>
                </div>
                <div className="px-4">
                  <b className="block text-2xl">5–7×</b>
                  <span className="text-white/70">Más ligera</span>
                </div>
                <div className="pl-4">
                  <b className="block text-2xl">A+</b>
                  <span className="text-white/70">Eficiencia</span>
                </div>
              </div>
            </div>
            <aside className="self-end rounded-[22px] border border-white/20 bg-black/35 p-5 backdrop-blur">
              <p className="label !text-white/70">Una decisión con datos</p>
              <p className="mt-3 font-display text-2xl leading-snug">
                Calcula, compara y decide con el presupuesto orientativo en
                pantalla.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/75">
                Tradicional según calidad: {fmt(cfg.tradLow)} –{' '}
                {fmt(cfg.tradHigh)} €/m². JABE: tradicional − ahorro estimado
                construcción entramado ligero del {cfg.compareMin}%–
                {cfg.compareMax}%.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span className="[overflow-wrap:anywhere]">
                  Tel: {show(cfg.phone, '[Teléfono]')}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span className="[overflow-wrap:anywhere]">
                  Tel. secundario / WhatsApp: {show(cfg.phone2, '—')}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span className="[overflow-wrap:anywhere]">
                  Email: {show(cfg.email, '[Email]')}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span className="[overflow-wrap:anywhere]">
                  Presupuestos:{' '}
                  {show(cfg.budgetEmail, '[Email para presupuestos]')}
                </span>
              </div>
              <div className="mt-2 flex items-start gap-2 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="[overflow-wrap:anywhere]">
                  Dirección: {showAddress()}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Clock3 className="h-4 w-4" />
                <span className="[overflow-wrap:anywhere]">
                  Horario: {show(cfg.hours, '—')}
                </span>
              </div>
            </aside>
          </div>
        </section>

        <section
          id="calculadora"
          className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20"
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">01 · Calculadora · Obra nueva</p>
              <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">
                {cfg.calcTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-[var(--muted)]">
                Elige la superficie y la calidad. El precio tradicional cambia
                según la calidad, y sobre él se aplica el ahorro estimado
                construcción entramado ligero.
              </p>
            </div>
            <span className="chip">
              TRADICIONAL SEGÚN CALIDAD · {fmt(cfg.tradLow)} –{' '}
              {fmt(cfg.tradHigh)} €/m²
            </span>
          </div>
          <div className="rounded-[22px] border border-[var(--line)] bg-[var(--soft)] p-5 sm:p-6">
            <p className="text-sm font-extrabold text-[var(--green)]">
              Fórmula obra nueva
            </p>
            <p className="mt-2 font-display text-xl leading-snug sm:text-2xl">
              Precio tradicional según calidad − ahorro estimado construcción
              entramado ligero ({cfg.compareMin}%–{cfg.compareMax}%) = Precio
              JABE
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Comprobación con 8,5%: 100 m² Media → tradicional{' '}
              {fmt(cfg.tradMid * 100)} − ahorro estimado construcción entramado
              ligero {fmt(cfg.tradMid * 100 * 0.085)} = JABE{' '}
              {fmt(cfg.tradMid * 100 * 0.915)}. · 120 m² Alta → tradicional{' '}
              {fmt(cfg.tradHigh * 120)} − ahorro estimado construcción entramado
              ligero {fmt(cfg.tradHigh * 120 * 0.085)} = JABE{' '}
              {fmt(cfg.tradHigh * 120 * 0.915)}.
            </p>
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <div className="card p-5 sm:p-7">
              <div>
                <p className="label">Calidad · precio tradicional</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(
                    [
                      ['Baja', cfg.tradLow],
                      ['Media', cfg.tradMid],
                      ['Alta', cfg.tradHigh],
                    ] as const
                  ).map(([q, p]) => (
                    <button
                      key={q}
                      onClick={() => setQualityNew(q)}
                      className={`rounded-xl border p-3 text-left font-bold ${
                        qualityNew === q
                          ? 'bg-[var(--ink)] text-[var(--paper)]'
                          : 'border-[var(--line)]'
                      }`}
                    >
                      <span className="block">{q}</span>
                      <span className="mt-1 block text-sm font-extrabold text-[var(--green)]">
                        {fmt(p)} €/m²
                      </span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Calidad {qualityNew}: precio tradicional {fmt(tradPrice)}{' '}
                  €/m².
                </p>
              </div>
              <div className="mt-8">
                <div className="flex justify-between">
                  <label className="label">Superficie</label>
                  <b>{m2} m²</b>
                </div>
                <input
                  aria-label="Superficie en metros cuadrados"
                  type="range"
                  min="10"
                  max="200"
                  value={m2}
                  onChange={(e) => setM2(+e.target.value)}
                  className="mt-3 w-full"
                />
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>10 m²</span>
                  <span>200 m²</span>
                </div>
              </div>
              <div className="mt-7">
                <div className="flex justify-between">
                  <label className="label">
                    Ahorro estimado construcción entramado ligero
                  </label>
                  <b>{eff.toFixed(1)}%</b>
                </div>
                <input
                  aria-label="Descuento JABE"
                  type="range"
                  min={cfg.compareMin}
                  max={cfg.compareMax}
                  step="0.1"
                  value={eff}
                  onChange={(e) => setEff(+e.target.value)}
                  className="mt-3 w-full"
                />
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Banda del ahorro estimado construcción entramado ligero,
                  editable en el Panel Admin: {cfg.compareMin}% –{' '}
                  {cfg.compareMax}%.
                </p>
              </div>
            </div>
            <aside className="overflow-hidden rounded-[22px] bg-[#122017] p-6 text-white sm:p-7">
              <p className="text-xs font-extrabold tracking-[.16em] text-emerald-300">
                RESULTADO EN VIVO · OBRA NUEVA
              </p>
              <p className="mt-4 text-sm text-white/70">
                Vivienda nueva · entramado ligero · {m2} m² · Calidad{' '}
                {qualityNew}
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-white/70">
                    Tradicional · {fmt(tradPrice)} €/m² × {m2} m²
                  </span>
                  <b>{fmt(calcNew.traditional)}</b>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-white/70">
                    Ahorro estimado construcción entramado ligero ·{' '}
                    {eff.toFixed(1)}%
                  </span>
                  <b className="text-emerald-300">− {fmt(calcNew.saving)}</b>
                </div>
              </div>
              <p className="mt-3 text-sm text-white/70">Precio JABE</p>
              <p className="mt-1 font-display text-[clamp(2.3rem,5vw,3.8rem)] leading-none">
                {fmt(calcNew.jabe)}
              </p>
              <p className="mt-4 rounded-xl bg-white/10 p-4 text-sm leading-6">
                <b>Ahorro estimado construcción entramado ligero:</b>{' '}
                {fmt(calcNew.saving)}
                <br />
                <b>Plan de pagos orientativo:</b> {calcNew.plan}%<br />
                <b>Cuota orientativa:</b> {fmt(calcNew.monthly)} / mes
              </p>
              <p className="mt-4 border-l-4 border-amber-400 bg-amber-400/10 p-4 text-sm leading-6">
                Precios orientativos. Se presupuestará por separado tras visita
                / proyecto.
              </p>
              <p className="mt-2 text-sm text-white/75">
                Presupuestos a:{' '}
                <span className="[overflow-wrap:anywhere]">
                  {show(cfg.budgetEmail, '[Email para presupuestos]')}
                </span>
              </p>
              <button
                onClick={() =>
                  copyText(
                    `JABE · Obra nueva · ${m2} m² · Calidad ${qualityNew}\nTradicional ${fmt(
                      tradPrice
                    )} €/m² × ${m2} m² = ${fmt(
                      calcNew.traditional
                    )}\nAhorro estimado construcción entramado ligero ${eff.toFixed(
                      1
                    )}% = ${fmt(calcNew.saving)}\nPrecio JABE: ${fmt(
                      calcNew.jabe
                    )}\nPrecios orientativos. Se presupuestará por separado tras visita / proyecto.`,
                    'Resumen copiado'
                  )
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 font-extrabold text-black"
              >
                <Copy className="h-4 w-4" /> Copiar resumen
              </button>
              {copied && (
                <p className="mt-3 text-center text-sm text-emerald-300">
                  {copied}
                </p>
              )}
            </aside>
          </div>
        </section>

        <section
          id="otras-lineas"
          className="border-y border-[var(--line)] bg-[var(--surface)]"
        >
          <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker">02 · Calculadora · Otras líneas</p>
                <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">
                  Reformas y otras líneas
                </h2>
                <p className="mt-3 max-w-2xl text-[var(--muted)]">
                  Precio orientativo desde {cfg.basePrice} €/m², ajustado por
                  calidad. Sin comparativa y sin ahorro estimado construcción
                  entramado ligero aplicado.
                </p>
              </div>
              <span className="chip">DESDE {cfg.basePrice} €/m²</span>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
              <div className="card p-5 sm:p-7">
                <p className="label">Elige la línea</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {otherLines.map((l) => (
                    <button
                      key={l.v}
                      onClick={() => setType2(l.v)}
                      className={`rounded-2xl border p-4 text-left font-bold ${
                        type2 === l.v
                          ? 'border-[var(--green)] bg-[var(--soft)] text-[var(--green)]'
                          : 'border-[var(--line)]'
                      }`}
                    >
                      <Home className="mb-2 h-5 w-5" />
                      {l.label}
                    </button>
                  ))}
                </div>
                <div className="mt-8">
                  <div className="flex justify-between">
                    <label className="label">Superficie</label>
                    <b>{m2_2} m²</b>
                  </div>
                  <input
                    aria-label="Superficie otras líneas en metros cuadrados"
                    type="range"
                    min="10"
                    max="200"
                    value={m2_2}
                    onChange={(e) => setM2_2(+e.target.value)}
                    className="mt-3 w-full"
                  />
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>10 m²</span>
                    <span>200 m²</span>
                  </div>
                </div>
                <div className="mt-7">
                  <p className="label">Calidad</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(['Estándar', 'Media', 'Premium'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality2(q)}
                        className={`rounded-xl border py-3 font-bold ${
                          quality2 === q
                            ? 'bg-[var(--ink)] text-[var(--paper)]'
                            : 'border-[var(--line)]'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    La calidad ajusta el precio orientativo desde{' '}
                    {cfg.basePrice} €/m².
                  </p>
                </div>
              </div>
              <aside className="overflow-hidden rounded-[22px] bg-[#122017] p-6 text-white sm:p-7">
                <p className="text-xs font-extrabold tracking-[.16em] text-emerald-300">
                  RESULTADO EN VIVO · OTRAS LÍNEAS
                </p>
                <p className="mt-4 text-sm text-white/70">
                  {selectedOther.label} · {m2_2} m² · {quality2}
                </p>
                <p className="mt-3 text-sm text-white/70">Precio orientativo</p>
                <p className="mt-1 font-display text-[clamp(2.3rem,5vw,3.8rem)] leading-none">
                  {fmt(calc2.lo)}{' '}
                  <span className="text-2xl text-white/50">—</span>{' '}
                  {fmt(calc2.hi)}
                </p>
                <p className="mt-4 rounded-xl bg-white/10 p-4 text-sm leading-6">
                  <b>{selectedOther.plazo}</b>
                  <br />
                  <b>Forma de pago orientativa:</b> {calc2.plan}%<br />
                  <b>Cuota orientativa:</b> {fmt(calc2.monthly)} / mes
                </p>
                <p className="mt-4 border-l-4 border-amber-400 bg-amber-400/10 p-4 text-sm leading-6">
                  Precios orientativos. Se presupuestará por separado.
                </p>
                <button
                  onClick={() =>
                    copyText(
                      `JABE · ${
                        selectedOther.label
                      } · ${m2_2} m² · ${quality2}\nPrecio orientativo: ${fmt(
                        calc2.lo
                      )} – ${fmt(calc2.hi)}\n${
                        selectedOther.plazo
                      }\nForma de pago: ${
                        calc2.plan
                      }%\nPrecios orientativos. Se presupuestará por separado.`,
                      'Resumen copiado'
                    )
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 font-extrabold text-black"
                >
                  <Copy className="h-4 w-4" /> Copiar resumen
                </button>
                {copied && (
                  <p className="mt-3 text-center text-sm text-emerald-300">
                    {copied}
                  </p>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section
          id="comparativa"
          className="border-b border-[var(--line)] bg-[var(--surface)]"
        >
          <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
            <p className="kicker">03 · Comparativa · Obra nueva</p>
            <h2 className="mt-2 max-w-4xl font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">
              {cfg.compareTitle}
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">
              La comparativa es solo para obra nueva. El precio tradicional
              depende de la calidad: Baja {fmt(cfg.tradLow)} €/m² · Media{' '}
              {fmt(cfg.tradMid)} €/m² · Alta {fmt(cfg.tradHigh)} €/m². JABE se
              calcula como tradicional menos el % de ahorro estimado
              construcción entramado ligero ({cfg.compareMin}%–{cfg.compareMax}
              %, editable en el Panel Admin). Mueve el control y observa cómo
              cambia el ejemplo de 120 m² con calidad {qualityNew}.
            </p>
            <div className="mt-6 rounded-[22px] border border-[var(--line)] bg-[var(--soft)] p-5">
              <p className="font-display text-xl leading-snug">
                Precio tradicional según calidad − ahorro estimado construcción
                entramado ligero ({cfg.compareMin}%–{cfg.compareMax}%) = Precio
                JABE
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Con 8,5%: 100 m² Media → {fmt(cfg.tradMid * 100)} −{' '}
                {fmt(cfg.tradMid * 100 * 0.085)} ={' '}
                {fmt(cfg.tradMid * 100 * 0.915)}. · 120 m² Alta →{' '}
                {fmt(cfg.tradHigh * 120)} − {fmt(cfg.tradHigh * 120 * 0.085)} ={' '}
                {fmt(cfg.tradHigh * 120 * 0.915)}.
              </p>
            </div>
            <div className="mt-8 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
              <div className="card p-6">
                <p className="label">
                  Ajusta el ahorro estimado construcción entramado ligero
                </p>
                <p className="mt-3 font-display text-6xl">
                  {eff.toFixed(1)}
                  <span className="text-3xl">%</span>
                </p>
                <input
                  aria-label="Porcentaje comparativa"
                  type="range"
                  min={cfg.compareMin}
                  max={cfg.compareMax}
                  step="0.1"
                  value={eff}
                  onChange={(e) => setEff(+e.target.value)}
                  className="mt-5 w-full"
                />
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-[var(--paper)] p-4">
                    <span className="text-xs text-[var(--muted)]">
                      Tradicional · 120 m² · Calidad {qualityNew} ·{' '}
                      {fmt(tradPrice)} €/m²
                    </span>
                    <b className="block text-xl">{fmt(traditional120)}</b>
                  </div>
                  <div className="rounded-2xl bg-[var(--soft)] p-4">
                    <span className="text-xs text-[var(--muted)]">
                      JABE · 120 m² · Calidad {qualityNew}
                    </span>
                    <b className="block text-xl text-[var(--green)]">
                      {fmt(jabe120)}
                    </b>
                  </div>
                </div>
                <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-[var(--green)]">
                  Ahorro orientativo: {fmt(saving120)}
                </p>
                <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                  Precios orientativos. Se presupuestará por separado tras
                  visita / proyecto.
                </p>
              </div>
              <div className="overflow-hidden rounded-[22px] border border-[var(--line)]">
                <div className="grid grid-cols-[1.1fr_.9fr_.9fr] bg-[var(--ink)] px-5 py-4 text-sm font-extrabold text-[var(--paper)]">
                  <span>Concepto</span>
                  <span>Tradicional</span>
                  <span className="text-emerald-300">JABE</span>
                </div>
                {[
                  [
                    'Precio base',
                    `${fmt(tradPrice)} €/m² · Calidad ${qualityNew}`,
                    'Tradicional − descuento JABE',
                  ],
                  ['Tiempo de obra', cfg.traditionalTime, cfg.housingTime],
                  ['Peso estructural', 'Referencia 100%', '5–7× más ligero'],
                  ['Energía', 'Variable', 'Clase A+'],
                  ['Emisiones CO₂', 'Más altas', 'Madera que almacena CO₂'],
                  [
                    'Humedad y control',
                    'Más expuesto',
                    'Sistema y membrana controlada',
                  ],
                ].map((r, i) => (
                  <div
                    key={r[0]}
                    className={`grid grid-cols-[1.1fr_.9fr_.9fr] px-5 py-4 text-sm ${
                      i % 2 ? 'bg-[var(--paper)]' : ''
                    }`}
                  >
                    <b>{r[0]}</b>
                    <span>{r[1]}</span>
                    <b className="text-[var(--green)]">{r[2]}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="reformas"
          className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20"
        >
          <p className="kicker">04 · Reformas</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">
              {cfg.reformTitle}
            </h2>
            <p className="max-w-sm text-sm text-[var(--muted)]">
              Arrastra el control central para comparar el antes y el después.
              Las imágenes muestran el estado transformado.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Compare
              img={viviendaImg}
              title="Vivienda completa"
              deadline={cfg.housingDeadline}
              includes={cfg.housingIncludes}
              price={cfg.basePrice}
            />
            <Compare
              img={aseoImg}
              title="Aseo"
              deadline={cfg.bathroomDeadline}
              includes={cfg.bathroomIncludes}
              price={cfg.basePrice}
            />
            <Compare
              img={cocinaImg}
              title="Cocina"
              deadline={cfg.kitchenDeadline}
              includes={cfg.kitchenIncludes}
              price={cfg.basePrice}
            />
          </div>
        </section>

        <section
          id="como"
          className="border-y border-[var(--line)] bg-[var(--surface)]"
        >
          <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="kicker">05 · Sistema constructivo</p>
              <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">
                {cfg.buildTitle}
              </h2>
              <div className="mt-6 overflow-hidden rounded-[22px] border border-[var(--line)]">
                <img
                  src={esquemaImg}
                  alt="Esquema de la casa de entramado ligero de madera"
                  className="h-auto w-full object-cover"
                />
              </div>
              <p className="mt-3 text-xs text-[var(--muted)]">
                Esquema constructivo: cada capa tiene una función. Toca un paso
                para ver su explicación.
              </p>
            </div>
            <div className="space-y-3">
              {steps.map((s, i) => (
                <button
                  key={s.n}
                  onClick={() => setActiveStep(i)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    activeStep === i
                      ? 'border-[var(--green)] bg-[var(--soft)] shadow-lg'
                      : 'border-[var(--line)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-lg ${
                        activeStep === i
                          ? 'bg-[var(--green)] text-white'
                          : 'bg-[var(--paper)]'
                      }`}
                    >
                      {s.n}
                    </span>
                    <span>
                      <b className="block text-lg">{s.t}</b>
                      {activeStep === i && (
                        <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">
                          {s.d}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="ml-auto h-5 w-5 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-20">
          <div className="overflow-hidden rounded-[28px] bg-[#122017] p-6 text-white sm:p-10">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="kicker !text-emerald-300">
                  06 · Portal del cliente
                </p>
                <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">
                  Tu proyecto, siempre a mano.
                </h2>
                <p className="mt-4 leading-7 text-white/80">
                  Fotografías por carpetas, tu documentación y la documentación
                  de JABE, en un mismo lugar. Entra con tu usuario y contraseña.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openLogin('cliente')}
                  className="rounded-full bg-white px-6 py-3.5 font-extrabold text-black"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => openLogin('empleado')}
                  className="rounded-full border border-white/50 px-6 py-3.5 font-extrabold text-white"
                >
                  Acceso empleados
                </button>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/10 p-5">
                <b>Fotografías</b>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Por carpetas: Cimentación, Estructura, Cubierta, Interiores,
                  Aseos y Cocina.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                <b>Tu documentación</b>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Registra lo que debes adjuntar. Solo JABE puede eliminar o
                  cambiar.
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                <b>Documentación JABE</b>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Presupuestos, planos, licencias y garantías para descargar.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-[#122017] text-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <img
                src={logoImg}
                alt="Logotipo oficial JABE — Construcciones e Interiorismo"
                className="h-20 w-auto max-w-full rounded-none object-cover"
              />
              <p className="mt-5 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Gijón, Asturias
              </p>
            </div>
            <div className="max-w-md">
              <p className="font-bold">Contacto</p>
              <p className="mt-3 [overflow-wrap:anywhere]">
                Tel: {show(cfg.phone, '[Teléfono]')}
              </p>
              <p className="[overflow-wrap:anywhere]">
                Tel. secundario / WhatsApp: {show(cfg.phone2, '—')}
              </p>
              <p className="[overflow-wrap:anywhere]">
                Email: {show(cfg.email, '[Email]')}
              </p>
              <p className="[overflow-wrap:anywhere]">
                Presupuestos:{' '}
                {show(cfg.budgetEmail, '[Email para presupuestos]')}
              </p>
              <p className="mt-3 [overflow-wrap:anywhere]">
                Dirección: {showAddress()}
              </p>
              <p className="[overflow-wrap:anywhere]">
                Horario: {show(cfg.hours, '—')}
              </p>
              <p className="mt-4 text-sm leading-6 text-white/70">
                {cfg.guarantee}
              </p>
            </div>
          </div>
          <p className="mt-10 border-t border-white/15 pt-5 text-xs leading-6 text-white/60">
            {cfg.legal} · JABE Construcciones e Interiorismo.
          </p>
        </div>
      </footer>
      {/* LOGIN con pestañas */}
      {showLogin && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/60 pt-[max(1rem,var(--safe-area-inset-top))] pb-6">
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="w-full max-w-[460px] rounded-[24px] bg-[var(--paper)] p-6 shadow-2xl sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="kicker">Acceso JABE</p>
                  <h2 className="mt-2 font-display text-3xl">Iniciar sesión</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    Elige tu acceso. Cada perfil ve solo lo que le corresponde.
                  </p>
                </div>
                <button
                  aria-label="Cerrar inicio de sesión"
                  onClick={() => setShowLogin(false)}
                  className="rounded-full border p-2"
                >
                  <X />
                </button>
              </div>
              <div
                className="mt-5 grid grid-cols-3 gap-2 rounded-full bg-[var(--surface)] p-1"
                role="tablist"
                aria-label="Tipo de acceso"
              >
                {(
                  [
                    ['cliente', 'Cliente'],
                    ['empleado', 'Empleado'],
                    ['admin', 'Administrador'],
                  ] as const
                ).map(([v, l]) => (
                  <button
                    key={v}
                    role="tab"
                    aria-selected={loginTab === v}
                    onClick={() => {
                      setLoginTab(v);
                      setLoginUser(
                        v === 'cliente'
                          ? 'cliente'
                          : v === 'empleado'
                          ? 'empleado'
                          : 'admin'
                      );
                      setLoginPass('');
                      setLoginError('');
                    }}
                    className={`rounded-full px-2 py-2.5 text-sm font-extrabold ${
                      loginTab === v
                        ? 'bg-[var(--green)] text-white'
                        : 'text-[var(--muted)]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-center text-xs text-[var(--muted)]">
                {loginTab === 'cliente'
                  ? 'Verás solo tu proyecto y su documentación.'
                  : loginTab === 'empleado'
                  ? 'Verás tus obras asignadas, fotos y partes diarios.'
                  : 'Supervisión, migración de fotos y partes diarios.'}
              </p>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="label" htmlFor="login-user">
                    Usuario
                  </label>
                  <div className="relative mt-1">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      id="login-user"
                      className="field pl-9"
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      autoComplete="username"
                      placeholder="admin, cliente o empleado"
                    />
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="login-pass">
                    Contraseña
                  </label>
                  <div className="relative mt-1">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                    <input
                      id="login-pass"
                      type="password"
                      className="field pl-9"
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') doLogin();
                      }}
                      autoComplete="current-password"
                      placeholder="Tu contraseña"
                    />
                  </div>
                </div>
                {loginError && (
                  <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
                    {loginError}
                  </p>
                )}
                <button
                  onClick={doLogin}
                  className="w-full rounded-full bg-[var(--green)] py-3.5 font-extrabold text-white"
                >
                  Entrar
                </button>
                <button
                  onClick={() => setShowForgot((v) => !v)}
                  className="w-full text-center text-sm font-bold text-[var(--green)] underline"
                >
                  ¿Has olvidado tu contraseña?
                </button>
                {showForgot && (
                  <div className="rounded-xl bg-[var(--soft)] p-4 text-sm leading-6">
                    <b>Recuperar acceso (demo)</b>
                    <p className="mt-1">
                      Esta es una versión de prueba. Usa una de estas cuentas:
                    </p>
                    <p className="mt-2">
                      Administrador — usuario: <b>admin</b> · contraseña:{' '}
                      <b>admin123</b>
                    </p>
                    <p>
                      Cliente — usuario: <b>cliente</b> · contraseña:{' '}
                      <b>cliente123</b>
                    </p>
                    <p>
                      Empleado — usuario: <b>empleado</b> · contraseña:{' '}
                      <b>empleado123</b>
                    </p>
                    <p className="mt-2 text-[var(--muted)]">
                      En la versión final, JABE te enviará un enlace para crear
                      una contraseña nueva.
                    </p>
                  </div>
                )}
                <div className="rounded-xl border border-[var(--line)] p-4 text-sm leading-6">
                  <b>Cuentas demo para probar</b>
                  <p className="mt-1">
                    Administrador: <b>admin</b> / <b>admin123</b> — ve todo y
                    gestiona.
                  </p>
                  <p>
                    Cliente: <b>cliente</b> / <b>cliente123</b> — solo ve su
                    proyecto.
                  </p>
                  <p>
                    Empleado: <b>empleado</b> / <b>empleado123</b> — obras,
                    fotos y partes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* PORTAL EMPLEADO — tercera pantalla */}
      {portalOpen && user && isEmployee && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[var(--paper)] pt-[max(1rem,var(--safe-area-inset-top))] pb-8">
          <div className="min-h-full">
            <div className="mx-auto max-w-[900px] px-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={logoImg}
                    alt="JABE"
                    className="h-11 w-[110px] object-cover"
                  />
                  <div>
                    <p className="font-display text-2xl leading-none">
                      Portal de empleados
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Sesión: <b>{user.username}</b> · Hoy: {today()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setManualOpen('empleado')}
                    className="rounded-full bg-[var(--green)] px-4 py-2.5 text-sm font-extrabold text-white"
                  >
                    📖 Mi Manual
                  </button>
                  <button
                    onClick={() => setPortalOpen(false)}
                    className="rounded-full border px-4 py-2.5 text-sm font-bold"
                  >
                    Ver la web
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-extrabold text-white"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </button>
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm text-[var(--green)]">
                Este manual solo lo ves tú porque has iniciado sesión como
                Empleado. Pulsa “📖 Mi Manual” para abrirlo.
              </p>
              {portalMsg && (
                <p className="mt-4 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold text-[var(--green)]">
                  {portalMsg}
                </p>
              )}
              <div className="mt-5 card p-5">
                <p className="label">1 · Elige tu obra / proyecto</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setEmployeeProjectId(p.id);
                        setEmployeeView('opciones');
                        setPartForm({
                          trabajos: '',
                          materiales: '',
                          horas: '',
                          incidencias: '',
                          trabajadores: '',
                        });
                      }}
                      className={`rounded-2xl border p-4 text-left ${
                        employeeProjectId === p.id
                          ? 'border-[var(--green)] bg-[var(--soft)]'
                          : 'border-[var(--line)]'
                      }`}
                    >
                      <b className="block [overflow-wrap:anywhere]">{p.name}</b>
                      <span className="mt-1 block text-sm text-[var(--muted)]">
                        Cliente: {p.client}
                      </span>
                      <span className="mt-2 inline-block rounded-full bg-[var(--green)] px-2 py-1 text-xs font-bold text-white">
                        {employeeProjectId === p.id
                          ? 'Obra seleccionada'
                          : 'Elegir esta obra'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {employeeView === 'opciones' && (
                <section className="mt-4">
                  <p className="label">
                    2 · ¿Qué quieres hacer en “{employeeProject?.name}”?
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <button
                      onClick={() => setEmployeeView('fotos')}
                      className="rounded-[24px] bg-[var(--green)] p-6 text-left text-white shadow-lg"
                    >
                      <Camera className="h-12 w-12" />
                      <span className="mt-4 block font-display text-3xl leading-tight">
                        Fotos de obra
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-white/85">
                        Haz una foto o varias y súbelas todas juntas. Quedan en
                        pendientes de revisión, no van directas al cliente.
                      </span>
                      <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-extrabold text-black">
                        Abrir cámara / fotos →
                      </span>
                    </button>
                    <button
                      onClick={() => setEmployeeView('parte')}
                      className="rounded-[24px] bg-[var(--copper)] p-6 text-left text-white shadow-lg"
                    >
                      <ClipboardList className="h-12 w-12" />
                      <span className="mt-4 block font-display text-3xl leading-tight">
                        Parte de trabajo diario
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-white/85">
                        Tu nombre, la fecha y la obra ya vienen rellenos. Solo
                        escribes el trabajo del día y firmas.
                      </span>
                      <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-extrabold text-black">
                        Rellenar parte →
                      </span>
                    </button>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border p-4">
                      <b>
                        Fotos pendientes de revisión en esta obra:{' '}
                        {employeePending.length}
                      </b>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        El administrador las revisa antes de pasarlas al
                        cliente.
                      </p>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <b>Mis partes en esta obra: {employeeParts.length}</b>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {employeeParts.filter((p) => p.signed).length}{' '}
                        firmado(s) ·{' '}
                        {employeeParts.filter((p) => !p.signed).length}{' '}
                        borrador(es).
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {employeeView === 'fotos' && (
                <section className="mt-4 space-y-4">
                  <button
                    onClick={() => setEmployeeView('opciones')}
                    className="font-bold text-[var(--green)] underline"
                  >
                    ← Volver a las dos opciones
                  </button>
                  <div className="card p-5">
                    <h3 className="flex items-center gap-2 font-display text-2xl">
                      <Camera className="h-6 w-6" /> Fotos de obra
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Obra: <b>{employeeProject?.name}</b> · Empleado:{' '}
                      <b>{user.username}</b> · Fecha: <b>{today()}</b>
                    </p>
                    <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                      La subida de fotos desde la cámara o la galería del
                      dispositivo no está disponible todavía en esta versión.
                      Elige una foto de ejemplo de JABE para registrarla como
                      pendiente; el administrador la revisará antes de pasarla
                      al cliente.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                      <div>
                        <label className="label">Foto de ejemplo</label>
                        <select
                          className="field mt-1"
                          value={queueImageKey}
                          onChange={(e) => setQueueImageKey(e.target.value)}
                        >
                          {exampleImages.map((i) => (
                            <option key={i.key} value={i.key}>
                              {i.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Descripción de la foto</label>
                        <input
                          className="field mt-1"
                          value={queueCaption}
                          onChange={(e) => setQueueCaption(e.target.value)}
                          placeholder="Ej.: Estructura en montaje"
                        />
                      </div>
                      <button
                        onClick={addToQueue}
                        className="self-end rounded-full bg-[var(--ink)] px-5 py-3 font-extrabold text-white"
                      >
                        + Añadir a la cola
                      </button>
                    </div>
                    {compressedNote && (
                      <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold text-[var(--green)]">
                        {compressedNote}
                      </p>
                    )}
                    {employeeQueue.length > 0 && (
                      <div className="mt-5">
                        <p className="label">
                          Vista previa · {employeeQueue.length} foto(s) listas
                          para subir
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {employeeQueue.map((q) => (
                            <figure
                              key={q.id}
                              className="overflow-hidden rounded-2xl border"
                            >
                              <img
                                loading="lazy"
                                src={imgFor(q.imageKey)}
                                alt={q.caption}
                                className="aspect-[4/3] w-full object-cover"
                              />
                              <figcaption className="p-3">
                                <span className="block text-sm font-bold [overflow-wrap:anywhere]">
                                  {q.caption}
                                </span>
                                <button
                                  onClick={() => removeFromQueue(q.id)}
                                  className="mt-2 font-bold text-red-700 underline"
                                >
                                  Borrar antes de subir
                                </button>
                              </figcaption>
                            </figure>
                          ))}
                        </div>
                        <button
                          disabled={portalBusy}
                          onClick={uploadAllQueue}
                          className="mt-4 w-full rounded-full bg-[var(--green)] py-4 text-base font-extrabold text-white"
                        >
                          Subir todas ({employeeQueue.length})
                        </button>
                      </div>
                    )}
                    {queueResult && (
                      <div className="mt-4 rounded-xl bg-[var(--soft)] p-4 text-sm">
                        <b>Resultado de la subida:</b> guardadas{' '}
                        {queueResult.saved} · restantes {queueResult.remaining}
                        {queueResult.error && (
                          <span className="block text-red-700">
                            Error: {queueResult.error}
                          </span>
                        )}
                        {queueResult.reloadError && (
                          <span className="block text-red-700">
                            Error al recargar: {queueResult.reloadError}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="card p-5">
                    <h4 className="font-bold">
                      Fotos pendientes de revisión en esta obra
                    </h4>
                    {employeePending.length === 0 ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Todavía no hay fotos pendientes en esta obra.
                      </p>
                    ) : (
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {employeePending.map((pp) => (
                          <figure
                            key={pp.id}
                            className="overflow-hidden rounded-2xl border"
                          >
                            <img
                              loading="lazy"
                              src={imgFor(pp.imageKey)}
                              alt={pp.caption}
                              className="aspect-[4/3] w-full object-cover"
                            />
                            <figcaption className="p-3">
                              <span className="block text-sm font-bold [overflow-wrap:anywhere]">
                                {pp.caption}
                              </span>
                              <span className="mt-1 block text-xs text-[var(--muted)]">
                                {pp.date} · {pp.employee} ·{' '}
                                {pp.status === 'pendiente'
                                  ? '⏳ Pendiente de revisión'
                                  : pp.status === 'aprobada'
                                  ? '✅ Aprobada'
                                  : '❌ Rechazada'}
                              </span>
                              {pp.status === 'pendiente' && (
                                <button
                                  onClick={() => deletePendingAsEmployee(pp.id)}
                                  className="mt-2 font-bold text-red-700 underline"
                                >
                                  Eliminar pendiente
                                </button>
                              )}
                              {pp.status !== 'pendiente' && (
                                <span className="mt-2 block text-xs text-[var(--muted)]">
                                  Ya revisada: no se puede eliminar.
                                </span>
                              )}
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {employeeView === 'parte' && (
                <section className="mt-4 space-y-4">
                  <button
                    onClick={() => setEmployeeView('opciones')}
                    className="font-bold text-[var(--green)] underline"
                  >
                    ← Volver a las dos opciones
                  </button>
                  <div className="card p-5 sm:p-6">
                    <h3 className="flex items-center gap-2 font-display text-2xl">
                      <ClipboardList className="h-6 w-6" /> Parte de trabajo
                      diario
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      Rellena solo el trabajo del día. Lo demás ya viene puesto.
                    </p>
                    <div className="mt-4 grid gap-3 rounded-2xl bg-[var(--soft)] p-4 text-sm sm:grid-cols-3">
                      <div>
                        <span className="label">Nombre del empleado</span>
                        <b className="mt-1 block">{user.username}</b>
                      </div>
                      <div>
                        <span className="label">Fecha de hoy</span>
                        <b className="mt-1 block">{today()}</b>
                      </div>
                      <div>
                        <span className="label">Proyecto / obra</span>
                        <b className="mt-1 block [overflow-wrap:anywhere]">
                          {employeeProject?.name}
                        </b>
                      </div>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="label" htmlFor="trabajos">
                          Trabajos realizados en el día *
                        </label>
                        <textarea
                          id="trabajos"
                          className="field mt-1 min-h-[140px]"
                          value={partForm.trabajos}
                          onChange={(e) =>
                            setPartForm({
                              ...partForm,
                              trabajos: e.target.value,
                            })
                          }
                          placeholder="Describe qué se ha hecho hoy en la obra…"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="materiales">
                            Materiales utilizados
                          </label>
                          <textarea
                            id="materiales"
                            className="field mt-1"
                            rows={3}
                            value={partForm.materiales}
                            onChange={(e) =>
                              setPartForm({
                                ...partForm,
                                materiales: e.target.value,
                              })
                            }
                            placeholder="Materiales utilizados…"
                          />
                        </div>
                        <div>
                          <label className="label" htmlFor="incidencias">
                            Incidencias / Observaciones
                          </label>
                          <textarea
                            id="incidencias"
                            className="field mt-1"
                            rows={3}
                            value={partForm.incidencias}
                            onChange={(e) =>
                              setPartForm({
                                ...partForm,
                                incidencias: e.target.value,
                              })
                            }
                            placeholder="Incidencias u observaciones…"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="horas">
                            Horas
                          </label>
                          <input
                            id="horas"
                            className="field mt-1"
                            inputMode="decimal"
                            value={partForm.horas}
                            onChange={(e) =>
                              setPartForm({
                                ...partForm,
                                horas: e.target.value,
                              })
                            }
                            placeholder="Ej.: 8"
                          />
                        </div>
                        <div>
                          <label className="label" htmlFor="trabajadores">
                            Nº de trabajadores
                          </label>
                          <input
                            id="trabajadores"
                            className="field mt-1"
                            inputMode="numeric"
                            value={partForm.trabajadores}
                            onChange={(e) =>
                              setPartForm({
                                ...partForm,
                                trabajadores: e.target.value,
                              })
                            }
                            placeholder="Ej.: 2"
                          />
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          disabled={portalBusy}
                          onClick={() => savePart(false)}
                          className="rounded-full border-2 border-[var(--ink)] py-4 font-extrabold"
                        >
                          Guardar como borrador
                        </button>
                        <button
                          disabled={portalBusy}
                          onClick={() => savePart(true)}
                          className="flex items-center justify-center gap-2 rounded-full bg-[var(--green)] py-4 font-extrabold text-white"
                        >
                          <ClipboardCheck className="h-5 w-5" /> Firmar y enviar
                          para supervisión
                        </button>
                      </div>
                      <p className="text-xs leading-5 text-[var(--muted)]">
                        Al firmar, quedará registrado “Firmado por{' '}
                        {user.username} el {new Date().toLocaleString('es-ES')}
                        ”. Si no firmas, el parte queda como BORRADOR / SIN
                        FIRMAR.
                      </p>
                    </div>
                  </div>
                  <div className="card p-5">
                    <h4 className="font-bold">Mis partes en esta obra</h4>
                    {employeeParts.length === 0 ? (
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Todavía no has enviado ningún parte en esta obra.
                      </p>
                    ) : (
                      <ul className="mt-3 space-y-3">
                        {employeeParts.map((p) => (
                          <li key={p.id} className="rounded-2xl border p-4">
                            <div className="flex flex-wrap justify-between gap-2">
                              <b>
                                {p.date} · {p.projectName}
                              </b>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                                  p.signed
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {p.signed
                                  ? `✅ FIRMADO por ${p.signedBy} el ${p.signedAt}`
                                  : '⏳ SIN FIRMAR · BORRADOR'}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 [overflow-wrap:anywhere]">
                              {p.trabajos}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              Horas: {p.horas || '—'} · Trabajadores:{' '}
                              {p.trabajadores || '—'} · Estado: {p.status}
                            </p>
                            {!p.signed && (
                              <button
                                onClick={() => deletePartAsEmployee(p.id)}
                                className="mt-2 font-bold text-red-700 underline"
                              >
                                Eliminar borrador
                              </button>
                            )}
                            {p.signed && (
                              <span className="mt-2 block text-xs text-[var(--muted)]">
                                Parte firmado: no se puede eliminar.
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              )}
              <p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">
                Portal de empleados de demostración. Las fotos quedan en
                pendientes hasta que el administrador las revise. Los partes
                firmados se envían a supervisión.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* PORTAL cliente / admin */}
      {portalOpen && user && !isEmployee && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[var(--paper)] pt-[max(1rem,var(--safe-area-inset-top))] pb-8">
          <div className="min-h-full">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={logoImg}
                    alt="JABE"
                    className="h-11 w-[110px] object-cover"
                  />
                  <div>
                    <p className="font-display text-2xl leading-none">
                      Portal del cliente
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Sesión: <b>{user.username}</b>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {isAdmin ? (
                    <button
                      onClick={() => setManualOpen('admin')}
                      className="rounded-full bg-[var(--copper)] px-4 py-2.5 text-sm font-extrabold text-white"
                    >
                      📖 Manual del Administrador
                    </button>
                  ) : (
                    <button
                      onClick={() => setManualOpen('cliente')}
                      className="rounded-full bg-[var(--green)] px-4 py-2.5 text-sm font-extrabold text-white"
                    >
                      📖 Mi Manual
                    </button>
                  )}
                  <button
                    onClick={() => setPortalOpen(false)}
                    className="rounded-full border px-4 py-2.5 text-sm font-bold"
                  >
                    Ver la web
                  </button>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-extrabold text-white"
                  >
                    <LogOut className="h-4 w-4" /> Cerrar sesión
                  </button>
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm text-[var(--green)]">
                Este manual solo lo ves tú porque has iniciado sesión como{' '}
                {isAdmin ? 'Administrador' : 'Cliente'}. Pulsa “
                {isAdmin ? '📖 Manual del Administrador' : '📖 Mi Manual'}” para
                abrirlo.
              </p>

              <div
                className={`mt-5 rounded-[18px] p-4 text-sm leading-6 sm:p-5 ${
                  isAdmin
                    ? 'bg-[var(--soft)] text-[var(--green)]'
                    : 'bg-[#FFF4E5] text-[#6B3A14]'
                }`}
              >
                <b>Rol: {isAdmin ? 'Administrador' : 'Cliente'}</b>
                <span> — </span>
                {isAdmin
                  ? 'puedes añadir, cambiar y eliminar'
                  : 'puedes ver y descargar documentación, subir tu documentación, no puedes eliminar'}
              </div>
              {portalMsg && (
                <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold text-[var(--green)]">
                  {portalMsg}
                </p>
              )}

              <div className="mt-5 rounded-[22px] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="label">Proyecto activo</p>
                    <h3 className="mt-1 font-display text-2xl leading-tight [overflow-wrap:anywhere]">
                      {visibleProject?.name || 'Sin proyecto'}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Cliente: {visibleProject?.client || '—'} · Usuario:{' '}
                      {visibleProject?.username || '—'}
                    </p>
                  </div>
                  {isAdmin && (
                    <label className="min-w-[220px]">
                      <span className="label">Cambiar de proyecto</span>
                      <select
                        className="field mt-1"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                      >
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — {p.client}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              </div>

              <div
                className="mt-4 flex gap-2 overflow-x-auto pb-1"
                role="tablist"
                aria-label="Apartados del portal"
              >
                <button
                  role="tab"
                  aria-selected={portalTab === 'fotos'}
                  onClick={() => setPortalTab('fotos')}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-extrabold ${
                    portalTab === 'fotos'
                      ? 'bg-[var(--green)] text-white'
                      : 'border border-[var(--line)] bg-[var(--surface)]'
                  }`}
                >
                  A · Fotografías
                </button>
                <button
                  role="tab"
                  aria-selected={portalTab === 'doc-cliente'}
                  onClick={() => setPortalTab('doc-cliente')}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-extrabold ${
                    portalTab === 'doc-cliente'
                      ? 'bg-[var(--green)] text-white'
                      : 'border border-[var(--line)] bg-[var(--surface)]'
                  }`}
                >
                  B · Tu documentación
                </button>
                <button
                  role="tab"
                  aria-selected={portalTab === 'doc-jabe'}
                  onClick={() => setPortalTab('doc-jabe')}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-extrabold ${
                    portalTab === 'doc-jabe'
                      ? 'bg-[var(--green)] text-white'
                      : 'border border-[var(--line)] bg-[var(--surface)]'
                  }`}
                >
                  C · Documentación JABE
                </button>
                {!isEmployee && !isAdmin && (
                  <button
                    role="tab"
                    aria-selected={portalTab === 'chat'}
                    onClick={() => setPortalTab('chat')}
                    className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-extrabold ${
                      portalTab === 'chat'
                        ? 'bg-[var(--green)] text-white'
                        : 'border border-[var(--line)] bg-[var(--surface)]'
                    }`}
                  >
                    💬 Chat con JABE{' '}
                    {clientUnread > 0 && (
                      <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-xs font-extrabold text-white">
                        {clientUnread}
                      </span>
                    )}
                  </button>
                )}
                {isAdmin && (
                  <button
                    role="tab"
                    aria-selected={portalTab === 'chats'}
                    onClick={() => setPortalTab('chats')}
                    className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-extrabold ${
                      portalTab === 'chats'
                        ? 'bg-[var(--copper)] text-white'
                        : 'border border-[var(--line)] bg-[var(--surface)]'
                    }`}
                  >
                    💬 Chats de clientes{' '}
                    {totalUnreadAdmin > 0 && (
                      <span className="ml-1 inline-flex h-5 min-w-[20px] animate-pulse items-center justify-center rounded-full bg-red-600 px-1 text-xs font-extrabold text-white">
                        {totalUnreadAdmin}
                      </span>
                    )}
                  </button>
                )}
                {isAdmin && (
                  <button
                    role="tab"
                    aria-selected={portalTab === 'supervision'}
                    onClick={() => setPortalTab('supervision')}
                    className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-extrabold ${
                      portalTab === 'supervision'
                        ? 'bg-[var(--copper)] text-white'
                        : 'border border-[var(--line)] bg-[var(--surface)]'
                    }`}
                  >
                    Supervisión empleados
                  </button>
                )}
                {isAdmin && (
                  <button
                    role="tab"
                    aria-selected={portalTab === 'admin'}
                    onClick={() => setPortalTab('admin')}
                    className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-extrabold ${
                      portalTab === 'admin'
                        ? 'bg-[var(--copper)] text-white'
                        : 'border border-[var(--line)] bg-[var(--surface)]'
                    }`}
                  >
                    Panel administrador
                  </button>
                )}
                {isAdmin && (
                  <button
                    role="tab"
                    aria-selected={portalTab === 'webadmin'}
                    onClick={() => setPortalTab('webadmin')}
                    className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-extrabold ${
                      portalTab === 'webadmin'
                        ? 'bg-[var(--copper)] text-white'
                        : 'border border-[var(--line)] bg-[var(--surface)]'
                    }`}
                  >
                    ⚙ Panel de Administración de la Web
                  </button>
                )}
              </div>

              {portalTab === 'fotos' && (
                <section className="mt-4">
                  <div className="rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                    <b>
                      Fotografías protegidas: no se pueden descargar ni
                      capturar.
                    </b>
                    <p className="mt-1 text-xs leading-5">
                      La protección total contra capturas de pantalla no es
                      técnicamente posible a nivel de sistema operativo, esta
                      vista dificulta descarga y copia.
                    </p>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <label>
                      <span className="label">
                        Buscar fotos por nombre o pie
                      </span>
                      <input
                        className="field mt-1"
                        value={photoSearch}
                        onChange={(e) => {
                          setPhotoSearch(e.target.value);
                          setPhotoPage(1);
                        }}
                        placeholder="Buscar por pie de foto…"
                      />
                    </label>
                    <label>
                      <span className="label">Buscar por carpeta</span>
                      <input
                        className="field mt-1"
                        value={photoSearch}
                        onChange={(e) => {
                          setPhotoSearch(e.target.value);
                          setPhotoPage(1);
                        }}
                        placeholder="Escribe el nombre de la carpeta…"
                      />
                    </label>
                  </div>
                  {compressedNote && (
                    <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold text-[var(--green)]">
                      {compressedNote}
                    </p>
                  )}
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    Carpetas colapsadas por defecto. Pulsa una carpeta para
                    abrirla; pulsa otra vez para cerrarla. Solo se cargan las
                    fotos de la carpeta abierta, en páginas de 20.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {visibleFolders.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setSelectedFolderId(
                            selectedFolderId === f.id ? '' : f.id
                          );
                          setPhotoPage(1);
                        }}
                        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold ${
                          selectedFolderId === f.id
                            ? 'bg-[var(--ink)] text-white'
                            : 'border border-[var(--line)] bg-[var(--surface)]'
                        }`}
                      >
                        <FolderOpen className="h-4 w-4" />
                        {f.name} ·{' '}
                        {
                          visiblePhotos.filter((p) => p.folderId === f.id)
                            .length
                        }{' '}
                        {selectedFolderId === f.id ? '▾' : '▸'}
                      </button>
                    ))}
                  </div>
                  {visibleFolders.length === 0 && (
                    <p className="mt-4 rounded-xl border p-4 text-sm">
                      Todavía no hay carpetas en este proyecto.
                    </p>
                  )}
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(!selectedFolderId
                      ? []
                      : visiblePhotos
                          .filter(
                            (p) =>
                              p.folderId === selectedFolderId &&
                              (!photoSearch ||
                                p.caption
                                  .toLowerCase()
                                  .includes(photoSearch.toLowerCase()) ||
                                (
                                  visibleFolders.find(
                                    (x) => x.id === p.folderId
                                  )?.name || ''
                                )
                                  .toLowerCase()
                                  .includes(photoSearch.toLowerCase()))
                          )
                          .slice(0, photoPage * PAGE_SIZE)
                    ).map((ph) => {
                      const f = visibleFolders.find(
                        (x) => x.id === ph.folderId
                      );
                      return (
                        <figure
                          key={ph.id}
                          className="overflow-hidden rounded-[20px] border border-[var(--line)] bg-white"
                          onContextMenu={(e) => e.preventDefault()}
                        >
                          <button
                            onClick={() => setPhotoViewer(ph)}
                            className="block w-full text-left"
                            aria-label={`Ver foto completa: ${ph.caption}`}
                          >
                            <div
                              className="relative aspect-[4/3] select-none overflow-hidden"
                              style={{
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                              }}
                              onContextMenu={(e) => e.preventDefault()}
                              onDragStart={(e) => e.preventDefault()}
                            >
                              <img
                                loading="lazy"
                                src={imgFor(ph.imageKey)}
                                alt={ph.caption}
                                className="h-full w-full object-cover"
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                                onDragStart={(e) => e.preventDefault()}
                              />
                              <span className="pointer-events-none absolute inset-0 grid place-items-center">
                                <span className="rotate-[-18deg] rounded-lg bg-black/35 px-3 py-2 text-center text-xs font-extrabold tracking-wide text-white/90">
                                  JABE — Uso exclusivo cliente
                                </span>
                              </span>
                              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
                                {f?.name || 'Carpeta'}
                              </span>
                            </div>
                          </button>
                          <figcaption className="flex items-start justify-between gap-2 p-4">
                            <span className="text-sm font-bold [overflow-wrap:anywhere]">
                              {ph.caption}
                            </span>
                            {isAdmin && (
                              <button
                                onClick={() => deletePhotoNow(ph.id)}
                                className="shrink-0 rounded-full border px-2 py-1 text-xs font-bold text-red-700"
                              >
                                Eliminar
                              </button>
                            )}
                          </figcaption>
                        </figure>
                      );
                    })}
                  </div>
                  {!selectedFolderId && (
                    <p className="mt-4 rounded-xl border p-4 text-sm">
                      Carpetas colapsadas: abre una carpeta para ver sus fotos.
                      Solo se carga la carpeta seleccionada.
                    </p>
                  )}
                  {selectedFolderId &&
                    visiblePhotos.filter(
                      (p) =>
                        p.folderId === selectedFolderId &&
                        (!photoSearch ||
                          p.caption
                            .toLowerCase()
                            .includes(photoSearch.toLowerCase()))
                    ).length === 0 && (
                      <p className="mt-4 rounded-xl border p-4 text-sm">
                        Esta carpeta todavía no tiene fotos con este filtro.
                      </p>
                    )}
                  {selectedFolderId &&
                    visiblePhotos.filter(
                      (p) =>
                        p.folderId === selectedFolderId &&
                        (!photoSearch ||
                          p.caption
                            .toLowerCase()
                            .includes(photoSearch.toLowerCase()))
                    ).length >
                      photoPage * PAGE_SIZE && (
                      <button
                        onClick={() => setPhotoPage((p) => p + 1)}
                        className="mt-4 w-full rounded-full border-2 border-[var(--ink)] py-3 font-extrabold"
                      >
                        Cargar más fotos (20 por página)
                      </button>
                    )}
                  {selectedFolderId && (
                    <p className="mt-3 text-center text-sm text-[var(--muted)]">
                      Mostrando{' '}
                      {Math.min(
                        photoPage * PAGE_SIZE,
                        visiblePhotos.filter(
                          (p) => p.folderId === selectedFolderId
                        ).length
                      )}{' '}
                      de{' '}
                      {
                        visiblePhotos.filter(
                          (p) => p.folderId === selectedFolderId
                        ).length
                      }{' '}
                      fotos de esta carpeta · Pulsa una miniatura para ver la
                      foto completa.
                    </p>
                  )}
                  <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                    Las fotografías no tienen botón de descarga, no se abren al
                    pulsar con el botón derecho y no se pueden arrastrar. Solo
                    se muestran dentro del portal. Miniaturas con carga
                    perezosa: la foto completa solo se carga al pulsar.
                  </p>
                  {photoViewer && (
                    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/70 pt-[max(1rem,var(--safe-area-inset-top))] pb-6">
                      <div className="min-h-full flex items-center justify-center p-4">
                        <div className="w-full max-w-[820px] rounded-[22px] bg-[var(--paper)] p-4">
                          <div className="flex justify-between gap-3">
                            <p className="font-bold [overflow-wrap:anywhere]">
                              {photoViewer.caption}
                            </p>
                            <button
                              onClick={() => setPhotoViewer(null)}
                              className="rounded-full border px-3 py-1 font-bold"
                            >
                              Cerrar
                            </button>
                          </div>
                          <img
                            src={imgFor(photoViewer.imageKey)}
                            alt={photoViewer.caption}
                            className="mt-3 max-h-[calc(100dvh-var(--safe-area-inset-top)-6rem)] w-auto max-w-full object-contain mx-auto"
                          />
                          <p className="mt-2 text-center text-xs text-[var(--muted)]">
                            Foto completa · {photoViewer.caption}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              )}

              {portalTab === 'doc-cliente' && (
                <section className="mt-4 grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
                  <div className="card p-5">
                    <h3 className="font-display text-2xl">Tu documentación</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Registra aquí la documentación que debes adjuntar. Tú
                      puedes registrarla; no puedes eliminar ni cambiar lo ya
                      registrado. Solo el administrador puede eliminar o
                      sustituir.
                    </p>
                    <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
                      La subida de archivos no está disponible todavía en esta
                      versión. Registra el nombre del documento y JABE lo
                      asociará a tu proyecto. No se guardan archivos en el
                      navegador.
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="label">Nombre del documento</label>
                        <input
                          className="field mt-1"
                          value={clientDocName}
                          onChange={(e) => setClientDocName(e.target.value)}
                          placeholder="Ej.: Escritura — nota simple.pdf"
                        />
                      </div>
                      <div>
                        <label className="label">Tipo</label>
                        <select
                          className="field mt-1"
                          value={clientDocKind}
                          onChange={(e) => setClientDocKind(e.target.value)}
                        >
                          <option>PDF</option>
                          <option>Imagen</option>
                          <option>Documento</option>
                          <option>Otro</option>
                        </select>
                      </div>
                      <button
                        disabled={portalBusy}
                        onClick={async () => {
                          await addDoc(
                            'cliente',
                            clientDocName,
                            clientDocKind,
                            '—'
                          );
                          setClientDocName('');
                        }}
                        className="w-full rounded-full bg-[var(--green)] py-3 font-extrabold text-white"
                      >
                        Registrar mi documentación
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label>
                        <span className="label">
                          Buscar documento por nombre
                        </span>
                        <input
                          className="field mt-1"
                          value={docSearch}
                          onChange={(e) => {
                            setDocSearch(e.target.value);
                            setDocPage(1);
                          }}
                          placeholder="Buscar por nombre…"
                        />
                      </label>
                      <label>
                        <span className="label">Buscar por fecha</span>
                        <input
                          className="field mt-1"
                          value={docSearch}
                          onChange={(e) => {
                            setDocSearch(e.target.value);
                            setDocPage(1);
                          }}
                          placeholder="Ej.: 10/11/2026"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-[var(--muted)]">
                      Mostrando{' '}
                      {Math.min(
                        docPage * PAGE_SIZE,
                        visibleDocs.filter((d) => d.section === 'cliente')
                          .length
                      )}{' '}
                      de{' '}
                      {
                        visibleDocs.filter((d) => d.section === 'cliente')
                          .length
                      }{' '}
                      documentos · 20 por página.
                    </p>
                    {visibleDocs
                      .filter(
                        (d) =>
                          d.section === 'cliente' &&
                          (!docSearch ||
                            d.name
                              .toLowerCase()
                              .includes(docSearch.toLowerCase()) ||
                            d.date.includes(docSearch))
                      )
                      .slice(0, docPage * PAGE_SIZE)
                      .map((d) => (
                        <article
                          key={d.id}
                          className="card flex flex-wrap items-center justify-between gap-3 p-4"
                        >
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 font-bold [overflow-wrap:anywhere]">
                              <FileText className="h-5 w-5 shrink-0 text-[var(--green)]" />
                              {d.name}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              {d.kind} · {d.sizeLabel} · {d.date}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => downloadDoc(d)}
                              className="flex items-center gap-2 rounded-full bg-[var(--green)] px-4 py-2.5 text-sm font-extrabold text-white"
                            >
                              <Download className="h-4 w-4" /> Descargar al
                              ordenador
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() =>
                                    setEditDoc({
                                      id: d.id,
                                      name: d.name,
                                      kind: d.kind,
                                      sizeLabel: d.sizeLabel,
                                    })
                                  }
                                  className="rounded-full border px-3 py-2.5 text-sm font-bold"
                                >
                                  Cambiar
                                </button>
                                <button
                                  onClick={() => deleteDocNow(d.id)}
                                  className="rounded-full border border-red-200 px-3 py-2.5 text-sm font-bold text-red-700"
                                >
                                  Eliminar
                                </button>
                              </>
                            )}
                          </div>
                        </article>
                      ))}
                    {visibleDocs.filter(
                      (d) =>
                        d.section === 'cliente' &&
                        (!docSearch ||
                          d.name
                            .toLowerCase()
                            .includes(docSearch.toLowerCase()))
                    ).length >
                      docPage * PAGE_SIZE && (
                      <button
                        onClick={() => setDocPage((p) => p + 1)}
                        className="w-full rounded-full border-2 border-[var(--ink)] py-3 font-extrabold"
                      >
                        Cargar más documentos
                      </button>
                    )}
                    {visibleDocs.filter((d) => d.section === 'cliente')
                      .length === 0 && (
                      <p className="rounded-xl border p-4 text-sm">
                        Todavía no hay documentación tuya registrada en este
                        proyecto.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {portalTab === 'doc-jabe' && (
                <section className="mt-4">
                  <div className="card p-5">
                    <h3 className="font-display text-2xl">
                      Documentación de JABE
                    </h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                      Presupuestos, planos, licencias y garantías que JABE te
                      remite. Puedes ver y descargar. Solo el administrador
                      puede eliminar o cambiar.
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label>
                        <span className="label">
                          Buscar documento JABE por nombre
                        </span>
                        <input
                          className="field mt-1"
                          value={docSearch}
                          onChange={(e) => {
                            setDocSearch(e.target.value);
                            setDocPage(1);
                          }}
                          placeholder="Buscar por nombre…"
                        />
                      </label>
                      <label>
                        <span className="label">Buscar por fecha</span>
                        <input
                          className="field mt-1"
                          value={docSearch}
                          onChange={(e) => {
                            setDocSearch(e.target.value);
                            setDocPage(1);
                          }}
                          placeholder="Ej.: 11/11/2026"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-[var(--muted)]">
                      Mostrando{' '}
                      {Math.min(
                        docPage * PAGE_SIZE,
                        visibleDocs.filter((d) => d.section === 'jabe').length
                      )}{' '}
                      de{' '}
                      {visibleDocs.filter((d) => d.section === 'jabe').length}{' '}
                      documentos · 20 por página.
                    </p>
                    {visibleDocs
                      .filter(
                        (d) =>
                          d.section === 'jabe' &&
                          (!docSearch ||
                            d.name
                              .toLowerCase()
                              .includes(docSearch.toLowerCase()) ||
                            d.date.includes(docSearch))
                      )
                      .slice(0, docPage * PAGE_SIZE)
                      .map((d) => (
                        <article
                          key={d.id}
                          className="card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5"
                        >
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 font-bold [overflow-wrap:anywhere]">
                              <FileText className="h-5 w-5 shrink-0 text-[var(--copper)]" />
                              {d.name}
                            </p>
                            <p className="mt-1 text-xs text-[var(--muted)]">
                              {d.kind} · {d.sizeLabel} · {d.date}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => downloadDoc(d)}
                              className="flex items-center gap-2 rounded-full bg-[var(--green)] px-5 py-3 font-extrabold text-white"
                            >
                              <Download className="h-4 w-4" /> Descargar al
                              ordenador
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() =>
                                    setEditDoc({
                                      id: d.id,
                                      name: d.name,
                                      kind: d.kind,
                                      sizeLabel: d.sizeLabel,
                                    })
                                  }
                                  className="rounded-full border px-3 py-3 text-sm font-bold"
                                >
                                  Cambiar
                                </button>
                                <button
                                  onClick={() => deleteDocNow(d.id)}
                                  className="rounded-full border border-red-200 px-3 py-3 text-sm font-bold text-red-700"
                                >
                                  Eliminar
                                </button>
                              </>
                            )}
                          </div>
                        </article>
                      ))}
                    {visibleDocs.filter(
                      (d) =>
                        d.section === 'jabe' &&
                        (!docSearch ||
                          d.name
                            .toLowerCase()
                            .includes(docSearch.toLowerCase()))
                    ).length >
                      docPage * PAGE_SIZE && (
                      <button
                        onClick={() => setDocPage((p) => p + 1)}
                        className="w-full rounded-full border-2 border-[var(--ink)] py-3 font-extrabold"
                      >
                        Cargar más documentos
                      </button>
                    )}
                    {visibleDocs.filter((d) => d.section === 'jabe').length ===
                      0 && (
                      <p className="rounded-xl border p-4 text-sm">
                        JABE todavía no ha remitido documentación en este
                        proyecto.
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="mt-5 card p-5">
                      <h4 className="font-bold">
                        Añadir documentación de JABE
                      </h4>
                      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_140px_140px_auto]">
                        <input
                          className="field"
                          value={newDoc.name}
                          onChange={(e) =>
                            setNewDoc({ ...newDoc, name: e.target.value })
                          }
                          placeholder="Ej.: Presupuesto orientativo.pdf"
                        />
                        <select
                          className="field"
                          value={newDoc.kind}
                          onChange={(e) =>
                            setNewDoc({ ...newDoc, kind: e.target.value })
                          }
                        >
                          <option>PDF</option>
                          <option>Imagen</option>
                          <option>Documento</option>
                          <option>Otro</option>
                        </select>
                        <input
                          className="field"
                          value={newDoc.sizeLabel}
                          onChange={(e) =>
                            setNewDoc({ ...newDoc, sizeLabel: e.target.value })
                          }
                          placeholder="Tamaño, ej. 1,2 MB"
                        />
                        <button
                          disabled={portalBusy}
                          onClick={async () => {
                            await addDoc(
                              'jabe',
                              newDoc.name,
                              newDoc.kind,
                              newDoc.sizeLabel
                            );
                            setNewDoc({
                              section: 'jabe',
                              name: '',
                              kind: 'PDF',
                              sizeLabel: '',
                            });
                          }}
                          className="rounded-full bg-[var(--copper)] px-5 py-3 font-extrabold text-white"
                        >
                          Añadir
                        </button>
                      </div>
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        La subida de archivos no está disponible todavía:
                        registra el documento para que el cliente lo vea y lo
                        descargue como ficha. El archivo original se entrega por
                        los canales habituales de JABE.
                      </p>
                    </div>
                  )}
                </section>
              )}

              {editDoc.id && (
                <div className="mt-4 rounded-[20px] border border-[var(--copper)] bg-[var(--soft)] p-5">
                  <h4 className="font-bold">Cambiar / sustituir documento</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_140px_140px_auto]">
                    <input
                      className="field"
                      value={editDoc.name}
                      onChange={(e) =>
                        setEditDoc({ ...editDoc, name: e.target.value })
                      }
                    />
                    <select
                      className="field"
                      value={editDoc.kind}
                      onChange={(e) =>
                        setEditDoc({ ...editDoc, kind: e.target.value })
                      }
                    >
                      <option>PDF</option>
                      <option>Imagen</option>
                      <option>Documento</option>
                      <option>Otro</option>
                    </select>
                    <input
                      className="field"
                      value={editDoc.sizeLabel}
                      onChange={(e) =>
                        setEditDoc({ ...editDoc, sizeLabel: e.target.value })
                      }
                      placeholder="Tamaño"
                    />
                    <button
                      onClick={saveEditDoc}
                      className="rounded-full bg-[var(--green)] px-5 py-3 font-extrabold text-white"
                    >
                      Guardar cambio
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      setEditDoc({
                        id: '',
                        name: '',
                        kind: 'PDF',
                        sizeLabel: '',
                      })
                    }
                    className="mt-2 text-sm font-bold underline"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {portalTab === 'supervision' && isAdmin && (
                <section className="mt-4 space-y-5">
                  <div className="card p-5">
                    <h3 className="flex items-center gap-2 font-display text-2xl">
                      <Filter className="h-5 w-5" /> Filtros de supervisión
                    </h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Los filtros se aplican a fotos pendientes y a partes
                      diarios.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <label>
                        <span className="label">Obra</span>
                        <select
                          className="field mt-1"
                          value={supProject}
                          onChange={(e) => {
                            setSupProject(e.target.value);
                            setSelectedPendingIds([]);
                            setMigrateFolderId('');
                          }}
                        >
                          <option value="todas">Todas las obras</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="label">Empleado</span>
                        <select
                          className="field mt-1"
                          value={supEmployee}
                          onChange={(e) => setSupEmployee(e.target.value)}
                        >
                          <option value="todos">Todos</option>
                          {employeeNames.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="label">Fecha (dd/mm/aaaa)</span>
                        <input
                          className="field mt-1"
                          value={supDate}
                          onChange={(e) => setSupDate(e.target.value)}
                          placeholder="Ej.: 23/11/2026"
                        />
                      </label>
                      <label>
                        <span className="label">Partes: firmado</span>
                        <select
                          className="field mt-1"
                          value={supSigned}
                          onChange={(e) => setSupSigned(e.target.value as any)}
                        >
                          <option value="todos">Todos</option>
                          <option value="firmados">Solo firmados</option>
                          <option value="sin-firmar">Solo sin firmar</option>
                        </select>
                      </label>
                    </div>
                    <div className="mt-3">
                      <label className="label">Fotos: estado</label>
                      <select
                        className="field mt-1 max-w-[260px]"
                        value={supStatus}
                        onChange={(e) => setSupStatus(e.target.value)}
                      >
                        <option value="todos">Todos</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="rechazada">Rechazada</option>
                      </select>
                    </div>
                  </div>

                  <div className="card p-5">
                    <h3 className="flex items-center gap-2 font-display text-2xl">
                      <Camera className="h-6 w-6" /> Fotos pendientes de
                      revisión · {filteredPending.length}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Marca una o varias fotos y migra en 2 clics. Para migrar,
                      filtra por una sola obra y elige la carpeta destino del
                      cliente.
                    </p>
                    {supProject === 'todas' && (
                      <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                        Para migrar, elige primero una obra en el filtro de
                        arriba.
                      </p>
                    )}
                    {supProject !== 'todas' && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <label>
                          <span className="label">
                            Carpeta destino del cliente
                          </span>
                          <select
                            className="field mt-1"
                            value={migrateFolderId}
                            onChange={(e) => setMigrateFolderId(e.target.value)}
                          >
                            <option value="">Elige carpeta destino…</option>
                            {supFolders.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          disabled={
                            portalBusy || selectedPendingIds.length === 0
                          }
                          onClick={migrateSelected}
                          className="self-end rounded-full bg-[var(--copper)] px-6 py-3.5 font-extrabold text-white"
                        >
                          Migrar a carpeta de cliente (
                          {selectedPendingIds.length})
                        </button>
                      </div>
                    )}
                    {migrateResult && (
                      <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold">
                        {migrateResult}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-[var(--muted)]">
                      Mostrando{' '}
                      {Math.min(
                        pendingPage * PAGE_SIZE,
                        filteredPending.length
                      )}{' '}
                      de {filteredPending.length} fotos pendientes · 20 por
                      página.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredPending
                        .slice(0, pendingPage * PAGE_SIZE)
                        .map((pp) => {
                          const proj = projects.find(
                            (p) => p.id === pp.projectId
                          );
                          return (
                            <article
                              key={pp.id}
                              className="overflow-hidden rounded-2xl border"
                            >
                              <div className="relative">
                                <img
                                  loading="lazy"
                                  src={imgFor(pp.imageKey)}
                                  alt={pp.caption}
                                  className="aspect-[4/3] w-full object-cover"
                                />
                                <button
                                  onClick={() => togglePending(pp.id)}
                                  aria-label={
                                    selectedPendingIds.includes(pp.id)
                                      ? 'Desmarcar foto'
                                      : 'Marcar foto'
                                  }
                                  className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
                                >
                                  {selectedPendingIds.includes(pp.id) ? (
                                    <CheckSquare className="h-6 w-6 text-[var(--green)]" />
                                  ) : (
                                    <Square className="h-6 w-6" />
                                  )}
                                </button>
                              </div>
                              <div className="p-4">
                                <p className="text-sm font-bold [overflow-wrap:anywhere]">
                                  {pp.caption}
                                </p>
                                <p className="mt-1 text-xs text-[var(--muted)]">
                                  {proj?.name} · {pp.date} · {pp.employee} ·{' '}
                                  {pp.status}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <button
                                    onClick={() =>
                                      setPendingStatus(pp.id, 'aprobada')
                                    }
                                    className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-extrabold text-emerald-800"
                                  >
                                    Aprobar
                                  </button>
                                  <button
                                    onClick={() =>
                                      setPendingStatus(pp.id, 'rechazada')
                                    }
                                    className="rounded-full bg-red-100 px-3 py-2 text-xs font-extrabold text-red-800"
                                  >
                                    Rechazar
                                  </button>
                                  <button
                                    onClick={() => deletePendingAsAdmin(pp.id)}
                                    className="rounded-full border px-3 py-2 text-xs font-bold text-red-700"
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                    </div>
                    {filteredPending.length > pendingPage * PAGE_SIZE && (
                      <button
                        onClick={() => setPendingPage((p) => p + 1)}
                        className="mt-4 w-full rounded-full border-2 border-[var(--ink)] py-3 font-extrabold"
                      >
                        Cargar más fotos pendientes
                      </button>
                    )}
                    {filteredPending.length === 0 && (
                      <p className="mt-4 rounded-xl border p-4 text-sm">
                        No hay fotos pendientes con este filtro.
                      </p>
                    )}
                  </div>

                  <div className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="flex items-center gap-2 font-display text-2xl">
                          <ClipboardList className="h-6 w-6" /> Partes diarios ·{' '}
                          {filteredParts.length}
                        </h3>
                        <p className="mt-2 text-sm text-[var(--muted)]">
                          Firmado o sin firmar, con filtros por obra, empleado y
                          fecha.
                        </p>
                      </div>
                      <button
                        onClick={downloadAllParts}
                        className="flex items-center gap-2 rounded-full bg-[var(--green)] px-5 py-3 font-extrabold text-white"
                      >
                        <Download className="h-4 w-4" /> Descargar todas las
                        fichas
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <label>
                          <span className="label">
                            Buscar parte por trabajo, proyecto o empleado
                          </span>
                          <input
                            className="field mt-1"
                            value={partSearch}
                            onChange={(e) => {
                              setPartSearch(e.target.value);
                              setPartPage(1);
                            }}
                            placeholder="Buscar parte…"
                          />
                        </label>
                        <label>
                          <span className="label">Buscar parte por fecha</span>
                          <input
                            className="field mt-1"
                            value={partSearch}
                            onChange={(e) => {
                              setPartSearch(e.target.value);
                              setPartPage(1);
                            }}
                            placeholder="Ej.: 23/11/2026"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-[var(--muted)]">
                        Mostrando{' '}
                        {Math.min(partPage * PAGE_SIZE, filteredParts.length)}{' '}
                        de {filteredParts.length} partes · 20 por página.
                      </p>
                      {filteredParts
                        .filter(
                          (p) =>
                            !partSearch ||
                            p.trabajos
                              .toLowerCase()
                              .includes(partSearch.toLowerCase()) ||
                            p.projectName
                              .toLowerCase()
                              .includes(partSearch.toLowerCase()) ||
                            p.employee
                              .toLowerCase()
                              .includes(partSearch.toLowerCase()) ||
                            p.date.includes(partSearch)
                        )
                        .slice(0, partPage * PAGE_SIZE)
                        .map((p) => (
                          <article
                            key={p.id}
                            className="rounded-2xl border p-4"
                          >
                            <div className="flex flex-wrap justify-between gap-2">
                              <b className="[overflow-wrap:anywhere]">
                                {p.date} · {p.projectName} · {p.employee}
                              </b>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                                  p.signed
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {p.signed
                                  ? `✅ FIRMADO por ${
                                      p.signedBy || p.employee
                                    }${p.signedAt ? ` el ${p.signedAt}` : ''}`
                                  : '⏳ SIN FIRMAR'}
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-6 [overflow-wrap:anywhere]">
                              <b>Trabajos:</b> {p.trabajos}
                            </p>
                            <p className="mt-1 text-sm text-[var(--muted)]">
                              Materiales: {p.materiales || '—'} · Horas:{' '}
                              {p.horas || '—'} · Trabajadores:{' '}
                              {p.trabajadores || '—'} · Incidencias:{' '}
                              {p.incidencias || '—'} · Estado: {p.status}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                onClick={() => downloadPart(p)}
                                className="flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2.5 text-sm font-extrabold text-white"
                              >
                                <Download className="h-4 w-4" /> Descargar ficha
                              </button>
                              <button
                                onClick={() => setPartStatus(p.id, 'aprobado')}
                                className="rounded-full bg-emerald-100 px-4 py-2.5 text-sm font-extrabold text-emerald-800"
                              >
                                Aprobar
                              </button>
                              <button
                                onClick={() => setPartStatus(p.id, 'rechazado')}
                                className="rounded-full bg-red-100 px-4 py-2.5 text-sm font-extrabold text-red-800"
                              >
                                Rechazar
                              </button>
                              <button
                                onClick={() => deletePartAsAdmin(p.id)}
                                className="rounded-full border border-red-200 px-4 py-2.5 text-sm font-bold text-red-700"
                              >
                                Eliminar
                              </button>
                            </div>
                          </article>
                        ))}
                    </div>
                    {filteredParts.filter(
                      (p) =>
                        !partSearch ||
                        p.trabajos
                          .toLowerCase()
                          .includes(partSearch.toLowerCase())
                    ).length >
                      partPage * PAGE_SIZE && (
                      <button
                        onClick={() => setPartPage((p) => p + 1)}
                        className="w-full rounded-full border-2 border-[var(--ink)] py-3 font-extrabold"
                      >
                        Cargar más partes (20 por página)
                      </button>
                    )}
                    {filteredParts.length === 0 && (
                      <p className="mt-4 rounded-xl border p-4 text-sm">
                        No hay partes con este filtro.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {portalTab === 'admin' && isAdmin && (
                <section className="mt-4 grid gap-5 lg:grid-cols-2">
                  <div className="card p-5">
                    <h3 className="flex items-center gap-2 font-display text-2xl">
                      <Plus className="h-5 w-5" /> Crear proyecto / cliente
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      El cliente entrará con el usuario que escribas aquí.
                    </p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="label">Nombre del proyecto</label>
                        <input
                          className="field mt-1"
                          value={newProject.name}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              name: e.target.value,
                            })
                          }
                          placeholder="Ej.: Vivienda unifamiliar — Gijón"
                        />
                      </div>
                      <div>
                        <label className="label">Cliente</label>
                        <input
                          className="field mt-1"
                          value={newProject.client}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              client: e.target.value,
                            })
                          }
                          placeholder="Nombre del cliente"
                        />
                      </div>
                      <div>
                        <label className="label">Usuario del cliente</label>
                        <input
                          className="field mt-1"
                          value={newProject.username}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              username: e.target.value,
                            })
                          }
                          placeholder="Ej.: cliente-garcia"
                        />
                      </div>
                      <button
                        disabled={portalBusy}
                        onClick={createProject}
                        className="w-full rounded-full bg-[var(--green)] py-3 font-extrabold text-white"
                      >
                        Crear proyecto
                      </button>
                    </div>
                    <div className="mt-6 border-t border-[var(--line)] pt-4">
                      <h4 className="font-bold">Lista de proyectos</h4>
                      <label>
                        <span className="label">
                          Buscar proyecto por nombre, cliente o fecha
                        </span>
                        <input
                          className="field mt-1"
                          value={projectSearch}
                          onChange={(e) => {
                            setProjectSearch(e.target.value);
                            setProjectPage(1);
                          }}
                          placeholder="Buscar proyecto…"
                        />
                      </label>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Mostrando{' '}
                        {Math.min(projectPage * PAGE_SIZE, projects.length)} de{' '}
                        {projects.length} proyectos · 20 por página.
                      </p>
                      <ul className="mt-3 space-y-2">
                        {projects
                          .filter(
                            (p) =>
                              !projectSearch ||
                              p.name
                                .toLowerCase()
                                .includes(projectSearch.toLowerCase()) ||
                              p.client
                                .toLowerCase()
                                .includes(projectSearch.toLowerCase())
                          )
                          .slice(0, projectPage * PAGE_SIZE)
                          .map((p) => (
                            <li
                              key={p.id}
                              className="flex items-center justify-between gap-2 rounded-xl bg-[var(--paper)] p-3 text-sm"
                            >
                              <span className="[overflow-wrap:anywhere]">
                                <b>{p.name}</b> · {p.client} · {p.username}
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedProjectId(p.id);
                                  setPortalTab('fotos');
                                }}
                                className="shrink-0 font-bold text-[var(--green)] underline"
                              >
                                Ver
                              </button>
                            </li>
                          ))}
                      </ul>
                      {projects.filter(
                        (p) =>
                          !projectSearch ||
                          p.name
                            .toLowerCase()
                            .includes(projectSearch.toLowerCase())
                      ).length >
                        projectPage * PAGE_SIZE && (
                        <button
                          onClick={() => setProjectPage((p) => p + 1)}
                          className="mt-3 w-full rounded-full border-2 border-[var(--ink)] py-3 font-extrabold"
                        >
                          Cargar más proyectos
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="card p-5">
                      <h3 className="flex items-center gap-2 font-display text-2xl">
                        <FolderPlus className="h-5 w-5" /> Carpetas del proyecto
                        activo
                      </h3>
                      <div className="mt-4 flex gap-2">
                        <input
                          className="field"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Ej.: Cimentación"
                        />
                        <button
                          disabled={portalBusy}
                          onClick={createFolder}
                          className="shrink-0 rounded-full bg-[var(--green)] px-4 py-3 font-extrabold text-white"
                        >
                          Crear
                        </button>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {visibleFolders.map((f) => (
                          <li
                            key={f.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--paper)] p-3 text-sm"
                          >
                            <span className="font-bold">{f.name}</span>
                            <span className="flex gap-2">
                              <button
                                onClick={() =>
                                  setRenameFolder({ id: f.id, name: f.name })
                                }
                                className="font-bold text-[var(--green)] underline"
                              >
                                Renombrar
                              </button>
                              <button
                                onClick={() => deleteFolderNow(f.id)}
                                className="font-bold text-red-700 underline"
                              >
                                Eliminar
                              </button>
                            </span>
                          </li>
                        ))}
                      </ul>
                      {renameFolder.id && (
                        <div className="mt-3 flex gap-2">
                          <input
                            className="field"
                            value={renameFolder.name}
                            onChange={(e) =>
                              setRenameFolder({
                                ...renameFolder,
                                name: e.target.value,
                              })
                            }
                          />
                          <button
                            onClick={renameFolderNow}
                            className="shrink-0 rounded-full bg-[var(--ink)] px-4 py-2 font-bold text-white"
                          >
                            Guardar nombre
                          </button>
                          <button
                            onClick={() =>
                              setRenameFolder({ id: '', name: '' })
                            }
                            className="shrink-0 font-bold underline"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="card p-5">
                      <h3 className="flex items-center gap-2 font-display text-2xl">
                        <ImagePlus className="h-5 w-5" /> Añadir foto a una
                        carpeta
                      </h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        Elige una foto de ejemplo de JABE para esta carpeta. La
                        subida de fotos desde el dispositivo no está disponible
                        todavía.
                      </p>
                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="label">Carpeta</label>
                          <select
                            className="field mt-1"
                            value={selectedFolderId}
                            onChange={(e) =>
                              setSelectedFolderId(e.target.value)
                            }
                          >
                            {visibleFolders.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label">Foto de ejemplo</label>
                          <select
                            className="field mt-1"
                            value={newPhoto.imageKey}
                            onChange={(e) =>
                              setNewPhoto({
                                ...newPhoto,
                                imageKey: e.target.value,
                              })
                            }
                          >
                            {exampleImages.map((i) => (
                              <option key={i.key} value={i.key}>
                                {i.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label">Pie de foto</label>
                          <input
                            className="field mt-1"
                            value={newPhoto.caption}
                            onChange={(e) =>
                              setNewPhoto({
                                ...newPhoto,
                                caption: e.target.value,
                              })
                            }
                            placeholder="Ej.: Estructura en montaje"
                          />
                        </div>
                        <button
                          disabled={portalBusy}
                          onClick={addPhoto}
                          className="w-full rounded-full bg-[var(--green)] py-3 font-extrabold text-white"
                        >
                          Añadir foto
                        </button>
                      </div>
                      <div className="mt-5 border-t border-[var(--line)] pt-4">
                        <h4 className="font-bold">Mover foto entre carpetas</h4>
                        <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                          <select
                            className="field"
                            value={movePhoto.photoId}
                            onChange={(e) =>
                              setMovePhoto({
                                ...movePhoto,
                                photoId: e.target.value,
                              })
                            }
                          >
                            <option value="">Elige una foto</option>
                            {visiblePhotos.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.caption}
                              </option>
                            ))}
                          </select>
                          <select
                            className="field"
                            value={movePhoto.folderId}
                            onChange={(e) =>
                              setMovePhoto({
                                ...movePhoto,
                                folderId: e.target.value,
                              })
                            }
                          >
                            <option value="">Carpeta destino</option>
                            {visibleFolders.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={movePhotoNow}
                            className="rounded-full bg-[var(--copper)] px-4 py-3 font-extrabold text-white"
                          >
                            Mover
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          También puedes eliminar una foto desde la pestaña
                          Fotografías.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {portalTab === 'webadmin' && isAdmin && (
                <section className="mt-4 space-y-5">
                  <div className="rounded-[22px] border-2 border-[var(--copper)] bg-[var(--soft)] p-5">
                    <p className="font-bold text-[var(--copper)]">
                      Solo tú como administrador ves este panel.
                    </p>
                    <p className="mt-1 text-sm leading-6">
                      Este Panel de Administración de la Web solo está dentro
                      del portal del administrador. Nadie sin iniciar sesión
                      puede verlo ni cambiar precios o textos. La web pública
                      solo muestra los valores que guardes aquí.
                    </p>
                  </div>
                  <div className="card p-5">
                    <h3 className="font-display text-2xl">Uso y rendimiento</h3>
                    <p className="mt-2 text-sm leading-6">
                      <b>{photos.length} fotos</b>,{' '}
                      <b>{docs.length} documentos</b>,{' '}
                      <b>
                        {(photos.length * 0.35 + docs.length * 0.9).toFixed(1)}{' '}
                        MB usados
                      </b>{' '}
                      (estimación con fotos comprimidas) · {projects.length}{' '}
                      proyectos · {parts.length} partes · {pendingPhotos.length}{' '}
                      fotos pendientes
                    </p>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--line)]">
                      <div
                        className="h-full rounded-full bg-[var(--green)]"
                        style={{
                          width: `${Math.min(
                            100,
                            ((photos.length * 0.35 + docs.length * 0.9) / 50) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                    {photos.length * 0.35 + docs.length * 0.9 > 40 && (
                      <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900">
                        Aviso: te acercas al límite orientativo. Revisa fotos y
                        documentos antiguos antes de añadir más.
                      </p>
                    )}
                    <p className="mt-2 text-xs text-[var(--muted)]">
                      Las listas usan paginación de 20 por página, búsqueda y
                      carga perezosa. Solo se carga la carpeta seleccionada.
                    </p>
                  </div>
                  <div className="card p-5 sm:p-6">
                    <h3 className="font-display text-2xl">
                      Panel de Administración de la Web
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Todo en lenguaje sencillo. Cambia un campo, pulsa{' '}
                      <b>Guardar cambios</b> y la web se actualiza.
                    </p>
                    <div className="mt-5 space-y-4">
                      <div>
                        <label className="label">Titular principal</label>
                        <textarea
                          className="field mt-1"
                          rows={2}
                          value={cfg.heroTitle}
                          onChange={(e) => change('heroTitle', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label">Texto principal</label>
                        <textarea
                          className="field mt-1"
                          rows={2}
                          value={cfg.heroSub}
                          onChange={(e) => change('heroSub', e.target.value)}
                        />
                      </div>
                      <div className="rounded-xl bg-[var(--soft)] p-4">
                        <p className="label">
                          Precios tradicionales · Obra nueva · según calidad
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div>
                            <label className="label">Baja €/m²</label>
                            <input
                              className="field mt-1"
                              type="number"
                              value={cfg.tradLow}
                              onChange={(e) =>
                                change('tradLow', +e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="label">Media €/m²</label>
                            <input
                              className="field mt-1"
                              type="number"
                              value={cfg.tradMid}
                              onChange={(e) =>
                                change('tradMid', +e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="label">Alta €/m²</label>
                            <input
                              className="field mt-1"
                              type="number"
                              value={cfg.tradHigh}
                              onChange={(e) =>
                                change('tradHigh', +e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-[var(--muted)]">
                          Valores de partida: 2.000 / 2.100 / 2.200. JABE =
                          tradicional según calidad − ahorro estimado.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="label">
                            Precio reformas (€/m²)
                          </label>
                          <input
                            className="field mt-1"
                            type="number"
                            value={cfg.basePrice}
                            onChange={(e) =>
                              change('basePrice', +e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="label">Ahorro mínimo %</label>
                          <input
                            className="field mt-1"
                            type="number"
                            value={cfg.compareMin}
                            onChange={(e) =>
                              change('compareMin', +e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="label">Ahorro máximo %</label>
                          <input
                            className="field mt-1"
                            type="number"
                            value={cfg.compareMax}
                            onChange={(e) =>
                              change('compareMax', +e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="label">Tiempo JABE</label>
                          <input
                            className="field mt-1"
                            value={cfg.housingTime}
                            onChange={(e) =>
                              change('housingTime', e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="rounded-xl bg-[var(--soft)] p-4">
                        <p className="label">
                          Ajuste por calidad · Reformas y otras líneas
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <div>
                            <label className="label">Estándar ×</label>
                            <input
                              className="field mt-1"
                              type="number"
                              step="0.01"
                              value={cfg.reformFactorStandard}
                              onChange={(e) =>
                                change('reformFactorStandard', +e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="label">Media ×</label>
                            <input
                              className="field mt-1"
                              type="number"
                              step="0.01"
                              value={cfg.reformFactorMedia}
                              onChange={(e) =>
                                change('reformFactorMedia', +e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label className="label">Premium ×</label>
                            <input
                              className="field mt-1"
                              type="number"
                              step="0.01"
                              value={cfg.reformFactorPremium}
                              onChange={(e) =>
                                change('reformFactorPremium', +e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="label">Plazo vivienda</label>
                        <input
                          className="field mt-1"
                          value={cfg.housingDeadline}
                          onChange={(e) =>
                            change('housingDeadline', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="label">Plazo aseo</label>
                        <input
                          className="field mt-1"
                          value={cfg.bathroomDeadline}
                          onChange={(e) =>
                            change('bathroomDeadline', e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="label">Plazo cocina</label>
                        <input
                          className="field mt-1"
                          value={cfg.kitchenDeadline}
                          onChange={(e) =>
                            change('kitchenDeadline', e.target.value)
                          }
                        />
                      </div>
                      <div className="rounded-xl bg-[var(--soft)] p-4">
                        <p className="label">Vista previa · Página inicial</p>
                        <p className="mt-2 text-sm font-bold [overflow-wrap:anywhere]">
                          Así se verá en la página inicial: Tel:{' '}
                          {show(cfg.phone, '[Teléfono]')} | Email:{' '}
                          {show(cfg.email, '[Email]')} | Dirección:{' '}
                          {showAddress()}
                        </p>
                        <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                          Tel. secundario / WhatsApp: {show(cfg.phone2, '—')} ·
                          Presupuestos a:{' '}
                          {show(cfg.budgetEmail, '[Email para presupuestos]')} ·
                          Horario: {show(cfg.hours, '—')}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                          Si algún campo está vacío, se muestra [Teléfono] /
                          [Email] como aviso, no se deja en blanco. El email de
                          presupuestos puede ser distinto al visible: las
                          calculadoras y “Pedir presupuesto” enviarán a ese
                          email.
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--line)] p-4">
                        <p className="label">Datos de contacto configurables</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="label">
                              Email visible en la web
                            </label>
                            <input
                              className="field mt-1"
                              value={cfg.email}
                              onChange={(e) => change('email', e.target.value)}
                              placeholder="[Email]"
                            />
                          </div>
                          <div>
                            <label className="label">
                              Email para recibir presupuestos
                            </label>
                            <input
                              className="field mt-1"
                              value={cfg.budgetEmail}
                              onChange={(e) =>
                                change('budgetEmail', e.target.value)
                              }
                              placeholder="[Email para presupuestos]"
                            />
                          </div>
                          <div>
                            <label className="label">Teléfono principal</label>
                            <input
                              className="field mt-1"
                              value={cfg.phone}
                              onChange={(e) => change('phone', e.target.value)}
                              placeholder="[Teléfono]"
                            />
                          </div>
                          <div>
                            <label className="label">
                              Teléfono secundario / WhatsApp (opcional)
                            </label>
                            <input
                              className="field mt-1"
                              value={cfg.phone2}
                              onChange={(e) => change('phone2', e.target.value)}
                              placeholder="Opcional"
                            />
                          </div>
                          <div>
                            <label className="label">Dirección · Línea 1</label>
                            <input
                              className="field mt-1"
                              value={cfg.addressLine1}
                              onChange={(e) =>
                                change('addressLine1', e.target.value)
                              }
                              placeholder="Calle y número"
                            />
                          </div>
                          <div>
                            <label className="label">Ciudad</label>
                            <input
                              className="field mt-1"
                              value={cfg.addressCity}
                              onChange={(e) =>
                                change('addressCity', e.target.value)
                              }
                              placeholder="Gijón, Asturias"
                            />
                          </div>
                          <div>
                            <label className="label">Código postal</label>
                            <input
                              className="field mt-1"
                              value={cfg.addressPostal}
                              onChange={(e) =>
                                change('addressPostal', e.target.value)
                              }
                              placeholder="Código postal"
                            />
                          </div>
                          <div>
                            <label className="label">Horario de atención</label>
                            <input
                              className="field mt-1"
                              value={cfg.hours}
                              onChange={(e) => change('hours', e.target.value)}
                              placeholder="Lunes a viernes · 9:00–18:00"
                            />
                          </div>
                        </div>
                        <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                          Pulsa “Guardar cambios” abajo para guardar estos datos
                          en la base de datos y aplicarlos en vivo a la web.
                          “Restablecer valores” vuelve a los valores de partida.
                        </p>
                      </div>
                      <div>
                        <label className="label">Teléfono</label>
                        <input
                          className="field mt-1"
                          value={cfg.phone}
                          onChange={(e) => change('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label">Email</label>
                        <input
                          className="field mt-1"
                          value={cfg.email}
                          onChange={(e) => change('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label">Nota legal</label>
                        <textarea
                          className="field mt-1"
                          rows={2}
                          value={cfg.legal}
                          onChange={(e) => change('legal', e.target.value)}
                        />
                      </div>
                    </div>
                    {saveState && (
                      <p className="mt-4 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold">
                        {saveState}
                      </p>
                    )}
                    <div className="mt-5 grid gap-2">
                      <button
                        onClick={commit}
                        className="rounded-full bg-[var(--green)] py-3 font-extrabold text-white"
                      >
                        Guardar cambios
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={reset}
                          className="flex items-center justify-center gap-2 rounded-full border py-3 font-bold"
                        >
                          <RotateCcw className="h-4 w-4" /> Restablecer valores
                        </button>
                        <button
                          onClick={() =>
                            copyText(
                              JSON.stringify(cfg, null, 2),
                              'Configuración copiada'
                            )
                          }
                          className="rounded-full border py-3 font-bold"
                        >
                          Exportar configuración (copiar)
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {portalTab === 'chat' && !isAdmin && !isEmployee && (
                <section className="mt-4">
                  <div className="card p-5 sm:p-6">
                    <h3 className="font-display text-2xl">💬 Chat con JABE</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Habla con JABE sobre tu proyecto:{' '}
                      <b>{visibleProject?.name}</b>. Solo tú ves este chat.
                      Escribe y pulsa Enviar o pulsa Enter.
                    </p>
                    {chatAlert && (
                      <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold text-[var(--green)]">
                        {chatAlert}
                      </p>
                    )}
                    {chatNotice && (
                      <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold text-[var(--green)]">
                        {chatNotice}
                      </p>
                    )}
                    <div className="mt-4 space-y-3" aria-live="polite">
                      {clientChatMessages.length === 0 && (
                        <p className="rounded-xl border p-4 text-sm text-[var(--muted)]">
                          Todavía no hay mensajes. Escribe el primero: JABE te
                          responderá aquí.
                        </p>
                      )}
                      {clientChatMessages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${
                            m.sender === 'cliente'
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              m.sender === 'cliente'
                                ? 'bg-[var(--green)] text-white'
                                : 'bg-[var(--soft)]'
                            }`}
                          >
                            <p className="text-xs font-extrabold">
                              {m.sender === 'cliente' ? 'Tú' : 'JABE'}
                            </p>
                            <p className="mt-1 text-sm leading-6 [overflow-wrap:anywhere]">
                              {m.text}
                            </p>
                            <p
                              className={`mt-1 text-right text-xs ${
                                m.sender === 'cliente'
                                  ? 'text-white/70'
                                  : 'text-[var(--muted)]'
                              }`}
                            >
                              {m.time}
                            </p>
                          </div>
                        </div>
                      ))}
                      {chatTyping && (
                        <p className="text-sm italic text-[var(--muted)]">
                          JABE está escribiendo…
                        </p>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        aria-label="Escribe tu mensaje para JABE"
                        className="field"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            sendChat();
                          }
                        }}
                        placeholder="Escribe tu mensaje…"
                      />
                      <button
                        disabled={chatBusy || !chatInput.trim()}
                        onClick={sendChat}
                        className="shrink-0 rounded-full bg-[var(--green)] px-6 py-3 font-extrabold text-white"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </section>
              )}
              {portalTab === 'chats' && isAdmin && (
                <section className="mt-4 space-y-4">
                  <div className="card p-5">
                    <h3 className="font-display text-2xl">
                      💬 Chats de clientes
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      Solo el administrador ve todos los chats. Cada cliente
                      solo ve el suyo. Los empleados no ven estos chats.
                    </p>
                    {chatAlert && (
                      <p className="mt-3 animate-pulse rounded-xl bg-red-50 p-3 text-sm font-extrabold text-red-700">
                        {chatAlert}
                      </p>
                    )}
                    {chatNotice && (
                      <p className="mt-3 rounded-xl bg-[var(--soft)] p-3 text-sm font-bold text-[var(--green)]">
                        {chatNotice}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 lg:grid-cols-[.9fr_1.1fr]">
                    <div className="card p-4">
                      <h4 className="font-bold">
                        Chats por cliente / proyecto · {adminChats.length}
                      </h4>
                      {adminChats.length === 0 && (
                        <p className="mt-3 text-sm text-[var(--muted)]">
                          Todavía no hay mensajes de clientes. Cuando un cliente
                          escriba, su chat subirá arriba con aviso y badge rojo.
                        </p>
                      )}
                      <div className="mt-3 space-y-2">
                        {adminChats.map((c) => (
                          <button
                            key={c.project?.id || c.last.projectId}
                            onClick={() => {
                              setAdminChatProjectId(c.last.projectId);
                              setChatAlert('');
                            }}
                            className={`w-full rounded-2xl border p-4 text-left ${
                              adminChatProjectId === c.last.projectId
                                ? 'border-[var(--copper)] bg-[var(--soft)]'
                                : 'border-[var(--line)]'
                            }`}
                          >
                            <span className="flex items-start justify-between gap-2">
                              <b className="[overflow-wrap:anywhere]">
                                {c.project?.client || c.last.senderName} —{' '}
                                {c.project?.name || 'Proyecto'}
                              </b>
                              {c.unread > 0 && (
                                <span className="inline-flex h-6 min-w-[24px] animate-pulse items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-extrabold text-white">
                                  {c.unread}
                                </span>
                              )}
                            </span>
                            <span className="mt-1 block truncate text-sm text-[var(--muted)]">
                              {c.last.sender === 'cliente'
                                ? 'Cliente: '
                                : 'JABE: '}
                              {c.last.text}
                            </span>
                            <span className="mt-1 block text-xs text-[var(--muted)]">
                              {c.last.time}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="card p-4 sm:p-5">
                      {!adminChatProjectId ? (
                        <p className="text-sm text-[var(--muted)]">
                          Elige un chat de la lista para leer y responder.
                        </p>
                      ) : (
                        <>
                          <h4 className="font-bold [overflow-wrap:anywhere]">
                            {
                              projects.find((p) => p.id === adminChatProjectId)
                                ?.name
                            }
                          </h4>
                          <p className="text-xs text-[var(--muted)]">
                            Cliente:{' '}
                            {
                              projects.find((p) => p.id === adminChatProjectId)
                                ?.client
                            }
                          </p>
                          <div className="mt-4 space-y-3" aria-live="polite">
                            {adminActiveChatMessages.length === 0 && (
                              <p className="rounded-xl border p-4 text-sm text-[var(--muted)]">
                                Sin mensajes en este chat.
                              </p>
                            )}
                            {adminActiveChatMessages.map((m) => (
                              <div
                                key={m.id}
                                className={`flex ${
                                  m.sender === 'admin'
                                    ? 'justify-end'
                                    : 'justify-start'
                                }`}
                              >
                                <div
                                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                    m.sender === 'admin'
                                      ? 'bg-[var(--copper)] text-white'
                                      : 'bg-[var(--soft)]'
                                  }`}
                                >
                                  <p className="text-xs font-extrabold">
                                    {m.sender === 'admin'
                                      ? 'Tú · JABE'
                                      : m.senderName || 'Cliente'}
                                  </p>
                                  <p className="mt-1 text-sm leading-6 [overflow-wrap:anywhere]">
                                    {m.text}
                                  </p>
                                  <p
                                    className={`mt-1 text-right text-xs ${
                                      m.sender === 'admin'
                                        ? 'text-white/70'
                                        : 'text-[var(--muted)]'
                                    }`}
                                  >
                                    {m.time}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {chatTyping && (
                              <p className="text-sm italic text-[var(--muted)]">
                                El cliente está escribiendo…
                              </p>
                            )}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <input
                              aria-label="Escribe tu respuesta al cliente"
                              className="field"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  sendChat();
                                }
                              }}
                              placeholder="Escribe tu respuesta…"
                            />
                            <button
                              disabled={chatBusy || !chatInput.trim()}
                              onClick={sendChat}
                              className="shrink-0 rounded-full bg-[var(--copper)] px-6 py-3 font-extrabold text-white"
                            >
                              Enviar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </section>
              )}
              <p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">
                Portal de demostración. Proyectos, carpetas, fotos de ejemplo y
                documentos registrados se guardan en la base de datos de la app
                cuando está disponible. La subida de archivos no está disponible
                todavía.
              </p>
            </div>
          </div>
        </div>
      )}
      {manualOpen === 'admin' && isAdmin && (
        <ManualOverlay
          title="Manual del Administrador"
          roleLabel="Administrador"
          intro="Manual paso a paso, en lenguaje sencillo, para trabajar como administrador sin saber código. Lee primero el apartado que necesites y sigue los pasos en orden."
          sections={adminManual}
          fileName="manual-administrador-jabe.txt"
          onClose={() => setManualOpen(null)}
        />
      )}
      {manualOpen === 'cliente' && user?.role === 'cliente' && (
        <ManualOverlay
          title="Mi Manual — Cliente"
          roleLabel="Cliente"
          intro="Manual paso a paso, en lenguaje sencillo, para ver tu proyecto, tus fotos y tu documentación sin perderte."
          sections={clientManual}
          fileName="manual-cliente-jabe.txt"
          onClose={() => setManualOpen(null)}
        />
      )}
      {manualOpen === 'empleado' && isEmployee && (
        <ManualOverlay
          title="Mi Manual — Empleado"
          roleLabel="Empleado"
          intro="Manual paso a paso, en lenguaje sencillo, para elegir tu obra, subir fotos y rellenar tu parte diario."
          sections={employeeManual}
          fileName="manual-empleado-jabe.txt"
          onClose={() => setManualOpen(null)}
        />
      )}
      <textarea
        ref={copyRef}
        className="sr-only"
        aria-hidden="true"
        value={JSON.stringify(cfg)}
        readOnly
      />{' '}
    </div>
  );
}
