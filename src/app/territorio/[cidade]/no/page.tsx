import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug } from '@/lib/territory-data';
import { ArrowLeft, Map } from 'lucide-react';

export default async function NoPage({ params }: { params: Promise<{ cidade: string }> }) {
  const resolvedParams = await params;
  const city = getCityBySlug(resolvedParams.cidade);

  if (!city) notFound();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 flex justify-center">
          <Link href={`/territorio/${city.slug}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para {city.name}
          </Link>
        </div>

        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sky-100 text-sky-600 mb-8">
          <Map className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-display tracking-tight">
          O Nó Territorial em {city.name}
        </h1>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mt-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Página em Construção</h2>
          <p className="text-lg text-slate-600">
            Aqui você encontrará fotos, vídeos e detalhes sobre como o projeto atua especificamente como um nó de rede no município de {city.name}.
          </p>
        </div>
      </div>
    </div>
  );
}
