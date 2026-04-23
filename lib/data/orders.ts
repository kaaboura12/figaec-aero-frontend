import type { Order, Priority } from "@/types/orders";
import type { OFStatus } from "@/types/dashboard";

const TEMPLATES = [
  { article: "A320-DOOR-FRAME",     designation: "Cadre de porte A320",       dept: "TOL_T", ws: "MACH_TOL_01",  op: "Usinage",    chain: "AIRBUS" },
  { article: "B737-WING-RIB",       designation: "Ailette d'aile B737",        dept: "ALU_T", ws: "ALU_MILL_02",  op: "Fraisage",   chain: "BOEING" },
  { article: "A320-FUSELAGE-PANEL", designation: "Panneau fuselage A320",      dept: "SUP_T", ws: "ASSEMBLY_03", op: "Assemblage", chain: "AIRBUS" },
  { article: "B787-DOOR-ASSY",      designation: "Ensemble porte B787",        dept: "TOL_T", ws: "MACH_TOL_02",  op: "Perçage",    chain: "BOEING" },
  { article: "A321-TAIL-CONE",      designation: "Cône arrière A321",          dept: "TOL_T", ws: "FORM_TOL_01",  op: "Formage",    chain: "AIRBUS" },
  { article: "A350-BRACKET",        designation: "Support A350",               dept: "TOL_T", ws: "MACH_TOL_03",  op: "Usinage",    chain: "AIRBUS" },
  { article: "A320-DOOR-HINGE",     designation: "Charnière de porte A320",    dept: "SUP_T", ws: "TRAIT_01",     op: "Traitement", chain: "AIRBUS" },
  { article: "B737-FLOOR-BEAM",     designation: "Poutre de plancher B737",    dept: "ALU_T", ws: "RIVET_02",     op: "Rivetage",   chain: "BOEING" },
  { article: "A330-WING-BOX",       designation: "Caisson d'aile A330",        dept: "ALU_T", ws: "ASSEMBLY_02",  op: "Assemblage", chain: "AIRBUS" },
  { article: "A321-ENGINE-MOUNT",   designation: "Support moteur A321",        dept: "TOL_T", ws: "MACH_TOL_01",  op: "Usinage",    chain: "AIRBUS" },
  { article: "B787-FUSELAGE-FRAME", designation: "Cadre fuselage B787",        dept: "TOL_T", ws: "MACH_TOL_03",  op: "Fraisage",   chain: "BOEING" },
  { article: "A320-WING-SPAR",      designation: "Longeron aile A320",         dept: "ALU_T", ws: "ALU_MILL_01",  op: "Usinage",    chain: "AIRBUS" },
  { article: "A350-NACELLE-RIB",    designation: "Nervure nacelle A350",       dept: "PRO_T", ws: "FORM_TOL_01",  op: "Formage",    chain: "AIRBUS" },
  { article: "B737-KEEL-BEAM",      designation: "Poutre quille B737",         dept: "TOL_T", ws: "MACH_TOL_02",  op: "Usinage",    chain: "BOEING" },
  { article: "A321-RUDDER-HINGE",   designation: "Charnière gouvernail A321",  dept: "MD_T",  ws: "RIVET_01",     op: "Rivetage",   chain: "AIRBUS" },
  { article: "A330-STRINGER",       designation: "Lisse A330",                 dept: "ALU_T", ws: "ALU_MILL_01",  op: "Fraisage",   chain: "AIRBUS" },
  { article: "B787-WINDOW-FRAME",   designation: "Cadre de hublot B787",       dept: "MD_T",  ws: "MACH_TOL_01",  op: "Usinage",    chain: "BOEING" },
  { article: "A320-SPOILER-BRACKET",designation: "Support spoiler A320",       dept: "TOL_T", ws: "MACH_TOL_03",  op: "Fraisage",   chain: "AIRBUS" },
  { article: "A350-PYLON-FITTING",  designation: "Ferrure pylône A350",        dept: "PRO_T", ws: "ASSEMBLY_01",  op: "Assemblage", chain: "AIRBUS" },
  { article: "B737-EMPENNAGE-RIB",  designation: "Nervure empennage B737",     dept: "ALU_T", ws: "ALU_MILL_02",  op: "Fraisage",   chain: "BOEING" },
] as const;

const STATUSES: OFStatus[]  = ["En cours", "En cours", "En cours", "En retard", "En attente"];
const PRIORITIES: Priority[] = ["Normale", "Normale", "Haute", "Basse", "Normale"];
const DELAYS_FOR_LATE = [1, 2, 3, 4, 5, 2, 1, 3];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function generateOrders(count: number): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const tmpl = TEMPLATES[i % TEMPLATES.length];
    const status: OFStatus = STATUSES[i % STATUSES.length];
    const priority: Priority = PRIORITIES[i % PRIORITIES.length];

    const day = pad(15 + (i % 15));
    const month = pad(5 + Math.floor(i / 30));
    const projectedEndDate = `${day}/${month}/2024`;

    const delay =
      status === "En retard"
        ? DELAYS_FOR_LATE[i % DELAYS_FOR_LATE.length]
        : status === "En cours" && i % 11 === 0
          ? -1
          : 0;

    const plannedQty = 5 + (i % 20);
    const remainingQty =
      status === "Terminé"
        ? 0
        : status === "En attente"
          ? plannedQty
          : Math.max(1, Math.floor(plannedQty * (0.2 + (i % 8) * 0.1)));

    return {
      ofNumber: `OF2405-${12345 - i}`,
      article: tmpl.article,
      designation: tmpl.designation,
      department: tmpl.dept,
      workstation: tmpl.ws,
      currentOperation: tmpl.op,
      status,
      plannedQty,
      remainingQty,
      projectedEndDate,
      delay,
      priority,
      productionChain: tmpl.chain,
    };
  });
}

export const MOCK_ORDERS: Order[] = generateOrders(100);

export const TOTAL_OF_COUNT = 7941;

export const ALL_DEPARTMENTS = ["TOL_T", "ALU_T", "SUP_T", "PRO_T", "MD_T"];

export const ALL_WORKSTATIONS = [
  "ALU_MILL_01", "ALU_MILL_02",
  "ASSEMBLY_01", "ASSEMBLY_02", "ASSEMBLY_03",
  "FORM_TOL_01",
  "MACH_TOL_01", "MACH_TOL_02", "MACH_TOL_03",
  "RIVET_01", "RIVET_02",
  "TRAIT_01",
];

export const ALL_CHAINS = ["AIRBUS", "BOEING"];
