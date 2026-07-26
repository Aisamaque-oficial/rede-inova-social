import React from 'react';
import Link from 'next/link';
import { TERRITORY_CITIES } from '@/lib/territory-data';
import { MapPin, Navigation } from 'lucide-react';

export default function TerritorioPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display tracking-tight">
            Território Médio Sudoeste da Bahia
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Conheça as 13 cidades que compõem o nosso nó territorial. 
            Uma rede viva de economia solidária, cultura afro, empoderamento feminino e agricultura familiar.
          </p>
        </div>

        {/* Decorative Map / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {TERRITORY_CITIES.map((city) => (
            <Link 
              key={city.id} 
              href={`/territorio/${city.slug}`}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-sky-200 transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity text-sky-500">
                <MapPin className="w-8 h-8" />
              </div>
              
              <div className="flex-1">
                <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Navigation className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                  {city.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {city.description}
                </p>
              </div>

              <div className="mt-6 flex items-center text-sm font-medium text-sky-600 group-hover:translate-x-1 transition-transform">
                Explorar cidade <span className="ml-2">→</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
