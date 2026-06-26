/**
 * Dados editoriais localizados (client-safe — sem node:fs).
 * Campos, empresas e metadados dos ensaios em 8 idiomas.
 */
import type { Locale } from '@/lib/i18n';
import EXTRA_JSON from './ensaio-extra.json';

export type CampoSlug = 'tecnologia' | 'negocios' | 'saude' | 'ia';

interface CampoText { nome: string; subtitulo: string; descricao: string }
interface CampoBase { slug: CampoSlug; img: string; cor: string }
export interface Campo extends CampoBase, CampoText {}

const CAMPO_BASE: Record<CampoSlug, CampoBase> = {
  tecnologia: { slug: 'tecnologia', img: '/assets/gen-campo-tecnologia.png', cor: '#C0C4C4' },
  negocios:   { slug: 'negocios',   img: '/assets/gen-campo-negocios.png',   cor: '#A87248' },
  saude:      { slug: 'saude',      img: '/assets/gen-campo-saude.png',      cor: '#0F3326' },
  ia:         { slug: 'ia',         img: '/assets/gen-campo-ia.png',         cor: '#C9A961' },
};

export const CAMPO_ORDER: CampoSlug[] = ['tecnologia', 'negocios', 'saude', 'ia'];

const CAMPO_I18N: Record<CampoSlug, Record<Locale, CampoText>> = {
  tecnologia: {
    pt: { nome: `Tecnologia`, subtitulo: `Infraestrutura digital como ambiente`, descricao: `Leitura da arquitetura digital que está sendo reescrita — da camada física ao comportamento humano. Sistemas se tornando ambiente invisível.` },
    en: { nome: `Technology`, subtitulo: `Digital infrastructure as environment`, descricao: `A reading of the digital architecture being rewritten — from the physical layer to human behavior. Systems becoming an invisible environment.` },
    es: { nome: `Tecnología`, subtitulo: `Infraestructura digital como entorno`, descricao: `Una lectura de la arquitectura digital que se está reescribiendo — de la capa física al comportamiento humano. Sistemas que se vuelven entorno invisible.` },
    zh: { nome: `科技`, subtitulo: `作为环境的数字基础设施`, descricao: `对正在被重写的数字架构的阅读——从物理层到人类行为。系统正成为无形的环境。` },
    fr: { nome: `Technologie`, subtitulo: `L'infrastructure numérique comme environnement`, descricao: `Une lecture de l'architecture numérique en cours de réécriture — de la couche physique au comportement humain. Des systèmes qui deviennent un environnement invisible.` },
    de: { nome: `Technologie`, subtitulo: `Digitale Infrastruktur als Umgebung`, descricao: `Eine Lektüre der digitalen Architektur, die neu geschrieben wird — von der physischen Schicht bis zum menschlichen Verhalten. Systeme werden zur unsichtbaren Umgebung.` },
    ja: { nome: `テクノロジー`, subtitulo: `環境としてのデジタル基盤`, descricao: `書き換えられつつあるデジタル・アーキテクチャの読み解き——物理層から人間の振る舞いまで。システムが不可視の環境となる。` },
    ru: { nome: `Технологии`, subtitulo: `Цифровая инфраструктура как среда`, descricao: `Чтение цифровой архитектуры, которую переписывают, — от физического слоя до человеческого поведения. Системы становятся невидимой средой.` },
  },
  negocios: {
    pt: { nome: `Negócios`, subtitulo: `Vantagem estrutural em transição`, descricao: `Arquitetura de empresas que sobrevivem à passagem de era. Modelos de receita, vantagem durável, o que escala sob a nova lógica.` },
    en: { nome: `Business`, subtitulo: `Structural advantage in transition`, descricao: `The architecture of companies that survive the passage between eras. Revenue models, durable advantage, what scales under the new logic.` },
    es: { nome: `Negocios`, subtitulo: `Ventaja estructural en transición`, descricao: `La arquitectura de empresas que sobreviven al paso de una era. Modelos de ingreso, ventaja duradera, lo que escala bajo la nueva lógica.` },
    zh: { nome: `商业`, subtitulo: `转型中的结构性优势`, descricao: `能够穿越时代更替而存续的企业的架构。营收模型、可持续的优势，以及在新逻辑下能够规模化的东西。` },
    fr: { nome: `Affaires`, subtitulo: `L'avantage structurel en transition`, descricao: `L'architecture des entreprises qui survivent au passage d'une ère. Modèles de revenus, avantage durable, ce qui passe à l'échelle sous la nouvelle logique.` },
    de: { nome: `Wirtschaft`, subtitulo: `Struktureller Vorteil im Übergang`, descricao: `Die Architektur von Unternehmen, die den Übergang zwischen Epochen überstehen. Erlösmodelle, dauerhafter Vorteil, was unter der neuen Logik skaliert.` },
    ja: { nome: `ビジネス`, subtitulo: `移行期の構造的優位`, descricao: `時代の転換を生き延びる企業のアーキテクチャ。収益モデル、持続する優位、新しい論理の下でスケールするもの。` },
    ru: { nome: `Бизнес`, subtitulo: `Структурное преимущество в переходе`, descricao: `Архитектура компаний, переживающих смену эпох. Модели дохода, устойчивое преимущество, то, что масштабируется по новой логике.` },
  },
  saude: {
    pt: { nome: `Saúde`, subtitulo: `Soberania biológica`, descricao: `Saúde como infraestrutura pessoal — contínua, preditiva, legível. Engenharia humana no lugar da medicina reativa.` },
    en: { nome: `Health`, subtitulo: `Biological sovereignty`, descricao: `Health as personal infrastructure — continuous, predictive, legible. Human engineering in place of reactive medicine.` },
    es: { nome: `Salud`, subtitulo: `Soberanía biológica`, descricao: `Salud como infraestructura personal — continua, predictiva, legible. Ingeniería humana en lugar de medicina reactiva.` },
    zh: { nome: `健康`, subtitulo: `生物主权`, descricao: `把健康当作个人的基础设施——持续、可预测、可读取。以人体工程取代被动的医学。` },
    fr: { nome: `Santé`, subtitulo: `Souveraineté biologique`, descricao: `La santé comme infrastructure personnelle — continue, prédictive, lisible. L'ingénierie humaine à la place de la médecine réactive.` },
    de: { nome: `Gesundheit`, subtitulo: `Biologische Souveränität`, descricao: `Gesundheit als persönliche Infrastruktur — kontinuierlich, prädiktiv, lesbar. Menschliche Ingenieurskunst statt reaktiver Medizin.` },
    ja: { nome: `健康`, subtitulo: `生物学的主権`, descricao: `個人のインフラとしての健康——連続的で、予測的で、読み取り可能。受動的な医療に代わる、人間のエンジニアリング。` },
    ru: { nome: `Здоровье`, subtitulo: `Биологический суверенитет`, descricao: `Здоровье как личная инфраструктура — непрерывная, предиктивная, читаемая. Инженерия человека вместо реактивной медицины.` },
  },
  ia: {
    pt: { nome: `Inteligência Artificial`, subtitulo: `Camada de decisão`, descricao: `IA não como hype — como infraestrutura que reescreve trabalho, saúde, sistemas produtivos e a relação humano-máquina.` },
    en: { nome: `Artificial Intelligence`, subtitulo: `Decision layer`, descricao: `AI not as hype — as infrastructure that rewrites work, health, productive systems and the human-machine relationship.` },
    es: { nome: `Inteligencia Artificial`, subtitulo: `Capa de decisión`, descricao: `La IA no como hype — como infraestructura que reescribe el trabajo, la salud, los sistemas productivos y la relación humano-máquina.` },
    zh: { nome: `人工智能`, subtitulo: `决策层`, descricao: `AI 不是炒作——而是重写工作、健康、生产系统以及人机关系的基础设施。` },
    fr: { nome: `Intelligence artificielle`, subtitulo: `Couche de décision`, descricao: `L'IA non comme un battage médiatique — comme une infrastructure qui réécrit le travail, la santé, les systèmes productifs et la relation humain-machine.` },
    de: { nome: `Künstliche Intelligenz`, subtitulo: `Entscheidungsschicht`, descricao: `KI nicht als Hype — als Infrastruktur, die Arbeit, Gesundheit, Produktionssysteme und das Verhältnis von Mensch und Maschine neu schreibt.` },
    ja: { nome: `人工知能`, subtitulo: `意思決定の層`, descricao: `誇大宣伝としてのAIではなく——労働、健康、生産システム、そして人と機械の関係を書き換える基盤としてのAI。` },
    ru: { nome: `Искусственный интеллект`, subtitulo: `Слой принятия решений`, descricao: `ИИ не как хайп — как инфраструктура, переписывающая труд, здоровье, производственные системы и отношения человека и машины.` },
  },
};

