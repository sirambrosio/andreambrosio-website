import type { Locale } from '@/lib/i18n';

type L8 = Record<Locale, string>;
type HP = { label: L8; desc: L8 };
type SEC = { h: L8; p: L8 };

export const CONTACT_EMAIL = 'eu@andreambrosio.com';

export const CONTATO: {
  eyebrow: L8; title: L8; lead: L8; emailLabel: L8;
  intents: { imprensa: HP; parceria: HP; investimento: HP; geral: HP };
} = {
  "eyebrow": {
    "pt": "Contato",
    "en": "Contact",
    "es": "Contacto",
    "zh": "联系",
    "fr": "Contact",
    "de": "Kontakt",
    "ja": "連絡先",
    "ru": "Контакт"
  },
  "title": {
    "pt": "Vamos conversar.",
    "en": "Let's talk.",
    "es": "Hablemos.",
    "zh": "聊一聊。",
    "fr": "Parlons.",
    "de": "Sprechen wir.",
    "ja": "話しましょう。",
    "ru": "Давайте поговорим."
  },
  "lead": {
    "pt": "Escolha o assunto e vá direto ao e-mail — sem formulário, sem intermediário.",
    "en": "Choose the subject and go straight to email — no form, no middleman.",
    "es": "Elige el asunto y ve directo al correo — sin formulario, sin intermediario.",
    "zh": "选择主题，直接进入邮件——没有表单，没有中间人。",
    "fr": "Choisissez le sujet et passez directement à l'e-mail — sans formulaire, sans intermédiaire.",
    "de": "Wählen Sie das Thema und gehen Sie direkt zur E-Mail — ohne Formular, ohne Vermittler.",
    "ja": "用件を選んで、そのままメールへ——フォームも仲介もなし。",
    "ru": "Выберите тему и пишите сразу на почту — без формы, без посредника."
  },
  "emailLabel": {
    "pt": "Ou escreva direto:",
    "en": "Or write directly:",
    "es": "O escribe directamente:",
    "zh": "或直接写信：",
    "fr": "Ou écrivez directement :",
    "de": "Oder schreiben Sie direkt:",
    "ja": "または直接メールを：",
    "ru": "Или напишите напрямую:"
  },
  "intents": {
    "imprensa": {
      "label": {
        "pt": "Imprensa",
        "en": "Press",
        "es": "Prensa",
        "zh": "媒体",
        "fr": "Presse",
        "de": "Presse",
        "ja": "メディア",
        "ru": "Пресса"
      },
      "desc": {
        "pt": "Entrevistas, citações e contato de mídia.",
        "en": "Interviews, quotes and media inquiries.",
        "es": "Entrevistas, citas y contacto de medios.",
        "zh": "采访、引用与媒体咨询。",
        "fr": "Interviews, citations et contacts médias.",
        "de": "Interviews, Zitate und Medienanfragen.",
        "ja": "取材、引用、メディアからのお問い合わせ。",
        "ru": "Интервью, цитаты и запросы СМИ."
      }
    },
    "parceria": {
      "label": {
        "pt": "Parceria",
        "en": "Partnership",
        "es": "Alianza",
        "zh": "合作",
        "fr": "Partenariat",
        "de": "Partnerschaft",
        "ja": "パートナーシップ",
        "ru": "Партнёрство"
      },
      "desc": {
        "pt": "Colaborações, joint ventures e integrações.",
        "en": "Collaborations, joint ventures and integrations.",
        "es": "Colaboraciones, joint ventures e integraciones.",
        "zh": "协作、合资与集成。",
        "fr": "Collaborations, coentreprises et intégrations.",
        "de": "Kooperationen, Joint Ventures und Integrationen.",
        "ja": "協業、ジョイントベンチャー、連携。",
        "ru": "Сотрудничество, совместные предприятия и интеграции."
      }
    },
    "investimento": {
      "label": {
        "pt": "Investimento",
        "en": "Investment",
        "es": "Inversión",
        "zh": "投资",
        "fr": "Investissement",
        "de": "Investition",
        "ja": "投資",
        "ru": "Инвестиции"
      },
      "desc": {
        "pt": "Investidores e rodadas de captação.",
        "en": "Investors and fundraising rounds.",
        "es": "Inversores y rondas de financiación.",
        "zh": "投资人与融资轮次。",
        "fr": "Investisseurs et levées de fonds.",
        "de": "Investoren und Finanzierungsrunden.",
        "ja": "投資家と資金調達ラウンド。",
        "ru": "Инвесторы и раунды привлечения капитала."
      }
    },
    "geral": {
      "label": {
        "pt": "Geral",
        "en": "General",
        "es": "General",
        "zh": "其他",
        "fr": "Général",
        "de": "Allgemein",
        "ja": "その他",
        "ru": "Общее"
      },
      "desc": {
        "pt": "Qualquer outro assunto.",
        "en": "Any other matter.",
        "es": "Cualquier otro asunto.",
        "zh": "任何其他事项。",
        "fr": "Tout autre sujet.",
        "de": "Jedes andere Anliegen.",
        "ja": "その他のご用件。",
        "ru": "Любой другой вопрос."
      }
    }
  }
};

