/**
 * Mapeamento e Catálogo Central de Vídeos em Libras da Rede Inova Social
 * Conecta termos do glossário e botões de interface aos arquivos físicos em public/videos/
 */

export interface RegisteredVideo {
  title: string;
  category: 'glossario_eixo5' | 'glossario_eixo6' | 'botao';
  path: string;
  aliases: string[];
}

export const REGISTERED_VIDEOS_MAP: Record<string, string> = {
  // ==========================================
  // EIXO 5 — SOBERANIA ALIMENTAR
  // ==========================================
  'acesso aos alimentos': '/videos/glossario/EIXO 5/ACESSO AOS ALIMENTOS.mp4',
  'agricultura familiar': '/videos/glossario/EIXO 5/AGRICULTURA FAMILIAR.mp4',
  'agroecologia': '/videos/glossario/EIXO 5/AGROECOLOGIA.mp4',
  'alimentacao adequada e saudavel': '/videos/glossario/EIXO 5/ALIMENTAÇÃO ADEQUADA E SAUDÁVEL.mp4',
  'alimento agroecologico': '/videos/glossario/EIXO 5/ALIMENTO AGROECOLÓGICO.mp4',
  'alimento sustentavel': '/videos/glossario/EIXO 5/ALIMENTO SUSTENTÁVEL.mp4',
  'sistema alimentar sustentavel': '/videos/glossario/EIXO 5/ALIMENTO SUSTENTÁVEL.mp4',
  'alimentos regionais': '/videos/glossario/EIXO 5/ALIMENTOS REGIONAIS.mp4',
  'aproveitamento integral dos alimentos': '/videos/glossario/EIXO 5/APROVEITAMENTO INTEGRAL DOS ALIMENTOS.mp4',
  'associacao de produtores': '/videos/glossario/EIXO 5/ASSOCIAÇÃO DE PRODUTORES.mp4',
  'comercializacao': '/videos/glossario/EIXO 5/COMERCIALIZAÇÃO.mp4',
  'comida de verdade': '/videos/glossario/EIXO 5/COMIDA DE VERDADE.mp4',
  'compra consciente': '/videos/glossario/EIXO 5/COMPRA CONSCIENTE.mp4',
  'compra institucional': '/videos/glossario/EIXO 5/COMPRA INSTITUCIONAL.mp4',
  'consumo consciente': '/videos/glossario/EIXO 5/CONSUMO CONSCIENTE.mp4',
  'cultura alimentar': '/videos/glossario/EIXO 5/CULTURA ALIMENTAR.mp4',
  'desenvolvimento territorial': '/videos/glossario/EIXO 5/DESENVOLVIMENTO TERRITORIAL.mp4',
  'deserto alimentar': '/videos/glossario/EIXO 5/DESERTO ALIMENTAR.mp4',
  'desnutricao': '/videos/glossario/EIXO 5/DESNUTRIÇÃO.mp4',
  'direito alimentar': '/videos/glossario/EIXO 5/DIREITO ALIMENTAR.mp4',
  'direito a alimentacao': '/videos/glossario/EIXO 5/DIREITO ALIMENTAR.mp4',
  'direito humano a alimentacao adequada': '/videos/glossario/EIXO 5/DIREITO HUMANO À ALIMENTAÇÃO ADEQUADA.mp4',
  'direito humano a alimentacao adequada (dhaa)': '/videos/glossario/EIXO 5/DIREITO HUMANO À ALIMENTAÇÃO ADEQUADA.mp4',
  'disponibilidade dos alimentos': '/videos/glossario/EIXO 5/DISPONIBILIDADE DOS ALIMENTOS.mp4',
  'disponibilidade de alimentos': '/videos/glossario/EIXO 5/DISPONIBILIDADE DOS ALIMENTOS.mp4',
  'economia solidaria': '/videos/glossario/EIXO 5/ECONOMIA SOLIDÁRIA.mp4',
  'educacao alimentar e nutricional': '/videos/glossario/EIXO 5/EDUCAÇÃO ALIMENTAR E NUTRICIONAL.mp4',
  'feira de agricultura familiar': '/videos/glossario/EIXO 5/FEIRA DE AGRICULTURA FAMILIAR.mp4',
  'feira da agricultura familiar': '/videos/glossario/EIXO 5/FEIRA DE AGRICULTURA FAMILIAR.mp4',
  'feira': '/videos/glossario/EIXO 5/FEIRA.mp4',
  'feira livre': '/videos/glossario/EIXO 5/FEIRA.mp4',
  'fome': '/videos/glossario/EIXO 5/FOME.mp4',
  'inseguranca alimentar': '/videos/glossario/EIXO 5/INSEGURANÇA ALIMENTAR.mp4',
  'lugares': '/videos/glossario/EIXO 5/LUGARES.mp4',
  'ma nutricao': '/videos/glossario/EIXO 5/MÁ NUTRIÇÃO.mp4',
  'politica de seguranca alimentar': '/videos/glossario/EIXO 5/POLÍTICA DE SEGURANÇA ALIMENTAR.mp4',
  'preco justo': '/videos/glossario/EIXO 5/PREÇO JUSTO.mp4',
  'producao local': '/videos/glossario/EIXO 5/PRODUÇÃO LOCAL.mp4',
  'soberania alimentar': '/videos/glossario/EIXO 5/SOBERANIA ALIMENTAR.mp4',
  'sustentabilidade': '/videos/glossario/EIXO 5/SUSTENTABILIDADE.mp4',
  'sustentavel': '/videos/glossario/EIXO 5/SUSTENTÁVEL.mp4',
  'agricultura sustentavel': '/videos/glossario/EIXO 5/SUSTENTÁVEL.mp4',
  'territorialidade': '/videos/glossario/EIXO 5/TERRITORIALIDADE.mp4',
  'territorio': '/videos/glossario/EIXO 5/Território.mp4',
  'tradicao alimentar': '/videos/glossario/EIXO 5/TRADIÇÃO ALIMENTAR.mp4',
  'vendas': '/videos/glossario/EIXO 5/VENDAS.mp4',
  'venda direta': '/videos/glossario/EIXO 5/VENDAS.mp4',
  'contaminacao da terra': '/videos/glossario/EIXO 5/Contaminaçao da terra.mp4',
  'terra contaminada': '/videos/glossario/EIXO 5/Terra contaminada.mp4',
  'agua contaminada': '/videos/glossario/EIXO 5/Água contaminada.mp4',

  // ==========================================
  // EIXO 6 — PRODUÇÃO E SEGURANÇA NO CAMPO
  // ==========================================
  'contaminacao das aguas': '/videos/glossario/EIXO 6/Contaminação das águas.mp4',
  'contaminacao da agua': '/videos/glossario/EIXO 6/Contaminação das águas.mp4',
  'embalagem dos alimentos': '/videos/glossario/EIXO 6/Embalagem dos alimentos.mp4',
  'embalagem para alimentos': '/videos/glossario/EIXO 6/Embalagem dos alimentos.mp4',
  'temperatura': '/videos/glossario/EIXO 6/Temperatura.mp4',
  'contaminacao do solo': '/videos/glossario/EIXO 5/Contaminaçao da terra.mp4',

  // ==========================================
  // BOTÕES E AÇÕES DA PLATAFORMA
  // ==========================================
  'acessibilidade': '/videos/botoes/ACESSIBILIDADE.mp4',
  'apoiadores': '/videos/botoes/Apoiadores.mp4',
  'arena de desafios': '/videos/botoes/ARENA DE DESAFIOS.mp4',
  'arena de games': '/videos/botoes/ARENA DE GAMES.mp4',
  'jogos': '/videos/botoes/ARENA DE GAMES.mp4',
  'games': '/videos/botoes/ARENA DE GAMES.mp4',
  'biblioteca de saberes': '/videos/botoes/Biblioteca de Saberes.mp4',
  'biblioteca': '/videos/botoes/Biblioteca de Saberes.mp4',
  'conheca a jornada': '/videos/botoes/Conheça a jornada.mp4',
  'jornada': '/videos/botoes/Conheça a jornada.mp4',
  'cozinha nutricional': '/videos/botoes/Cozinha Nutricional.mp4',
  'cozinha': '/videos/botoes/Cozinha Nutricional.mp4',
  'equipe': '/videos/botoes/Equipe.mp4',
  'nossa equipe': '/videos/botoes/Equipe.mp4',
  'horta alimentar': '/videos/botoes/HORTA ALIMENTAR.mp4',
  'horta': '/videos/botoes/HORTA ALIMENTAR.mp4',
  'inicio': '/videos/botoes/INÍCIO.mp4',
  'home': '/videos/botoes/INÍCIO.mp4',
  'laboratorio lissa': '/videos/botoes/Laboratório Lissa.mp4',
  'laboratorio lissa-1': '/videos/botoes/Laboratório LISSA-1.mp4',
  'lissa': '/videos/botoes/Laboratório Lissa.mp4',
  'libras na seguranca alimentar': '/videos/botoes/Libras na segurança alimentar.mp4',
  'seguranca alimentar': '/videos/botoes/Libras na segurança alimentar.mp4',
  'nossa agenda': '/videos/botoes/Nossa agenda.mp4',
  'agenda': '/videos/botoes/Nossa agenda.mp4',
  'painel da equipe': '/videos/botoes/Painel da equipe.mp4',
  'painel do agricultor': '/videos/botoes/Painel do agricultor.mp4',
  'painel do produtor': '/videos/botoes/Painel do agricultor.mp4',
  'pesquisa alimento saudavel': '/videos/botoes/Pesquisa alimento saudável.mp4',
  'pesquisar': '/videos/botoes/Pesquisa alimento saudável.mp4',
  'sobre o projeto': '/videos/botoes/Sobre o projeto.mp4',
  'sobre': '/videos/botoes/Sobre o projeto.mp4',
};

/**
 * Normaliza string para busca: minúsculo, sem acentos, sem pontuação
 */
export function normalizeVideoKey(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Encontra vídeo registrado para um termo ou botão
 */
export function findRegisteredVideo(termOrButton: string): string | null {
  if (!termOrButton) return null;
  const key = normalizeVideoKey(termOrButton);
  if (REGISTERED_VIDEOS_MAP[key]) {
    return REGISTERED_VIDEOS_MAP[key];
  }
  return null;
}
