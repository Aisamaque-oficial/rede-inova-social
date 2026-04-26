"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { dataService } from "@/lib/data-service";
import { useEffect, useState } from "react";

export function UserNav() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [isAuthenticatedLocally, setIsAuthenticatedLocally] = useState(false);
  const [localUserName, setLocalUserName] = useState<string | null>(null);

  useEffect(() => {
    const isLocal = dataService.isAuthenticatedLocally();
    setIsAuthenticatedLocally(isLocal);

    if (isLocal) {
      const sessao = dataService.obterSessaoAtual();
      if (sessao) {
        setLocalUserName(sessao.nomeCompleto);
      }
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("dev_bypass");
    
    // Se autenticado localmente, fazer logout local
    if (isAuthenticatedLocally) {
      await dataService.fazerLogout();
    }
    
    // Se autenticado via Firebase, fazer logout Firebase
    if (user) {
      await signOut(auth);
    }
    
    router.push("/");
  };

  if (loading && !isAuthenticatedLocally) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Loader className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  const displayName = localUserName || user?.displayName || user?.email || "Usuário";
  const userInitials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            {user?.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {user?.email && <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>}
            {isAuthenticatedLocally && (
              <p className="text-[10px] font-black leading-none text-primary uppercase mt-1">
                {dataService.formatRole(dataService.getUserRole() || 'viewer')}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/perfil" className="flex items-center w-full cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
