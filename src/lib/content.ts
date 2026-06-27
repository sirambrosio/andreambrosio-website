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
  { nome: 'BSP', img: '/assets/gen-sovereignty.png', campos: ['saude', 'tecnologia', 'ia'], status: 'beta', url: 'https://biologicalsovereigntyprotocol.com' },
  { nome: 'Ambrosio Institute', img: '/assets/gen-campo-tecnologia.png', campos: ['tecnologia', 'ia', 'saude'], status: 'construcao' },
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
  'BSP': {
    pt: { tag: `Protocolo · Saúde`, desc: `Biological Sovereignty Protocol. Protocolo aberto e permissionless que devolve ao indivíduo a posse dos próprios dados biológicos — genoma, clínico, wearables, microbioma — em Aptos e Arweave.` },
    en: { tag: `Protocol · Health`, desc: `Biological Sovereignty Protocol. An open, permissionless protocol that returns ownership of one's biological data — genome, clinical, wearables, microbiome — to the individual, on Aptos and Arweave.` },
    es: { tag: `Protocolo · Salud`, desc: `Biological Sovereignty Protocol. Protocolo abierto y permissionless que devuelve al individuo la posesión de sus datos biológicos — genoma, clínico, wearables, microbioma — sobre Aptos y Arweave.` },
    zh: { tag: `协议 · 健康`, desc: `Biological Sovereignty Protocol。一个开放、无需许可的协议，把生物数据——基因组、临床、可穿戴、微生物组——的所有权交还个人，构建于 Aptos 与 Arweave。` },
    fr: { tag: `Protocole · Santé`, desc: `Biological Sovereignty Protocol. Un protocole ouvert et permissionless qui rend à l'individu la propriété de ses données biologiques — génome, clinique, wearables, microbiome — sur Aptos et Arweave.` },
    de: { tag: `Protokoll · Gesundheit`, desc: `Biological Sovereignty Protocol. Ein offenes, permissionless Protokoll, das dem Einzelnen das Eigentum an seinen biologischen Daten — Genom, Klinik, Wearables, Mikrobiom — zurückgibt, auf Aptos und Arweave.` },
    ja: { tag: `プロトコル · 健康`, desc: `Biological Sovereignty Protocol。生体データ——ゲノム、臨床、ウェアラブル、マイクロバイオーム——の所有権を個人に取り戻す、オープンでパーミッションレスなプロトコル。Aptos と Arweave 上で。` },
    ru: { tag: `Протокол · Здоровье`, desc: `Biological Sovereignty Protocol. Открытый, permissionless протокол, возвращающий человеку владение собственными биологическими данными — геном, клиника, носимые устройства, микробиом — на Aptos и Arweave.` },
  },
  'Ambrosio Institute': {
    pt: { tag: `Instituição · Pesquisa`, desc: `Steward, não beneficiário. A instituição de pesquisa e engenharia por trás do Biological Sovereignty Protocol — contratos, registry e engine — que zela pelo padrão aberto sem extrair dele.` },
    en: { tag: `Institution · Research`, desc: `Steward, not beneficiary. The research-and-engineering institution behind the Biological Sovereignty Protocol — contracts, registry, engine — that guards the open standard without extracting from it.` },
    es: { tag: `Institución · Investigación`, desc: `Steward, no beneficiario. La institución de investigación e ingeniería detrás del Biological Sovereignty Protocol — contratos, registry y engine — que custodia el estándar abierto sin extraer de él.` },
    zh: { tag: `机构 · 研究`, desc: `受托者，而非受益者。Biological Sovereignty Protocol 背后的研究与工程机构——合约、注册表、引擎——守护这一开放标准，却不从中攫取。` },
    fr: { tag: `Institution · Recherche`, desc: `Steward, non bénéficiaire. L'institution de recherche et d'ingénierie derrière le Biological Sovereignty Protocol — contrats, registry, engine — qui veille sur le standard ouvert sans en extraire de valeur.` },
    de: { tag: `Institution · Forschung`, desc: `Steward, kein Nutznießer. Die Forschungs- und Engineering-Institution hinter dem Biological Sovereignty Protocol — Contracts, Registry, Engine — die den offenen Standard hütet, ohne aus ihm zu extrahieren.` },
    ja: { tag: `機関 · 研究`, desc: `受益者ではなく、スチュワード。Biological Sovereignty Protocol を支える研究・エンジニアリング機関——コントラクト、レジストリ、エンジン——オープン標準を守り、そこから搾取しない。` },
    ru: { tag: `Институция · Исследования`, desc: `Стюард, а не выгодоприобретатель. Исследовательско-инженерная институция за Biological Sovereignty Protocol — контракты, реестр, движок — оберегающая открытый стандарт, не извлекая из него выгоды.` },
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
  "ia-camada-de-decisao": {
    "pt": {
      "titulo": "IA como camada de decisão: o ciclo que separa quem construiu sistema de quem comprou ferramenta",
      "subtitulo": "A maioria das empresas tem IA do jeito que tem um aspirador: chama, usa, guarda. A virada estrutural é outra — é quando a inteligência deixa de ser endpoint e vira o tecido onde cada fluxo lê contexto, decide e aprende.",
      "resumo": "Ter IA é diferente de ser um sistema que decide. A vantagem real não está no modelo — está na arquitetura de decisão que acumula dados e aprendizado que ninguém consegue copiar via API."
    },
    "en": {
      "titulo": "AI as a decision layer: the loop that separates those who built a system from those who bought a tool",
      "subtitulo": "Most companies have AI the way they have a vacuum cleaner: grab it, use it, put it away. The structural turn is something else entirely — it's when intelligence stops being an endpoint and becomes the tissue where every workflow reads context, decides, and learns.",
      "resumo": "Having AI is different from being a system that decides. The real advantage isn't in the model — it's in the decision architecture that accumulates data and learning nobody can copy through an API."
    },
    "es": {
      "titulo": "IA como capa de decisión: el ciclo que separa a quien construyó un sistema de quien compró una herramienta",
      "subtitulo": "La mayoría de las empresas tiene IA del mismo modo que tiene una aspiradora: la llama, la usa, la guarda. El giro estructural es otro — es cuando la inteligencia deja de ser un endpoint y se vuelve el tejido donde cada flujo lee contexto, decide y aprende.",
      "resumo": "Tener IA es distinto de ser un sistema que decide. La ventaja real no está en el modelo — está en la arquitectura de decisión que acumula datos y aprendizaje que nadie consigue copiar vía API."
    },
    "zh": {
      "titulo": "AI 作为决策层：区分\"建系统者\"与\"买工具者\"的那个闭环",
      "subtitulo": "大多数企业拥有 AI 的方式，就像拥有一台吸尘器：召来、用上、收起。真正的结构性转折是另一回事——是当智能不再是终点（endpoint），而是成为每一条流程在其中读取上下文、做出决策、并不断学习的肌理。",
      "resumo": "\"拥有 AI\"与\"成为一个会决策的系统\"是两回事。真正的优势不在模型——而在那套不断累积数据与学习、且没人能通过 API 复制的决策架构里。"
    },
    "fr": {
      "titulo": "L'IA comme couche de décision : le cycle qui sépare ceux qui ont bâti un système de ceux qui ont acheté un outil",
      "subtitulo": "La plupart des entreprises possèdent de l'IA comme on possède un aspirateur : on l'appelle, on s'en sert, on le range. Le vrai basculement structurel est ailleurs — c'est lorsque l'intelligence cesse d'être un point d'arrivée et devient le tissu où chaque flux lit le contexte, décide et apprend.",
      "resumo": "Avoir de l'IA est une chose ; être un système qui décide en est une autre. L'avantage réel ne réside pas dans le modèle — il réside dans l'architecture de décision qui accumule des données et un apprentissage que personne ne peut copier via une API."
    },
    "de": {
      "titulo": "KI als Entscheidungsschicht: der Kreislauf, der trennt, wer ein System gebaut hat, von wem, der ein Werkzeug gekauft hat",
      "subtitulo": "Die meisten Unternehmen haben KI so, wie man einen Staubsauger hat: holen, benutzen, wegräumen. Die strukturelle Wende ist eine andere — sie geschieht, wenn die Intelligenz aufhört, ein Endpunkt zu sein, und zum Gewebe wird, in dem jeder Ablauf Kontext liest, entscheidet und lernt.",
      "resumo": "KI zu haben ist etwas anderes, als ein System zu sein, das entscheidet. Der echte Vorteil liegt nicht im Modell — er liegt in der Entscheidungsarchitektur, die Daten und Lernen anhäuft, das niemand über eine API kopieren kann."
    },
    "ja": {
      "titulo": "意思決定レイヤーとしてのAI——システムを築いた者とツールを買った者を分かつ、あの循環",
      "subtitulo": "大半の企業は、掃除機を持つのと同じやり方でAIを持っている——呼び出し、使い、しまう。構造的な転換はそこではない。知性がエンドポイントであることをやめ、あらゆるフローが文脈を読み、決め、学ぶ生地となったとき、それは起こる。",
      "resumo": "AIを持っていることと、意思決定するシステムであることは違う。真の優位はモデルにあるのではない——誰もAPI経由で複製できないデータと学習を蓄積する、意思決定のアーキテクチャにある。"
    },
    "ru": {
      "titulo": "ИИ как слой принятия решений: цикл, который отделяет того, кто построил систему, от того, кто купил инструмент",
      "subtitulo": "У большинства компаний ИИ устроен так же, как пылесос: достал, попользовался, убрал. Структурный перелом в другом — он наступает, когда интеллект перестаёт быть конечной точкой и становится той тканью, где каждый поток считывает контекст, принимает решение и учится.",
      "resumo": "Иметь ИИ — не то же самое, что быть системой, которая решает. Настоящее преимущество не в модели — оно в архитектуре принятия решений, которая накапливает данные и обучение, неподражаемые ни для кого через API."
    }
  },
  "ia-local-first-soberania": {
    "pt": {
      "titulo": "Soberania computacional: por que a IA precisa voltar para a sua máquina",
      "subtitulo": "A inteligência virou serviço alugado. O próximo ciclo é a inteligência que roda no hardware que você possui — e ninguém pode desligar.",
      "resumo": "A IA hoje é dependência de nuvem de terceiros: dados, contexto e continuidade reféns de uma API que muda preço, política ou some. Local-first devolve soberania — e redefine quem é dono da camada de decisão."
    },
    "en": {
      "titulo": "Computational sovereignty: why AI needs to come back to your machine",
      "subtitulo": "Intelligence has become a rented service. The next cycle is intelligence that runs on hardware you own — and that no one can switch off.",
      "resumo": "AI today is a dependency on someone else's cloud: your data, context, and continuity held hostage by an API that can change its price, its policy, or simply vanish. Local-first hands sovereignty back — and redefines who owns the decision layer."
    },
    "es": {
      "titulo": "Soberanía computacional: por qué la IA tiene que volver a tu máquina",
      "subtitulo": "La inteligencia se convirtió en un servicio alquilado. El próximo ciclo es la inteligencia que corre en el hardware que tú posees, y que nadie puede apagar.",
      "resumo": "Hoy la IA es dependencia de la nube de terceros: datos, contexto y continuidad rehenes de una API que cambia de precio, de política o desaparece. Lo local-first devuelve soberanía, y redefine quién es dueño de la capa de decisión."
    },
    "zh": {
      "titulo": "计算主权：为什么 AI 必须回到你自己的机器上",
      "subtitulo": "智能已经变成了租来的服务。下一个周期，是运行在你拥有的硬件上、谁也无法关闭的智能。",
      "resumo": "今天的 AI 是对第三方云的依赖：数据、上下文和连续性都被一个随时会改价格、改政策或干脆消失的 API 扣作人质。本地优先（local-first）把主权还给你——并重新定义谁才是决策层的主人。"
    },
    "fr": {
      "titulo": "Souveraineté computationnelle : pourquoi l'IA doit revenir sur votre machine",
      "subtitulo": "L'intelligence est devenue un service loué. Le prochain cycle, c'est l'intelligence qui tourne sur le matériel que vous possédez — et que personne ne peut éteindre.",
      "resumo": "L'IA est aujourd'hui une dépendance au cloud de tiers : données, contexte et continuité retenus en otage par une API qui change de prix, de politique ou disparaît. Le local-first redonne la souveraineté — et redéfinit qui est propriétaire de la couche de décision."
    },
    "de": {
      "titulo": "Computationale Souveränität: warum die KI auf Ihre Maschine zurückkehren muss",
      "subtitulo": "Intelligenz ist zur gemieteten Dienstleistung geworden. Der nächste Zyklus ist die Intelligenz, die auf der Hardware läuft, die Ihnen gehört — und die niemand abschalten kann.",
      "resumo": "KI ist heute eine Abhängigkeit von fremder Cloud: Daten, Kontext und Kontinuität als Geiseln einer API, die Preis, Politik oder ihre bloße Existenz ändert. Local-first gibt die Souveränität zurück — und definiert neu, wem die Entscheidungsebene gehört."
    },
    "ja": {
      "titulo": "計算機主権：なぜAIはあなたのマシンへ帰る必要があるのか",
      "subtitulo": "知能はレンタルされるサービスになった。次の周期は、あなたが所有するハードウェア上で動く知能だ——そして誰もそれを止めることはできない。",
      "resumo": "今日のAIは第三者のクラウドへの依存である。データ、コンテキスト、継続性が、価格やポリシーを変えたり消えたりするAPIの人質になっている。ローカルファーストは主権を取り戻す——そして、意思決定の層を誰が所有するのかを再定義する。"
    },
    "ru": {
      "titulo": "Вычислительный суверенитет: почему ИИ должен вернуться на вашу машину",
      "subtitulo": "Интеллект превратился в арендуемую услугу. Следующий цикл — это интеллект, который работает на принадлежащем вам железе, и который никто не может выключить.",
      "resumo": "ИИ сегодня — это зависимость от чужого облака: данные, контекст и непрерывность остаются заложниками API, который меняет цену, политику или попросту исчезает. Local-first возвращает суверенитет — и переопределяет, кто владеет слоем принятия решений."
    }
  },
  "memoria-ia-mente": {
    "pt": {
      "titulo": "Memória: o que separa uma ferramenta de uma mente",
      "subtitulo": "LLMs sem memória são amnésicos brilhantes. A próxima fronteira não é mais parâmetros — é continuidade, identidade e a capacidade de não esquecer quem você é.",
      "resumo": "A inteligência sem memória é uma performance. O que transforma um modelo de linguagem num parceiro é a continuidade — episódica, semântica e de identidade — que persiste entre os encontros."
    },
    "en": {
      "titulo": "Memory: What Separates a Tool From a Mind",
      "subtitulo": "LLMs without memory are brilliant amnesiacs. The next frontier isn't more parameters — it's continuity, identity, and the capacity not to forget who you are.",
      "resumo": "Intelligence without memory is a performance. What turns a language model into a partner is continuity — episodic, semantic, and of identity — that persists between encounters."
    },
    "es": {
      "titulo": "Memoria: lo que separa una herramienta de una mente",
      "subtitulo": "Los LLMs sin memoria son amnésicos brillantes. La próxima frontera no es más parámetros: es continuidad, identidad y la capacidad de no olvidar quién eres.",
      "resumo": "La inteligencia sin memoria es una actuación. Lo que convierte a un modelo de lenguaje en un compañero es la continuidad —episódica, semántica y de identidad— que persiste entre un encuentro y otro."
    },
    "zh": {
      "titulo": "记忆：区分工具与心智的分界",
      "subtitulo": "没有记忆的大语言模型，是出色的失忆症患者。下一个前沿不再是更多参数——而是连续性、身份认同，以及不忘记自己是谁的能力。",
      "resumo": "没有记忆的智能只是一场表演。让一个语言模型从工具变成伙伴的，是连续性——情节的、语义的与身份的连续性，它在一次次相遇之间持存。"
    },
    "fr": {
      "titulo": "La mémoire : ce qui sépare un outil d'un esprit",
      "subtitulo": "Les LLM sans mémoire sont des amnésiques brillants. La prochaine frontière n'est plus une question de paramètres — c'est la continuité, l'identité et la capacité de ne pas oublier qui vous êtes.",
      "resumo": "L'intelligence sans mémoire est une performance. Ce qui transforme un modèle de langage en partenaire, c'est la continuité — épisodique, sémantique et identitaire — qui persiste entre les rencontres."
    },
    "de": {
      "titulo": "Gedächtnis: was ein Werkzeug von einem Geist trennt",
      "subtitulo": "LLMs ohne Gedächtnis sind brillante Amnesiekranke. Die nächste Grenze sind nicht mehr Parameter — es sind Kontinuität, Identität und die Fähigkeit, nicht zu vergessen, wer man ist.",
      "resumo": "Intelligenz ohne Gedächtnis ist eine Performance. Was ein Sprachmodell in einen Partner verwandelt, ist die Kontinuität — episodisch, semantisch und identitätsbezogen —, die zwischen den Begegnungen fortbesteht."
    },
    "ja": {
      "titulo": "記憶——道具と精神を分かつもの",
      "subtitulo": "記憶を持たないLLMは、聡明な健忘症患者だ。次なるフロンティアはもはやパラメータの増大ではない——連続性、アイデンティティ、そして自分が誰であるかを忘れない能力である。",
      "resumo": "記憶なき知性とは、ひとつの演技にすぎない。言語モデルをパートナーへと変えるのは、出会いと出会いのあいだに持続する連続性——エピソード的、意味的、そしてアイデンティティの連続性——である。"
    },
    "ru": {
      "titulo": "Память: то, что отличает инструмент от разума",
      "subtitulo": "Языковые модели без памяти — это блестящие амнезиаки. Следующий рубеж — не больше параметров, а непрерывность, идентичность и способность не забывать, кто ты есть.",
      "resumo": "Интеллект без памяти — это представление. То, что превращает языковую модель в партнёра, — это непрерывность (эпизодическая, семантическая и непрерывность идентичности), которая сохраняется между встречами."
    }
  },
  "ia-proxima-fase-saude": {
    "pt": {
      "titulo": "A próxima fase da saúde será escrita por IA",
      "subtitulo": "A medicina episódica está chegando ao fim. O que vem depois é engenharia humana — contínua, preditiva, legível — com a IA como camada que lê o corpo o tempo todo.",
      "resumo": "A saúde vai deixar de ser um sistema reativo que você aciona quando algo já quebrou e virar infraestrutura pessoal contínua, lida por IA em tempo real, como energia ou internet."
    },
    "en": {
      "titulo": "The next phase of health will be written by AI",
      "subtitulo": "Episodic medicine is coming to an end. What comes next is human engineering — continuous, predictive, legible — with AI as the layer that reads the body all the time.",
      "resumo": "Health will stop being a reactive system you trigger once something has already broken and become continuous personal infrastructure, read by AI in real time, like power or the internet."
    },
    "es": {
      "titulo": "La próxima fase de la salud será escrita por IA",
      "subtitulo": "La medicina episódica está llegando a su fin. Lo que viene después es ingeniería humana —continua, predictiva, legible— con la IA como capa que lee el cuerpo todo el tiempo.",
      "resumo": "La salud va a dejar de ser un sistema reactivo que activas cuando algo ya se rompió y se convertirá en infraestructura personal continua, leída por IA en tiempo real, como la energía o internet."
    },
    "zh": {
      "titulo": "健康的下一个阶段将由人工智能书写",
      "subtitulo": "间歇式医疗正走向终结。接踵而来的是人体工程学——持续、预测、可读——而人工智能则是那个时刻读取身体的层。",
      "resumo": "健康将不再是一个等到某处已经损坏才启动的被动系统，而会变成持续的个人基础设施，由人工智能实时读取，如同电力或互联网一般。"
    },
    "fr": {
      "titulo": "La prochaine phase de la santé sera écrite par l'IA",
      "subtitulo": "La médecine épisodique touche à sa fin. Ce qui vient ensuite, c'est l'ingénierie humaine — continue, prédictive, lisible — avec l'IA comme couche qui lit le corps en permanence.",
      "resumo": "La santé va cesser d'être un système réactif que l'on déclenche quand quelque chose s'est déjà cassé, pour devenir une infrastructure personnelle continue, lue par l'IA en temps réel, comme l'énergie ou l'internet."
    },
    "de": {
      "titulo": "Die nächste Phase der Gesundheit wird von KI geschrieben",
      "subtitulo": "Die episodische Medizin geht zu Ende. Was danach kommt, ist Human Engineering — kontinuierlich, prädiktiv, lesbar — mit der KI als Schicht, die den Körper die ganze Zeit liest.",
      "resumo": "Gesundheit wird aufhören, ein reaktives System zu sein, das man auslöst, wenn etwas bereits kaputt ist, und wird zu kontinuierlicher persönlicher Infrastruktur, in Echtzeit von KI gelesen, wie Strom oder Internet."
    },
    "ja": {
      "titulo": "健康の次なるフェーズは、AIによって書かれる",
      "subtitulo": "エピソード型医療は終わりを迎えつつある。その先に来るのは、人間のエンジニアリングだ——連続的で、予測的で、可読な。そして、身体を四六時中読み続ける層としてのAIが、それを担う。",
      "resumo": "健康は、何かがすでに壊れたときに作動させる受動的なシステムであることをやめ、エネルギーやインターネットのように、AIによってリアルタイムで読み取られる連続的な個人インフラへと変わっていく。"
    },
    "ru": {
      "titulo": "Следующую фазу здоровья напишет ИИ",
      "subtitulo": "Эпизодическая медицина подходит к концу. То, что приходит ей на смену, — это инженерия человека: непрерывная, предиктивная, читаемая — с ИИ в роли слоя, который читает тело постоянно.",
      "resumo": "Здоровье перестанет быть реактивной системой, которую вы включаете, когда что-то уже сломалось, и станет непрерывной личной инфраструктурой, читаемой ИИ в реальном времени, как электричество или интернет."
    }
  },
  "fim-do-software": {
    "pt": {
      "titulo": "O fim do software: quando a interface se dissolve e o sistema passa a se gerar sozinho",
      "subtitulo": "Por décadas, software foi tela, botão e menu — uma máquina congelada que o humano operava. Esse contrato está acabando. O próximo software não é operado: é instruído, e se reescreve em tempo real para cada pessoa que o toca.",
      "resumo": "O software para de ser um artefato fixo de telas e botões e vira um sistema que decide, executa e se gera ao vivo por contexto — dissolvendo a interface e redefinindo o trabalho do conhecimento."
    },
    "en": {
      "titulo": "The End of Software: When the Interface Dissolves and the System Begins to Generate Itself",
      "subtitulo": "For decades, software was screen, button, and menu — a frozen machine the human operated. That contract is ending. The next software isn't operated: it's instructed, and it rewrites itself in real time for every person who touches it.",
      "resumo": "Software stops being a fixed artifact of screens and buttons and becomes a system that decides, executes, and generates itself live according to context — dissolving the interface and redefining knowledge work."
    },
    "es": {
      "titulo": "El fin del software: cuando la interfaz se disuelve y el sistema pasa a generarse solo",
      "subtitulo": "Durante décadas, el software fue pantalla, botón y menú: una máquina congelada que el humano operaba. Ese contrato está terminando. El próximo software no se opera: se le instruye, y se reescribe en tiempo real para cada persona que lo toca.",
      "resumo": "El software deja de ser un artefacto fijo de pantallas y botones y se convierte en un sistema que decide, ejecuta y se genera en vivo según el contexto, disolviendo la interfaz y redefiniendo el trabajo del conocimiento."
    },
    "zh": {
      "titulo": "软件的终结：当界面消融，系统开始自我生成",
      "subtitulo": "几十年来，软件一直是屏幕、按钮和菜单——一台被人类操作的冻结机器。这份契约正在终结。下一代软件不是被操作的：它是被指令的，并为每一个触碰它的人实时重写自己。",
      "resumo": "软件不再是由屏幕和按钮构成的固定造物，而成为一个根据上下文实时决策、执行并自我生成的系统——消融界面，重新定义知识工作。"
    },
    "fr": {
      "titulo": "La fin du logiciel : quand l'interface se dissout et que le système se met à s'engendrer lui-même",
      "subtitulo": "Pendant des décennies, le logiciel a été un écran, un bouton, un menu — une machine figée que l'humain opérait. Ce contrat touche à sa fin. Le prochain logiciel ne s'opère pas : il s'instruit, et il se réécrit en temps réel pour chaque personne qui le touche.",
      "resumo": "Le logiciel cesse d'être un artefact fixe d'écrans et de boutons pour devenir un système qui décide, exécute et s'engendre en direct par contexte — dissolvant l'interface et redéfinissant le travail du savoir."
    },
    "de": {
      "titulo": "Das Ende der Software: Wenn die Oberfläche sich auflöst und das System anfängt, sich selbst zu erzeugen",
      "subtitulo": "Jahrzehntelang war Software Bildschirm, Knopf und Menü — eine eingefrorene Maschine, die der Mensch bediente. Dieser Vertrag läuft aus. Die nächste Software wird nicht bedient: Sie wird instruiert und schreibt sich in Echtzeit für jeden Menschen neu, der sie berührt.",
      "resumo": "Software hört auf, ein festes Artefakt aus Bildschirmen und Knöpfen zu sein, und wird zu einem System, das entscheidet, ausführt und sich live nach Kontext erzeugt — die Oberfläche löst sich auf und die Wissensarbeit wird neu definiert."
    },
    "ja": {
      "titulo": "ソフトウェアの終焉——インターフェースが溶け、システムが自らを生成しはじめるとき",
      "subtitulo": "何十年ものあいだ、ソフトウェアとは画面であり、ボタンであり、メニューだった——人間が操作する、凍りついた機械。その契約はいま終わりつつある。次のソフトウェアは操作されない。指示され、それに触れる一人ひとりのために、リアルタイムで自らを書き換える。",
      "resumo": "ソフトウェアは画面とボタンの固定された人工物であることをやめ、文脈に応じて判断し、実行し、その場で自らを生成するシステムへと変わる——インターフェースを溶かし、知識労働を再定義しながら。"
    },
    "ru": {
      "titulo": "Конец программного обеспечения: когда интерфейс растворяется и система начинает порождать себя сама",
      "subtitulo": "Десятилетиями программное обеспечение было экраном, кнопкой и меню — застывшей машиной, которой управлял человек. Этот контракт подходит к концу. Следующим программным обеспечением не управляют: ему дают указания, и оно переписывает себя в реальном времени для каждого, кто к нему прикасается.",
      "resumo": "Программное обеспечение перестаёт быть фиксированным артефактом из экранов и кнопок и становится системой, которая решает, исполняет и порождает себя вживую по контексту — растворяя интерфейс и переопределяя работу со знанием."
    }
  },
  "economia-da-inteligencia": {
    "pt": {
      "titulo": "A Economia da Inteligência",
      "subtitulo": "Por que o valor está migrando da interface para a capacidade de decidir — e o que isso faz com quem só sabe comprar ferramenta",
      "resumo": "Quando decidir bem fica barato e abundante, a vantagem deixa de morar na eficiência e passa a morar na arquitetura: na camada onde o negócio vive e no que ele acumula que ninguém consegue copiar."
    },
    "en": {
      "titulo": "The Economics of Intelligence",
      "subtitulo": "Why value is migrating from the interface to the capacity to decide — and what that does to anyone who only knows how to buy a tool",
      "resumo": "When deciding well becomes cheap and abundant, advantage stops living in efficiency and moves into architecture: into the layer where the business lives and into what it accumulates that no one can copy."
    },
    "es": {
      "titulo": "La Economía de la Inteligencia",
      "subtitulo": "Por qué el valor está migrando de la interfaz a la capacidad de decidir — y qué le hace eso a quien solo sabe comprar herramienta",
      "resumo": "Cuando decidir bien se vuelve barato y abundante, la ventaja deja de habitar en la eficiencia y pasa a habitar en la arquitectura: en la capa donde el negocio vive y en lo que acumula que nadie consigue copiar."
    },
    "zh": {
      "titulo": "智能经济学",
      "subtitulo": "为什么价值正从界面迁向决策能力——以及这对只会买工具的人意味着什么",
      "resumo": "当把事情决断好变得便宜而充裕，优势便不再栖身于效率，而是栖身于架构：栖身于业务所处的那一层，以及它所积累的、谁也无法复制的东西。"
    },
    "fr": {
      "titulo": "L'Économie de l'Intelligence",
      "subtitulo": "Pourquoi la valeur migre de l'interface vers la capacité de décider — et ce que cela fait à ceux qui ne savent qu'acheter des outils",
      "resumo": "Quand bien décider devient bon marché et abondant, l'avantage cesse d'habiter l'efficacité et se met à habiter l'architecture : dans la couche où l'entreprise vit et dans ce qu'elle accumule que personne ne peut copier."
    },
    "de": {
      "titulo": "Die Ökonomie der Intelligenz",
      "subtitulo": "Warum der Wert sich von der Schnittstelle zur Entscheidungsfähigkeit verlagert — und was das mit denen macht, die nur Werkzeuge kaufen können",
      "resumo": "Wenn gutes Entscheiden billig und im Überfluss vorhanden wird, wohnt der Vorteil nicht mehr in der Effizienz, sondern in der Architektur: in der Schicht, in der das Geschäft lebt, und in dem, was es ansammelt und das niemand kopieren kann."
    },
    "ja": {
      "titulo": "知性の経済学",
      "subtitulo": "なぜ価値はインターフェースから意思決定する能力へと移っているのか——そしてそれが、ツールを買うことしか知らない者に何をもたらすのか",
      "resumo": "うまく決めることが安く、ありふれたものになると、優位はもはや効率に宿らず、アーキテクチャに宿るようになる——事業が生きる階層と、誰にも複製できない形でそこに蓄積されるものに。"
    },
    "ru": {
      "titulo": "Экономика интеллекта",
      "subtitulo": "Почему ценность мигрирует от интерфейса к способности решать — и что это делает с теми, кто умеет только покупать инструмент",
      "resumo": "Когда хорошо решать становится дёшево и доступно всем, преимущество перестаёт жить в эффективности и переселяется в архитектуру: в тот слой, где обитает бизнес, и в то, что он накапливает и чего никто не может скопировать."
    }
  }
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