export const PRIVACIDADE: {
  eyebrow: L8; title: L8; lead: L8; updatedLabel: L8;
  sections: { dados: SEC; base: SEC; retencao: SEC; direitos: SEC; contato: SEC };
} = {
  "eyebrow": {
    "pt": "Privacidade",
    "en": "Privacy",
    "es": "Privacidad",
    "zh": "隐私",
    "fr": "Confidentialité",
    "de": "Datenschutz",
    "ja": "プライバシー",
    "ru": "Конфиденциальность"
  },
  "title": {
    "pt": "Privacidade",
    "en": "Privacy",
    "es": "Privacidad",
    "zh": "隐私",
    "fr": "Confidentialité",
    "de": "Datenschutz",
    "ja": "プライバシー",
    "ru": "Конфиденциальность"
  },
  "lead": {
    "pt": "Este site coleta o mínimo: só o seu e-mail, quando você escolhe se inscrever.",
    "en": "This site collects the bare minimum: just your email, when you choose to subscribe.",
    "es": "Este sitio recopila lo mínimo: solo tu correo, cuando eliges suscribirte.",
    "zh": "本网站只收集最少的信息：仅在你选择订阅时留下的邮箱。",
    "fr": "Ce site collecte le strict minimum : seulement votre e-mail, lorsque vous choisissez de vous inscrire.",
    "de": "Diese Website erhebt das absolute Minimum: nur Ihre E-Mail-Adresse, wenn Sie sich anmelden.",
    "ja": "このサイトが集めるのは最小限だけ。あなたが購読を選んだときのメールアドレスのみです。",
    "ru": "Этот сайт собирает минимум — только ваш e-mail, когда вы сами решаете подписаться."
  },
  "updatedLabel": {
    "pt": "Última atualização",
    "en": "Last updated",
    "es": "Última actualización",
    "zh": "最后更新",
    "fr": "Dernière mise à jour",
    "de": "Zuletzt aktualisiert",
    "ja": "最終更新",
    "ru": "Последнее обновление"
  },
  "sections": {
    "dados": {
      "h": {
        "pt": "O que coletamos",
        "en": "What we collect",
        "es": "Qué recopilamos",
        "zh": "我们收集什么",
        "fr": "Ce que nous collectons",
        "de": "Was wir erheben",
        "ja": "収集する情報",
        "ru": "Что мы собираем"
      },
      "p": {
        "pt": "Apenas quando você se inscreve na newsletter: seu e-mail, o idioma escolhido e a página de origem da inscrição. Nada mais. Não usamos cookies de rastreamento; medimos apenas visitas de página de forma anônima, no nosso próprio servidor (sem identificar você).",
        "en": "Only when you subscribe to the newsletter: your email, the language you chose, and the page the signup came from. Nothing else. We use no tracking cookies; we only measure page visits anonymously, on our own server (without identifying you).",
        "es": "Solo cuando te suscribes a la newsletter: tu correo, el idioma elegido y la página de origen de la inscripción. Nada más. No usamos cookies de rastreo; solo medimos visitas de página de forma anónima, en nuestro propio servidor (sin identificarte).",
        "zh": "仅在你订阅通讯时收集：你的邮箱、所选语言，以及订阅来源页面。仅此而已。我们不使用跟踪 Cookie；仅在自有服务器上匿名统计页面访问（不识别你的身份）。",
        "fr": "Uniquement lorsque vous vous inscrivez à la newsletter : votre e-mail, la langue choisie et la page d'où vient l'inscription. Rien d'autre. Nous n'utilisons aucun cookie de suivi ; nous mesurons seulement les visites de page de façon anonyme, sur notre propre serveur (sans vous identifier).",
        "de": "Nur wenn Sie den Newsletter abonnieren: Ihre E-Mail-Adresse, die gewählte Sprache und die Seite, von der die Anmeldung kam. Sonst nichts. Wir verwenden keine Tracking-Cookies; wir messen nur Seitenaufrufe anonym, auf unserem eigenen Server (ohne Sie zu identifizieren).",
        "ja": "ニュースレターを購読したときだけ集めます。メールアドレス、選んだ言語、登録元のページ。それだけです。トラッキング用 Cookie は使いません。ページの訪問数を、自社サーバー上で匿名に集計するだけです（あなたを特定しません）。",
        "ru": "Только когда вы подписываетесь на рассылку: ваш e-mail, выбранный язык и страница, с которой пришла подписка. Больше ничего. Мы не используем отслеживающие cookie; мы лишь анонимно считаем посещения страниц на собственном сервере (не идентифицируя вас)."
      }
    },
    "base": {
      "h": {
        "pt": "Base legal",
        "en": "Legal basis",
        "es": "Base legal",
        "zh": "法律依据",
        "fr": "Base légale",
        "de": "Rechtsgrundlage",
        "ja": "法的根拠",
        "ru": "Правовое основание"
      },
      "p": {
        "pt": "O tratamento se baseia no seu consentimento: você só entra na lista porque escolheu se inscrever. Usamos esses dados exclusivamente para enviar a newsletter.",
        "en": "Processing is based on your consent: you're only on the list because you chose to subscribe. We use this data solely to send the newsletter.",
        "es": "El tratamiento se basa en tu consentimiento: estás en la lista solo porque elegiste suscribirte. Usamos estos datos únicamente para enviar la newsletter.",
        "zh": "数据处理基于你的同意：你在名单中，只因为你主动选择了订阅。我们仅将这些数据用于发送通讯。",
        "fr": "Le traitement repose sur votre consentement : vous n'êtes sur la liste que parce que vous avez choisi de vous inscrire. Ces données servent uniquement à envoyer la newsletter.",
        "de": "Die Verarbeitung beruht auf Ihrer Einwilligung: Sie stehen nur auf der Liste, weil Sie sich angemeldet haben. Wir nutzen diese Daten ausschließlich für den Versand des Newsletters.",
        "ja": "処理の根拠はあなたの同意です。リストに載るのは、あなた自身が購読を選んだからです。このデータはニュースレターの配信だけに使います。",
        "ru": "Обработка основана на вашем согласии: вы в списке только потому, что сами подписались. Эти данные используются исключительно для отправки рассылки."
      }
    },
    "retencao": {
      "h": {
        "pt": "Por quanto tempo",
        "en": "How long we keep it",
        "es": "Durante cuánto tiempo",
        "zh": "保留多久",
        "fr": "Durée de conservation",
        "de": "Speicherdauer",
        "ja": "保存期間",
        "ru": "Срок хранения"
      },
      "p": {
        "pt": "Guardamos seu e-mail enquanto você quiser receber a newsletter. Quando você cancela, removemos o registro. Não vendemos nem compartilhamos seus dados com terceiros.",
        "en": "We keep your email for as long as you want to receive the newsletter. When you unsubscribe, we delete the record. We never sell or share your data with third parties.",
        "es": "Conservamos tu correo mientras quieras recibir la newsletter. Cuando cancelas, eliminamos el registro. No vendemos ni compartimos tus datos con terceros.",
        "zh": "只要你想继续收到通讯，我们就保留你的邮箱。一旦你取消订阅，我们便删除该记录。我们绝不向第三方出售或分享你的数据。",
        "fr": "Nous conservons votre e-mail tant que vous souhaitez recevoir la newsletter. Lorsque vous vous désinscrivez, nous supprimons l'enregistrement. Nous ne vendons ni ne partageons jamais vos données avec des tiers.",
        "de": "Wir speichern Ihre E-Mail-Adresse, solange Sie den Newsletter erhalten möchten. Bei Abmeldung löschen wir den Eintrag. Wir verkaufen oder teilen Ihre Daten niemals mit Dritten.",
        "ja": "ニュースレターを受け取りたい間は、メールアドレスを保管します。購読を解除すれば、その記録は削除します。あなたのデータを第三者に販売・共有することは一切ありません。",
        "ru": "Мы храним ваш e-mail столько, сколько вы хотите получать рассылку. После отписки запись удаляется. Мы никогда не продаём и не передаём ваши данные третьим лицам."
      }
    },
    "direitos": {
      "h": {
        "pt": "Seus direitos",
        "en": "Your rights",
        "es": "Tus derechos",
        "zh": "你的权利",
        "fr": "Vos droits",
        "de": "Ihre Rechte",
        "ja": "あなたの権利",
        "ru": "Ваши права"
      },
      "p": {
        "pt": "Você pode acessar, corrigir, cancelar a inscrição ou pedir a exclusão dos seus dados a qualquer momento. Basta escrever para eu@andreambrosio.com e eu resolvo.",
        "en": "You can access, correct, unsubscribe, or request deletion of your data at any time. Just write to eu@andreambrosio.com and I'll take care of it.",
        "es": "Puedes acceder, corregir, cancelar la suscripción o pedir la eliminación de tus datos en cualquier momento. Solo escribe a eu@andreambrosio.com y me encargo.",
        "zh": "你随时可以访问、更正、取消订阅或要求删除你的数据。只需写信至 eu@andreambrosio.com，我会处理。",
        "fr": "Vous pouvez à tout moment accéder à vos données, les corriger, vous désinscrire ou en demander la suppression. Écrivez simplement à eu@andreambrosio.com et je m'en occupe.",
        "de": "Sie können jederzeit auf Ihre Daten zugreifen, sie korrigieren, sich abmelden oder ihre Löschung verlangen. Schreiben Sie einfach an eu@andreambrosio.com, und ich kümmere mich darum.",
        "ja": "いつでもデータの確認・修正・購読解除・削除を求められます。eu@andreambrosio.com に連絡いただければ、私が対応します。",
        "ru": "Вы в любой момент можете получить доступ к своим данным, исправить их, отписаться или запросить удаление. Просто напишите на eu@andreambrosio.com — и я всё сделаю."
      }
    },
    "contato": {
      "h": {
        "pt": "Contato",
        "en": "Contact",
        "es": "Contacto",
        "zh": "联系方式",
        "fr": "Contact",
        "de": "Kontakt",
        "ja": "連絡先",
        "ru": "Контакт"
      },
      "p": {
        "pt": "O responsável pelos dados é Andre Ambrósio. Para qualquer assunto de privacidade, escreva para eu@andreambrosio.com.",
        "en": "The data controller is Andre Ambrósio. For any privacy matter, write to eu@andreambrosio.com.",
        "es": "El responsable de los datos es Andre Ambrósio. Para cualquier asunto de privacidad, escribe a eu@andreambrosio.com.",
        "zh": "数据控制者为 Andre Ambrósio。如有任何隐私事宜，请写信至 eu@andreambrosio.com。",
        "fr": "Le responsable du traitement est Andre Ambrósio. Pour toute question de confidentialité, écrivez à eu@andreambrosio.com.",
        "de": "Verantwortlicher für die Daten ist Andre Ambrósio. Bei Fragen zum Datenschutz schreiben Sie an eu@andreambrosio.com.",
        "ja": "データ管理者は Andre Ambrósio です。プライバシーに関するご連絡は eu@andreambrosio.com まで。",
        "ru": "Контролёр данных — Andre Ambrósio. По любым вопросам конфиденциальности пишите на eu@andreambrosio.com."
      }
    }
  }
};
