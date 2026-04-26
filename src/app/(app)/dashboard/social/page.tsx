"use client";

import { OperationalDashboardLayout } from "@/components/operational-dashboard-layout";
import { SocialMappingBoard } from "@/components/social-mapping-board";
import { Users2, MapPin, ClipboardList, Target } from "lucide-react";

export default function SocialDashboardPage() {
  const stats = [
    { label: "Lideranças", value: "48", icon: Users2, color: "text-orange-500" },
    { label: "Municípios", value: "08/13", icon: MapPin, color: "text-primary" },
    { label: "Escutas", value: "32", icon: ClipboardList, color: "text-emerald-500" },
    { label: "Meta Mês", value: "65%", icon: Target, color: "text-violet-500" },
  ];

  return (
    <OperationalDashboardLayout
      title="Painel Social & Territorial"
      subtitle="Gestão de campo, articulação e diagnósticos regionais"
      sector="SOCIAL"
      stats={stats}
    >
      <SocialMappingBoard />
    </OperationalDashboardLayout>
  );
}
