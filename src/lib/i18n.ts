export const languages = ['pt', 'en', 'es'] as const;
export type Language = typeof languages[number];
export const locale = { pt: 'pt-BR', en: 'en', es: 'es' };
export const prefix = (lang: Language) => lang === 'pt' ? '' : `/${lang}`;
export const routeGroups: Record<Language, string>[] = [
  { pt: '/', en: '/en/', es: '/es/' },
  { pt: '/blog/', en: '/en/blog/', es: '/es/blog/' },
  { pt: '/sobre/', en: '/en/about/', es: '/es/sobre/' },
  { pt: '/projetos/', en: '/en/projects/', es: '/es/proyectos/' },
  { pt: '/ferramentas/', en: '/en/tools/', es: '/es/herramientas/' },
  { pt: '/projetos/vfp-inspect/', en: '/en/projects/vfp-inspect/', es: '/es/proyectos/vfp-inspect/' },
  { pt: '/projetos/tessera-guard/', en: '/en/projects/tessera-guard/', es: '/es/proyectos/tessera-guard/' },
];
export const languageFromPath = (path: string): Language => path.startsWith('/es/') ? 'es' : path.startsWith('/en/') ? 'en' : 'pt';
