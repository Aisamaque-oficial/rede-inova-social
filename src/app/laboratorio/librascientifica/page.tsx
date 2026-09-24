import { Metadata } from "next";
import LibrasCientificaClient from "./LibrasCientificaClient";

export const metadata: Metadata = {
  title: "Libras Científica | LISSA - Rede Inova Social",
  description: "Núcleo de Libras na Segurança Alimentar do LISSA. Glossário científico em Língua Brasileira de Sinais, vídeos do Minuto do Conhecimento e trilhas formativas de aprendizagem.",
  keywords: ["Libras", "Libras Científica", "Segurança Alimentar", "LISSA", "Rede Inova Social", "Acessibilidade", "Glossário Libras"],
  openGraph: {
    title: "Libras Científica | Laboratório LISSA",
    description: "Núcleo de Libras na Segurança Alimentar. Letramento científico e inclusão linguística na Rede Inova Social.",
    type: "website",
  }
};

export default function LibrasCientificaPage() {
  return <LibrasCientificaClient />;
}
