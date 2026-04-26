
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import logo from "@/assets/logotransparente.png";

export default function SplashScreen() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 2500); // Começa a desaparecer um pouco antes do tempo total

        return () => clearTimeout(timer);
    }, []);


  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div>
            <Image src={logo} alt="RedeInovaSocial" width={96} height={96} />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-wider text-foreground">
            RedeInovaSocial
        </h1>
    </div>
  );
}
