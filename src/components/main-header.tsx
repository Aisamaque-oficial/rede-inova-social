"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import logo from "@/assets/logotransparente.png";
import { Eye, EarOff, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Início" },
    { href: "/jornada#sobre", label: "Sobre o Projeto" },
    { href: "/equipe", label: "Equipe" },
    { href: "/laboratorio", label: "LISSA" },
    { href: "/noticias", label: "Notícias" },
    { href: "/agenda", label: "Agenda" },
];

export default function MainHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const isJornada = pathname === "/jornada";

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header 
            className={cn(
                "fixed top-0 left-0 right-0 z-50",
                isScrolled 
                    ? "py-3 glass-morphism !bg-white/80" 
                    : "py-6 bg-transparent"
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <nav className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
                        <div 
                            className="relative w-12 h-12 flex-shrink-0"
                        >
                            <Image 
                                src={logo} 
                                alt="Rede de Inovação Social" 
                                fill 
                                className="object-contain drop-shadow-md" 
                            />
                        </div>
                        <div 
                            className={cn(
                                "flex flex-col",
                                isScrolled ? "opacity-100" : "opacity-90"
                            )}>
                            <span className={cn(
                                "text-lg font-black leading-none tracking-tighter uppercase italic transition-colors",
                                isScrolled ? "text-primary" : "text-primary"
                            )}>
                                <span translate="no">Rede Inova</span>
                            </span>
                            <span className={cn(
                                "text-[10px] leading-tight opacity-70 italic",
                                isScrolled || isJornada ? "text-sidebar-foreground/80" : "text-muted-foreground"
                            )}>
                                <span translate="no">no Médio Sudoeste Baiano</span>
                            </span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
                        <div className="flex items-center bg-white/40 backdrop-blur-md rounded-full px-2 py-1 border border-primary/5 mr-4 shadow-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-all relative group rounded-full",
                                        pathname === link.href ? "text-primary" : "text-muted-foreground hover:text-primary"
                                    )}
                                >
                                    <span translate="no">{link.label}</span>
                                    {pathname === link.href && (
                                        <div className="absolute inset-0 bg-primary/10 rounded-full -z-10" />
                                    )}
                                    <div className="absolute bottom-1 left-5 right-5 h-0.5 bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform" />
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                             <Button 
                                variant="outline" 
                                size="sm" 
                                className={cn(
                                    "rounded-full transition-all border-primary/20 hover:border-primary/50 flex items-center gap-2 px-4 shadow-sm",
                                    isScrolled || isJornada ? "text-sidebar-foreground bg-sidebar-accent/30" : "text-primary bg-primary/5 hover:bg-primary/10"
                                )}
                                onClick={() => {
                                    // Trigger the accessibility toolbar
                                    const btn = document.querySelector('[data-accessibility-toggle]') as HTMLButtonElement;
                                    if (btn) btn.click();
                                }}
                            >
                                <Eye className="h-4 w-4" />
                                <span className="font-bold text-[10px] uppercase tracking-wider">Acessibilidade</span>
                            </Button>
                             
                            
                            <Button 
                                variant="default" 
                                size="sm" 
                                asChild 
                                className="rounded-full shadow-lg hover:shadow-primary/20 hover:scale-105 transition-all bg-primary hover:bg-primary/90 text-white px-6"
                            >
                                <Link href="/login" aria-label="Acessar painel do projeto">Acessar Painel</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-full h-9 w-9 p-0 border-primary/30"
                            onClick={() => {
                                const btn = document.querySelector('[data-accessibility-toggle]') as HTMLButtonElement;
                                if (btn) btn.click();
                            }}
                        >
                            <Eye className="h-4 w-4 text-primary" />
                        </Button>
                         <Button 
                            variant="default" 
                            size="sm" 
                            asChild 
                            className="rounded-full text-xs h-9"
                        >
                            <Link href="/login">Painel</Link>
                        </Button>
                        <MobileNav />
                    </div>
                </nav>
            </div>
        </header>
    );
}
