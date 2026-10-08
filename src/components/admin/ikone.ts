import { BookOpen, CircleHelp, FileText, Gavel, Megaphone, RadioTower, Settings, Tv, Users, type LucideIcon } from "lucide-react";
import type { Kolekcija } from "@/cms/kolekcije";

export const IKONE: Record<Kolekcija["ikona"], LucideIcon> = {
  nabavke: Gavel,
  dokumenti: FileText,
  obavijesti: Megaphone,
  emisije: Tv,
  pitanja: CircleHelp,
  tekstovi: BookOpen,
  kontakti: Users,
  frekvencije: RadioTower,
  postavke: Settings,
};
