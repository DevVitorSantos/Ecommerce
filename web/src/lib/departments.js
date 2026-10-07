// Cores por departamento (padrão Nexus: pill colorida por categoria)
const DEPTS = {
  Tech: { badge: "bg-sky-100 text-sky-800", soft: "bg-sky-50", text: "text-sky-700", icon: "💻" },
  Pets: { badge: "bg-emerald-100 text-emerald-800", soft: "bg-emerald-50", text: "text-emerald-700", icon: "🐾" },
  Beleza: { badge: "bg-rose-100 text-rose-800", soft: "bg-rose-50", text: "text-rose-700", icon: "💄" },
  Snacks: { badge: "bg-amber-100 text-amber-800", soft: "bg-amber-50", text: "text-amber-700", icon: "🍿" },
  Bebidas: { badge: "bg-cyan-100 text-cyan-800", soft: "bg-cyan-50", text: "text-cyan-700", icon: "🥤" },
  Casa: { badge: "bg-violet-100 text-violet-800", soft: "bg-violet-50", text: "text-violet-700", icon: "🏠" },
  Fitness: { badge: "bg-lime-100 text-lime-800", soft: "bg-lime-50", text: "text-lime-700", icon: "🏋️" },
  Brinquedos: { badge: "bg-fuchsia-100 text-fuchsia-800", soft: "bg-fuchsia-50", text: "text-fuchsia-700", icon: "🧸" },
  "Bem-estar": { badge: "bg-teal-100 text-teal-800", soft: "bg-teal-50", text: "text-teal-700", icon: "🧘" },
};

const FALLBACK = { badge: "bg-indigo-100 text-indigo-800", soft: "bg-indigo-50", text: "text-indigo-700", icon: "🏷️" };

export function deptStyle(category) {
  return DEPTS[category] || FALLBACK;
}
