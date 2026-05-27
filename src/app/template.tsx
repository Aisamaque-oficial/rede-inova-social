"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Se estivermos em uma rota interna (dashboard), não aplicaremos a transição
  const isInternalArea = 
    pathname?.startsWith('/dashboard') || 
    pathname?.startsWith('/painel') || 
    pathname?.startsWith('/studio') || 
    pathname?.startsWith('/planejamento') || 
    pathname?.startsWith('/gerenciar') || 
    pathname?.startsWith('/documentos') ||
    pathname?.startsWith('/minhas-tarefas') ||
    pathname?.startsWith('/atividades') ||
    pathname?.startsWith('/registro-publico');

  if (isInternalArea) {
      return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ x: 30, opacity: 0, filter: "blur(4px)" }}
      animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
      exit={{ x: -30, opacity: 0, filter: "blur(4px)" }}
      transition={{ 
        duration: 0.4, 
        ease: "easeInOut"
      }}
      className="flex flex-col min-h-screen w-full"
    >
      {children}
    </motion.div>
  );
}
