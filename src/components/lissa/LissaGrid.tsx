"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { LucideIcon } from "lucide-react";

interface Station {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

interface LissaGridProps {
  stations: Station[];
  hoveredStation: string | null;
  setHoveredStation: (id: string | null) => void;
  setActiveStation: (id: string) => void;
  isStudio: boolean;
}

export function LissaGrid({ 
  stations, 
  hoveredStation, 
  setHoveredStation, 
  setActiveStation, 
  isStudio 
}: LissaGridProps) {
  return (
    <div className="relative w-full max-w-5xl aspect-[16/10] md:aspect-[21/9] flex items-center justify-center">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 w-full px-4">
        {stations.map((station, index) => (
          <motion.div
            key={station.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            onMouseEnter={() => setHoveredStation(station.id)}
            onMouseLeave={() => setHoveredStation(null)}
            onClick={() => setActiveStation(station.id)}
            className="group cursor-pointer flex flex-col items-center"
          >
            <motion.div 
              whileHover={{ y: -15, scale: 1.1 }}
              className={`w-28 h-28 md:w-36 md:h-36 rounded-[2.5rem] ${station.color} flex items-center justify-center text-white shadow-2xl relative transition-all duration-500 overflow-hidden group-hover:ring-[12px] group-hover:ring-primary/5`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <station.icon className="h-12 w-12 md:h-16 md:w-16 drop-shadow-lg group-hover:rotate-12 transition-transform duration-500" />
            </motion.div>
            
            <div className="mt-6 text-center">
              <CMSPageRenderer 
                pageId={`lab_station_${station.id}_meta`}
                isStudio={isStudio}
                defaultBlocks={[
                  { id: `lab_station_${station.id}_label`, type: 'text', content: station.label }
                ]}
              />
              <AnimatePresence>
                {hoveredStation === station.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-[10px] text-muted-foreground max-w-[140px] mt-2 font-bold leading-tight"
                  >
                    {station.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
