"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function useAuth(requireAuth = true) {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session && mounted) {
          setSession(session);
          // Fetch profile info
          const { data: perfil } = await supabase
            .from('infra_perfis')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setProfile(perfil);
        } else if (requireAuth && mounted) {
          // If auth is required but no session exists, redirect to login
          router.push('/login');
        }
      } catch (e) {
        console.error("Auth error:", e);
        if (requireAuth && mounted) {
          router.push('/login');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      setSession(session);
      if (session) {
        const { data: perfil } = await supabase
          .from('infra_perfis')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(perfil);
      } else {
        setProfile(null);
        if (requireAuth) {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [requireAuth, router, pathname]);

  return { session, profile, loading };
}
