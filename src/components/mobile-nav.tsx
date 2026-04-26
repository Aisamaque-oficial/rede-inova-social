
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image";
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import logo from "@/assets/logotransparente.png";

const navLinks = [
    { href: "/", label: "Início" },
    { href: "/jornada#sobre", label: "Sobre o Projeto" },
    { href: "/equipe", label: "Equipe" },
    { href: "/laboratorio", label: "Laboratório" },
    { href: "/noticias", label: "Notícias" },
    { href: "/agenda", label: "Agenda" },
];


export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 bg-sidebar text-sidebar-foreground">
        <Link
          href="/"
          className="mr-6 flex items-center space-x-2"
          onClick={() => setOpen(false)}
        >
          <Image src={logo} alt="Rede de Inovação Social no Médio Sudoeste Baiano" width={50} height={50} />
          <div>
            <span className="block font-bold leading-tight">Rede de Inovação Social</span>
            <span className="block text-xs leading-tight text-sidebar-foreground/70">no Médio Sudoeste Baiano</span>
          </div>
        </Link>
        <div className="flex flex-col space-y-3 pt-6">
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-sidebar-foreground"
                >
                    {link.label}
                </Link>
            ))}
             <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sidebar-foreground font-semibold pt-4"
            >
                Acessar Painel
            </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
