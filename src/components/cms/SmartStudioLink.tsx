"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SmartStudioLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    isStudioContext?: boolean; // Força ambiente de estúdio independentemente da rota atual
}

export function SmartStudioLink({ href, children, className, isStudioContext }: SmartStudioLinkProps) {
    const pathname = usePathname();
    const activeStudio = isStudioContext || pathname?.startsWith('/studio') || pathname?.startsWith('/estudio');

    // Mapeamento de rotas válidas para evitar vazamentos (Page Mapper Security)
    const validPages = ['home', 'sobre', 'equipe', 'lissa', 'noticias', 'agenda', 'jornada', 'laboratorio'];

    let finalHref = href;

    if (activeStudio && href.startsWith('/')) {
        // Tira a primeira barra e extrai a base path.
        // Ex: "/sobre" -> "sobre"
        const cleanPath = href.split('?')[0].substring(1);
        
        // Se a rota está listada como gerenciável pelo CMS
        if (cleanPath === '' || cleanPath === 'inicio') {
            finalHref = `/studio?page=home`;
        } else if (validPages.includes(cleanPath)) {
            finalHref = `/studio?page=${cleanPath}`;
        } else {
            // Rotas externas ou não autorizadas no CMS
            // Você pode decidir interceptar com um # ou liberar o tráfego saindo.
            // Pela regra de Sandbox, tudo do CMS aponta pra ele mesmo ou bloqueia
            finalHref = `#link-off`;
        }
    }

    if (activeStudio && finalHref === '#link-off') {
        return (
            <span 
                className={className} 
                title="Link inativo no modo Edição"
                onClick={(e) => { e.preventDefault(); alert("Navegação pública bloqueada no modo Estúdio."); }}
            >
                {children}
            </span>
        );
    }

    return (
        <Link href={finalHref} className={className}>
            {children}
        </Link>
    );
}