export function getCampo(slug: CampoSlug, locale: Locale): Campo {
  return { ...CAMPO_BASE[slug], ...CAMPO_I18N[slug][locale] };
}
export function getCampos(locale: Locale): Campo[] {
  return CAMPO_ORDER.map((slug) => getCampo(slug, locale));
}
export function campoNome(slug: CampoSlug, locale: Locale): string {
  return CAMPO_I18N[slug][locale].nome;
}

// ─── Empresas ─────────────────────────────────────────────────────────────────
export type EmpresaStatus = 'ativa' | 'construcao' | 'beta' | 'proto';
interface EmpresaBase { nome: string; img: string; campos: CampoSlug[]; status: EmpresaStatus; url?: string }
interface EmpresaText { tag: string; desc: string }
export interface Empresa extends EmpresaBase, EmpresaText { campoNomes: string[] }

const EMPRESA_BASE: EmpresaBase[] = [
  { nome: 'Ambrosio Company', img: '/assets/gen-campo-negocios.png', campos: ['tecnologia', 'negocios'], status: 'ativa' },
  { nome: 'Ambrosio Health', img: '/assets/gen-campo-saude.png', campos: ['saude', 'ia', 'tecnologia'], status: 'construcao', url: 'https://ambrosiohealth.com' },
  { nome: 'LogicaOS', img: '/assets/gen-campo-ia.png', campos: ['tecnologia', 'ia', 'negocios'], status: 'beta', url: 'https://logicaos.com' },
  { nome: 'VitaAZ', img: '/assets/gen-flatlay.png', campos: ['saude'], status: 'construcao', url: 'https://vitaaz.com' },
  { nome: 'Ambrosio ExoCore', img: '/assets/gen-sovereignty.png', campos: ['saude', 'tecnologia'], status: 'proto' },
  { nome: 'Rovemark', img: '/assets/gen-campo-tecnologia.png', campos: ['tecnologia', 'ia', 'negocios'], status: 'ativa' },
];

