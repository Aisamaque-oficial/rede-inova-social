"use client";

import React, { useState, useEffect } from "react";
import { PartnershipsBoard } from "@/components/partnerships-board";
import { dataService } from "@/lib/data-service";
import { ProjectTask } from "@/lib/mock-data";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ParceriasPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
         <Loader2 className="h-12 w-12 animate-spin text-cyan-500 opacity-20" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <PartnershipsBoard />
    </div>
  );
}
