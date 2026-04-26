"use client";

import React from "react";
import SectorDynamicPage from "../setor/[id]/page";

/**
 * Página da ASCOM refatorada para usar o motor dinâmico universal.
 * Mantemos esta rota por compatibilidade, mas ela consome o mesmo 
 * componente de alta performance dos demais setores.
 */
export default function AscomPageWrapper() {
  // Forçamos o ID da ASCOM para renderizar o componente universal
  return <SectorDynamicPage forcedId="ascom" />;
}