const EMPRESA_I18N: Record<string, Record<Locale, EmpresaText>> = {
  'Ambrosio Company': {
    pt: { tag: `Holding`, desc: `Holding estratégica que organiza investimentos e projetos pessoais.` },
    en: { tag: `Holding`, desc: `Strategic holding that organizes investments and personal projects.` },
    es: { tag: `Holding`, desc: `Holding estratégica que organiza inversiones y proyectos personales.` },
    zh: { tag: `控股`, desc: `统筹投资与个人项目的战略控股公司。` },
    fr: { tag: `Holding`, desc: `Holding stratégique qui organise investissements et projets personnels.` },
    de: { tag: `Holding`, desc: `Strategische Holding, die Investitionen und persönliche Projekte ordnet.` },
    ja: { tag: `ホールディング`, desc: `投資と個人プロジェクトを束ねる戦略的ホールディング。` },
    ru: { tag: `Холдинг`, desc: `Стратегический холдинг, организующий инвестиции и личные проекты.` },
  },
  'Ambrosio Health': {
    pt: { tag: `Saúde · Produto`, desc: `Engineering Human Vitality. Saúde contínua, biomarcadores, longevidade como engenharia.` },
    en: { tag: `Health · Product`, desc: `Engineering Human Vitality. Continuous health, biomarkers, longevity as engineering.` },
    es: { tag: `Salud · Producto`, desc: `Engineering Human Vitality. Salud continua, biomarcadores, longevidad como ingeniería.` },
    zh: { tag: `健康 · 产品`, desc: `Engineering Human Vitality。持续健康、生物标志物，把长寿当作工程。` },
    fr: { tag: `Santé · Produit`, desc: `Engineering Human Vitality. Santé continue, biomarqueurs, la longévité comme ingénierie.` },
    de: { tag: `Gesundheit · Produkt`, desc: `Engineering Human Vitality. Kontinuierliche Gesundheit, Biomarker, Langlebigkeit als Ingenieurskunst.` },
    ja: { tag: `健康 · プロダクト`, desc: `Engineering Human Vitality。連続的な健康、バイオマーカー、工学としての長寿。` },
    ru: { tag: `Здоровье · Продукт`, desc: `Engineering Human Vitality. Непрерывное здоровье, биомаркеры, долголетие как инженерия.` },
  },
  'LogicaOS': {
    pt: { tag: `Software · Produtividade`, desc: `Sistema operacional de agentes para construtores. Arquitetura de decisão assistida por IA.` },
    en: { tag: `Software · Productivity`, desc: `An agent operating system for builders. AI-assisted decision architecture.` },
    es: { tag: `Software · Productividad`, desc: `Sistema operativo de agentes para constructores. Arquitectura de decisión asistida por IA.` },
    zh: { tag: `软件 · 生产力`, desc: `面向构建者的智能体操作系统。AI 辅助的决策架构。` },
    fr: { tag: `Logiciel · Productivité`, desc: `Un système d'exploitation d'agents pour les bâtisseurs. Architecture de décision assistée par IA.` },
    de: { tag: `Software · Produktivität`, desc: `Ein Agenten-Betriebssystem für Erbauer. KI-gestützte Entscheidungsarchitektur.` },
    ja: { tag: `ソフトウェア · 生産性`, desc: `構築者のためのエージェントOS。AIが支援する意思決定アーキテクチャ。` },
    ru: { tag: `ПО · Продуктивность`, desc: `Операционная система агентов для строителей. Архитектура решений с помощью ИИ.` },
  },
  'VitaAZ': {
    pt: { tag: `Suplementação`, desc: `Linha de suplementação funcional com formulações proprietárias.` },
    en: { tag: `Supplements`, desc: `A line of functional supplements with proprietary formulations.` },
    es: { tag: `Suplementación`, desc: `Línea de suplementación funcional con formulaciones propias.` },
    zh: { tag: `营养补充`, desc: `采用自有配方的功能性营养补充产品线。` },
    fr: { tag: `Compléments`, desc: `Une gamme de compléments fonctionnels aux formulations propriétaires.` },
    de: { tag: `Supplemente`, desc: `Eine Linie funktionaler Supplemente mit eigenen Formulierungen.` },
    ja: { tag: `サプリメント`, desc: `独自処方による機能性サプリメントのライン。` },
    ru: { tag: `Добавки`, desc: `Линейка функциональных добавок с собственными формулами.` },
  },
  'Ambrosio ExoCore': {
    pt: { tag: `Hardware · Saúde`, desc: `Órgão externo inteligente com biocartuchos. Hardware que se conecta ao corpo.` },
    en: { tag: `Hardware · Health`, desc: `A smart external organ with biocartridges. Hardware that connects to the body.` },
    es: { tag: `Hardware · Salud`, desc: `Órgano externo inteligente con biocartuchos. Hardware que se conecta al cuerpo.` },
    zh: { tag: `硬件 · 健康`, desc: `配备生物芯卡的智能体外器官。连接身体的硬件。` },
    fr: { tag: `Matériel · Santé`, desc: `Un organe externe intelligent à biocartouches. Du matériel qui se connecte au corps.` },
    de: { tag: `Hardware · Gesundheit`, desc: `Ein intelligentes externes Organ mit Biokartuschen. Hardware, die sich mit dem Körper verbindet.` },
    ja: { tag: `ハードウェア · 健康`, desc: `バイオカートリッジを備えたスマートな体外器官。身体に接続するハードウェア。` },
    ru: { tag: `Железо · Здоровье`, desc: `Умный внешний орган с биокартриджами. Аппаратура, подключающаяся к телу.` },
  },
  'Rovemark': {
    pt: { tag: `Infraestrutura de IA`, desc: `A casa por trás do LogicaOS e da suíte Logica — infraestrutura de IA soberana e local-first.` },
    en: { tag: `AI Infrastructure`, desc: `The company behind LogicaOS and the Logica suite — sovereign, local-first AI infrastructure.` },
    es: { tag: `Infraestructura de IA`, desc: `La compañía detrás de LogicaOS y la suite Logica — infraestructura de IA soberana y local-first.` },
    zh: { tag: `AI 基础设施`, desc: `打造 LogicaOS 与 Logica 套件的公司——主权式、本地优先的 AI 基础设施。` },
    fr: { tag: `Infrastructure IA`, desc: `La maison derrière LogicaOS et la suite Logica — une infrastructure d'IA souveraine et local-first.` },
    de: { tag: `KI-Infrastruktur`, desc: `Das Unternehmen hinter LogicaOS und der Logica-Suite — souveräne, local-first KI-Infrastruktur.` },
    ja: { tag: `AI インフラ`, desc: `LogicaOS と Logica スイートを生み出す企業——主権的でローカルファーストな AI インフラ。` },
    ru: { tag: `ИИ-инфраструктура`, desc: `Компания, создающая LogicaOS и набор Logica — суверенная, local-first ИИ-инфраструктура.` },
  },
};

