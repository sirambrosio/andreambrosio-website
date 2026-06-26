/**
 * Fonte única das redes sociais (verificadas no Metricool) e projetos vivos.
 * Usada na página /links (bio), no Footer, no JSON-LD e no descriptor MCP.
 */

export interface Social {
  name: string;
  handle: string;
  url: string;
  icon: 'instagram' | 'tiktok' | 'youtube' | 'facebook';
}

export const SOCIALS: Social[] = [
  { name: 'Instagram', handle: '@andreambrosioof', url: 'https://instagram.com/andreambrosioof', icon: 'instagram' },
  { name: 'TikTok', handle: '@andreambrosioof', url: 'https://www.tiktok.com/@andreambrosioof', icon: 'tiktok' },
  { name: 'YouTube', handle: 'Andre Ambrósio', url: 'https://www.youtube.com/channel/UCajTN3B6T9tDr2JnoTCsYjA', icon: 'youtube' },
  { name: 'Facebook', handle: 'Andre Ambrósio', url: 'https://www.facebook.com/356449954697184', icon: 'facebook' },
];

export const SOCIAL_URLS = SOCIALS.map((s) => s.url);

export interface Project {
  name: string;
  tagKey: 'logicaos' | 'health' | 'vitaaz' | 'rovemark';
  url: string;
}

/** Projetos com site no ar (verificados 200). */
export const PROJECTS: Project[] = [
  { name: 'LogicaOS', tagKey: 'logicaos', url: 'https://logicaos.com' },
  { name: 'Ambrosio Health', tagKey: 'health', url: 'https://ambrosiohealth.com' },
  { name: 'VitaAZ', tagKey: 'vitaaz', url: 'https://vitaaz.com' },
  { name: 'Rovemark', tagKey: 'rovemark', url: '/empresas' },
];
