import { Metadata } from "next";
import MetricasTerritorioClient from "./client-page";

export const metadata: Metadata = {
  title: "Métricas do Território | Rede Inova Social",
  description: "Dashboard de Inteligência e Métricas do Território",
};

export default function MetricasTerritorioPage() {
  return <MetricasTerritorioClient />;
}
