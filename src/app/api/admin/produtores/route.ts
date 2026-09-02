import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // ZERO TRUST: Verificar se quem está chamando a API é realmente uma secretaria logada
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Server actions / API routes can't usually set cookies easily without workarounds, 
            // but for reading the session, getAll is sufficient.
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    // Opcional: Garantir que o usuário atual é do tipo "secretaria" no banco
    const { data: callerProfile } = await supabase
      .from('infra_perfis')
      .select('tipo_perfil')
      .eq('id', user.id)
      .single();

    if (!callerProfile || callerProfile.tipo_perfil !== 'secretaria') {
      return NextResponse.json({ error: 'Acesso negado. Apenas secretarias podem criar produtores.' }, { status: 403 });
    }

    // 1. Obter os dados enviados pelo painel da Secretaria
    const { 
      email, 
      senha, 
      nome_completo, 
      nome_propriedade, 
      telefone, 
      cidade_slug, 
      comunidade_distrito,
      coordenadas 
    } = await request.json();

    if (!email || !senha || !nome_completo || !cidade_slug) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Chave de administração (service_role) não configurada no servidor.' }, { status: 500 });
    }

    // 2. Criar o usuário no Auth (auth.users)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true, // Auto-confirma para facilitar o acesso inicial
    });

    if (authError) {
      console.error("Erro ao criar auth.user:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const userId = authData.user.id;

    // 3. Criar o perfil oficial na tabela infra_perfis vinculado ao auth.users
    const { data: perfilData, error: perfilError } = await supabaseAdmin
      .from('infra_perfis')
      .insert([
        {
          id: userId, // Garante que o infra_perfis tem o MESMO ID do auth.users
          user_email: email,
          tipo_perfil: 'produtor',
          nome_completo,
          nome_propriedade,
          telefone,
          cidade_slug,
          comunidade_distrito,
          coordenadas,
          ativo: true
        }
      ])
      .select()
      .single();

    if (perfilError) {
      // Rollback se falhar ao criar perfil: Deletar usuário do auth
      await supabaseAdmin.auth.admin.deleteUser(userId);
      console.error("Erro ao criar infra_perfil:", perfilError);
      return NextResponse.json({ error: perfilError.message }, { status: 500 });
    }

    // Sucesso! Retornar os dados do perfil
    return NextResponse.json({ success: true, perfil: perfilData });

  } catch (error: any) {
    console.error("Erro interno no servidor:", error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}
