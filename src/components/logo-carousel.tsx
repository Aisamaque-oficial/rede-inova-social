"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supporterLogos } from "@/lib/supporter-logos";

export default function LogoCarousel() {
  // Duplicate the logos for a seamless scrolling effect
  const logos = [...supporterLogos, ...supporterLogos];

  return (
    <section className="w-full py-12 bg-secondary/50">
      <div className="container text-center">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-8">
          Apoiadores
        </h2>
        <div 
          className="relative w-full overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
        >
          <div className="flex animate-scroll hover:pause-animation">
            {logos.map((logo, index) => (
              <div key={`${logo.id}-${index}`} className="flex-shrink-0 px-8 py-4">
                 <Dialog>
                  <DialogTrigger asChild>
                    <button className="h-20 flex items-center justify-center">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={180}
                        height={72}
                        className="object-contain h-20 w-auto max-w-[180px] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                      />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-transparent border-0 shadow-none flex items-center justify-center p-0">
                    <DialogHeader>
                      <DialogTitle className="sr-only">Logotipo do Apoiador: {logo.alt}</DialogTitle>
                    </DialogHeader>
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={500}
                      height={300}
                      className="object-contain rounded-lg max-w-[80vw] max-h-[80vh]"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