export function getEmpresas(locale: Locale): Empresa[] {
  return EMPRESA_BASE.map((e) => ({
    ...e,
    ...EMPRESA_I18N[e.nome][locale],
    campoNomes: e.campos.map((c) => campoNome(c, locale)),
  }));
}

// ─── Ensaios — overlay de metadados localizados (corpo via content/ensaios/<locale>/) ─────────
export interface EnsaioMeta { titulo: string; subtitulo: string; resumo: string }

export const ENSAIO_I18N: Record<string, Record<Locale, EnsaioMeta>> = {
  'arquitetura-invisivel': {
    pt: { titulo: `A arquitetura invisível da saúde contínua`, subtitulo: `Por que o próximo ciclo da medicina é infraestrutural`, resumo: `O modelo atual de saúde é reativo por construção. A próxima camada não é mais um app, é infraestrutura de leitura biológica contínua.` },
    en: { titulo: `The invisible architecture of continuous health`, subtitulo: `Why medicine's next cycle is infrastructural`, resumo: `Today's health model is reactive by construction. The next layer is not another app — it is infrastructure for continuous biological reading.` },
    es: { titulo: `La arquitectura invisible de la salud continua`, subtitulo: `Por qué el próximo ciclo de la medicina es infraestructural`, resumo: `El modelo de salud actual es reactivo por construcción. La próxima capa no es otra app, es infraestructura de lectura biológica continua.` },
    zh: { titulo: `持续健康的无形架构`, subtitulo: `为何医学的下一个周期是基础设施性的`, resumo: `当下的健康模式在构造上就是被动的。下一层不是又一个 App，而是持续读取生物信号的基础设施。` },
    fr: { titulo: `L'architecture invisible de la santé continue`, subtitulo: `Pourquoi le prochain cycle de la médecine est infrastructurel`, resumo: `Le modèle de santé actuel est réactif par construction. La prochaine couche n'est pas une appli de plus, c'est une infrastructure de lecture biologique continue.` },
    de: { titulo: `Die unsichtbare Architektur kontinuierlicher Gesundheit`, subtitulo: `Warum der nächste Zyklus der Medizin infrastrukturell ist`, resumo: `Das heutige Gesundheitsmodell ist von Grund auf reaktiv. Die nächste Schicht ist keine weitere App, sondern Infrastruktur für kontinuierliches biologisches Auslesen.` },
    ja: { titulo: `連続的な健康の、不可視のアーキテクチャ`, subtitulo: `なぜ医療の次なるサイクルはインフラ的なのか`, resumo: `現在の健康モデルは、設計からして受動的だ。次の層はもう一つのアプリではなく、生体情報を連続的に読み取るための基盤である。` },
    ru: { titulo: `Невидимая архитектура непрерывного здоровья`, subtitulo: `Почему следующий цикл медицины — инфраструктурный`, resumo: `Нынешняя модель здоровья реактивна по построению. Следующий слой — не очередное приложение, а инфраструктура непрерывного считывания биологии.` },
  },
  'camada-decisao-ia': {
    pt: { titulo: `IA como camada de decisão, não ferramenta`, subtitulo: `A diferença entre usar IA e construir sobre ela`, resumo: `A maioria das empresas ainda trata IA como feature. A próxima onda de vantagem vem de tratá-la como camada estrutural de decisão.` },
    en: { titulo: `AI as a decision layer, not a tool`, subtitulo: `The difference between using AI and building on it`, resumo: `Most companies still treat AI as a feature. The next wave of advantage comes from treating it as a structural decision layer.` },
    es: { titulo: `IA como capa de decisión, no herramienta`, subtitulo: `La diferencia entre usar IA y construir sobre ella`, resumo: `La mayoría de las empresas aún trata la IA como una función. La próxima ola de ventaja viene de tratarla como capa estructural de decisión.` },
    zh: { titulo: `把 AI 当作决策层，而非工具`, subtitulo: `使用 AI 与在其之上构建的区别`, resumo: `多数企业仍把 AI 当作一项功能。下一波优势来自把它当作结构性的决策层。` },
    fr: { titulo: `L'IA comme couche de décision, pas comme outil`, subtitulo: `La différence entre utiliser l'IA et bâtir dessus`, resumo: `La plupart des entreprises traitent encore l'IA comme une fonctionnalité. La prochaine vague d'avantage vient de la traiter comme une couche structurelle de décision.` },
    de: { titulo: `KI als Entscheidungsschicht, nicht als Werkzeug`, subtitulo: `Der Unterschied zwischen KI nutzen und auf ihr bauen`, resumo: `Die meisten Unternehmen behandeln KI noch als Feature. Die nächste Welle des Vorteils entsteht, wenn man sie als strukturelle Entscheidungsschicht behandelt.` },
    ja: { titulo: `ツールではなく、意思決定の層としてのAI`, subtitulo: `AIを使うことと、その上に築くことの違い`, resumo: `多くの企業はいまだAIを一機能として扱う。次の優位は、それを構造的な意思決定の層として扱うことから生まれる。` },
    ru: { titulo: `ИИ как слой принятия решений, а не инструмент`, subtitulo: `Разница между использованием ИИ и построением на нём`, resumo: `Большинство компаний всё ещё относятся к ИИ как к функции. Следующая волна преимущества — относиться к нему как к структурному слою решений.` },
  },
  'erro-estrutural-negocios': {
    pt: { titulo: `O erro estrutural da empresa moderna`, subtitulo: `Por que eficiência deixou de ser vantagem`, resumo: `Durante 50 anos, a vantagem competitiva veio de eficiência operacional. Essa era acabou. A nova vantagem é arquitetura.` },
    en: { titulo: `The structural error of the modern company`, subtitulo: `Why efficiency stopped being an advantage`, resumo: `For 50 years, competitive advantage came from operational efficiency. That era is over. The new advantage is architecture.` },
    es: { titulo: `El error estructural de la empresa moderna`, subtitulo: `Por qué la eficiencia dejó de ser ventaja`, resumo: `Durante 50 años, la ventaja competitiva vino de la eficiencia operativa. Esa era terminó. La nueva ventaja es la arquitectura.` },
    zh: { titulo: `现代企业的结构性错误`, subtitulo: `为何效率不再是优势`, resumo: `五十年来，竞争优势源自运营效率。那个时代已经结束。新的优势是架构。` },
    fr: { titulo: `L'erreur structurelle de l'entreprise moderne`, subtitulo: `Pourquoi l'efficacité a cessé d'être un avantage`, resumo: `Pendant 50 ans, l'avantage concurrentiel venait de l'efficacité opérationnelle. Cette ère est révolue. Le nouvel avantage, c'est l'architecture.` },
    de: { titulo: `Der strukturelle Fehler des modernen Unternehmens`, subtitulo: `Warum Effizienz aufgehört hat, ein Vorteil zu sein`, resumo: `50 Jahre lang kam der Wettbewerbsvorteil aus operativer Effizienz. Diese Ära ist vorbei. Der neue Vorteil ist Architektur.` },
    ja: { titulo: `現代企業の構造的な誤り`, subtitulo: `なぜ効率は優位でなくなったのか`, resumo: `50年にわたり、競争優位は業務効率から生まれた。その時代は終わった。新しい優位は、アーキテクチャである。` },
    ru: { titulo: `Структурная ошибка современной компании`, subtitulo: `Почему эффективность перестала быть преимуществом`, resumo: `50 лет конкурентное преимущество исходило из операционной эффективности. Эта эпоха закончилась. Новое преимущество — архитектура.` },
  },
};

// ─── Extras editoriais (key takeaways + FAQ) — opcional por idioma ──────────────
export interface EnsaioExtra {
  takeaways: string[];
  faq: { q: string; a: string }[];
}

export const ENSAIO_EXTRA = EXTRA_JSON as Record<string, Partial<Record<Locale, EnsaioExtra>>>;

export function getEnsaioExtra(slug: string, locale: Locale): EnsaioExtra | null {
  return ENSAIO_EXTRA[slug]?.[locale] ?? null;
}
