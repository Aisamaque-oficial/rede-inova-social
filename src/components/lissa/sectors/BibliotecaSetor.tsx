"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authoralMaterials, AuthoralMaterial } from "@/lib/mock-data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Download, Play } from "lucide-react";
import { MaterialReader } from "@/components/material-reader";
import { dataService } from "@/lib/data-service";
import { supabaseActivity } from "@/lib/supabase-activity";

interface BibliotecaSetorProps {
  isStudio: boolean;
}

export default function BibliotecaSetor({ isStudio }: BibliotecaSetorProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<AuthoralMaterial | null>(null);

  useEffect(() => {
    const user = dataService.getCurrentUser();
    if (user) {
      supabaseActivity.logActivity({
        user_id: user.id,
        user_name: user.name,
        user_sector: user.activeSector || 'LISSA',
        sector_name: 'Biblioteca de Saberes',
        last_online: new Date().toISOString(),
        session_duration: 0
      });
    }
  }, []);

  const getMaterialImage = (imagePlaceholderId: string | undefined) => {
    if (!imagePlaceholderId) return null;
    return PlaceHolderImages.find((img) => img.id === imagePlaceholderId);
  };

  return (
    <>
      <div className="animate-in fade-in slide-in-from-right-8 duration-1000 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {authoralMaterials.map((material) => {
          const itemImage = getMaterialImage(material.imagePlaceholderId);
          return (
            <Card key={material.id} className="flex flex-col h-full hover:shadow-2xl transition-all group rounded-[3rem] overflow-hidden border-none bg-white shadow-xl ring-1 ring-black/5">
              {itemImage && (
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image src={itemImage.imageUrl} alt={material.title} fill className="object-cover group-hover:rotate-2 group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-5 rounded-3xl shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                      <Download className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
              )}
              <CardHeader className="p-8 pb-4">
                <Badge className="w-fit mb-4 bg-primary/5 text-primary border-none font-black text-[9px] uppercase tracking-widest">{material.id.split('-')[0]}</Badge>
                <CardTitle className="text-2xl font-black leading-tight text-primary tracking-tighter">
                  {material.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-8 flex-1">
                <div className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-3 italic">
                  "{material.description}"
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-4">
                <Button 
                  className="w-full rounded-2xl h-14 font-black uppercase tracking-tighter bg-primary text-white shadow-lg hover:shadow-primary/20 gap-3"
                  onClick={() => setSelectedMaterial(material)}
                >
                  <Play className="h-5 w-5" />
                  Ler Agora (Acessível)
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedMaterial && (
        <MaterialReader 
          material={selectedMaterial} 
          onClose={() => setSelectedMaterial(null)} 
        />
      )}
    </>
  );
}
