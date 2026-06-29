import type { ComponentType } from 'react';
import {
  LayoutDashboard, Radio, BarChart3, GitBranch, Compass, Globe, Clock, Repeat,
  Activity, Target, FileText, BookOpen, StickyNote, Link2, Users, Mail, Printer,
  HeartPulse, ShieldCheck, Database, Settings,
} from 'lucide-react';

export type NavItem = { href: string; label: string; icon: ComponentType<{ size?: number }>; group?: string; dot?: boolean; alias?: string[] };

/** Fonte única de navegação do painel — usada por Shell e CommandPalette. */
export const ADMIN_NAV: NavItem[] = [
  { href: '/admin', label: 'Visão geral', icon: LayoutDashboard, group: 'Analytics' },
  { href: '/admin/ao-vivo', label: 'Ao Vivo', icon: Radio, dot: true, alias: ['live', 'tempo real'] },
  { href: '/admin/visitas', label: 'Visitas', icon: BarChart3, alias: ['pageviews', 'trafego'] },
  { href: '/admin/funil', label: 'Funil', icon: GitBranch, alias: ['conversao'] },
  { href: '/admin/aquisicao', label: 'Aquisição', icon: Compass, alias: ['utm', 'origem', 'referrer'] },
  { href: '/admin/geografia', label: 'Geografia', icon: Globe, alias: ['pais', 'countries'] },
  { href: '/admin/horarios', label: 'Horários', icon: Clock, alias: ['heatmap', 'horario'] },
  { href: '/admin/retencao', label: 'Retenção', icon: Repeat, alias: ['recorrentes'] },
  { href: '/admin/eventos', label: 'Eventos', icon: Activity, alias: ['logs'] },
  { href: '/admin/metas', label: 'Metas', icon: Target, alias: ['goals'] },
  { href: '/admin/ensaios', label: 'Ensaios', icon: BookOpen, group: 'Conteúdo', alias: ['posts', 'artigos'] },
  { href: '/admin/conteudo', label: 'Conteúdo', icon: FileText, alias: ['agora', 'now'] },
  { href: '/admin/anotacoes', label: 'Anotações', icon: StickyNote, alias: ['notas', 'timeline'] },
  { href: '/admin/links', label: 'Links', icon: Link2, group: 'Tracking', alias: ['tracker', 'encurtador', 'qr'] },
  { href: '/admin/assinantes', label: 'Assinantes', icon: Users, group: 'Newsletter', alias: ['inscritos', 'leads', 'emails'] },
  { href: '/admin/newsletter', label: 'Campanhas', icon: Mail, alias: ['newsletter', 'broadcast', 'envio'] },
  { href: '/admin/relatorio', label: 'Relatório', icon: Printer, group: 'Sistema', alias: ['report', 'pdf', 'mensal'] },
  { href: '/admin/saude', label: 'Saúde', icon: HeartPulse, alias: ['health', 'status', 'sistema'] },
  { href: '/admin/acessos', label: 'Acessos', icon: ShieldCheck, alias: ['logins', 'seguranca'] },
  { href: '/admin/backup', label: 'Backup', icon: Database, alias: ['export', 'csv'] },
  { href: '/admin/config', label: 'Configurações', icon: Settings, alias: ['settings', 'senha', 'config'] },
];
