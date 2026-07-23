import type { Dictionary } from "./en";

export const cs = {
  nav: {
    results: "Výsledky",
    pricing: "Ceny",
    faq: "FAQ",
    signIn: "Přihlásit se",
    getStarted: "Začít",
  },

  stickyCta: {
    label: "Začít",
    sub: "Jednorázová platba · {photoCount} fotek",
  },

  hero: {
    badge: "80 % seznamovacích profilů je ignorováno. Buďte mezi těmi 20 %",
    titleLine1: "Seznamovací fotky navržené",
    titleAccent: "pro její oči",
    titleAccentAlt: "pro jeho oči",
    titleLine2: "ne pro vaše ego",
    subtitle:
      "Naše proprietární AI analyzuje, co skutečně zastaví swipe, a přestaví váš profil s přirozenými, magazínovými fotkami, které odpovídají vaší skutečné estetice. Žádný plastický AI vzhled. Žádné viditelné artefakty",
    cta: "Proměnit můj profil",
    ctaSecondary: "Podívat se na reálné výsledky",
    ratingLabel: "hodnoceno singles, kteří přestali být ignorováni",
  },

  trustBar: {
    label: "Důvěřují nám singles, kteří uspívají na",
  },

  proof: {
    kicker: "Matematika je krutá",
    title: "Máte jeden swipe, abyste ji přiměli zastavit",
    titleAlt: "Máte jeden swipe, abyste ho přiměli zastavit",
    body: "80 % seznamovacích profilů je ignorováno - ne kvůli člověku, ale kvůli fotkám. Rada číslo jedna od každého dating kouče je stejná: nejdřív opravte fotky. Natrénovali jsme náš proprietární AI systém tak, aby byl hodnocen jako atraktivní a zároveň zachoval přirozený vzhled",
    stats: [
      {
        value: "75%",
        label: "profilů je přeskočeno za méně než sekundu",
      },
      {
        value: "10x",
        label: "lepší kvalita matchů",
      },
      {
        value: "100+",
        label: "minut týdně ušetřeno na ignorování a odmítnutích",
      },
    ],
  },

  beforeAfter: {
    kicker: "Skutečná estetika. Nulové artefakty",
    title: "Stejná tvář. Úplně jiný první dojem",
    body: "Každá reference v našem katalogu byla ručně vybrána, protože na seznamovacích aplikacích funguje 10× lépe. Naše proprietární AI je namapuje na vaši skutečnou estetiku, takže fotky vypadají jako vy v nejlepší den - ne jako render vás",
    toggleForHim: "Pro něj",
    toggleForHer: "Pro ni",
    toggleHint: "Fotky optimalizované pro lidi, které chcete přitáhnout",
    beforeLabel: "Před",
    afterLabel: "Po",
    meterLabel: "Swipe přitažlivost",
    meterBeforeCaption: "Přeskočeno",
    meterAfterCaption: "Dostane zprávu první, lepší rande a více matchů",
    disclaimer: "Transformace klientů, se kterými jsme pracovali",
    examples: {
      him: [
        { beforeCaption: "Ignorování, které vyčerpává psychicky" },
        {
          beforeCaption: "Konverzace, ale spousta odmítnutí",
          afterCaption: "Sám si vybírá, koho odmítne",
        },
      ],
      her: [
        {
          beforeCaption: "Randění bez velkého úsilí",
          afterCaption: "Najde svého vysněného muže",
        },
        {
          beforeCaption: "Jen rande bez závazku",
          afterCaption: "Najde svou spřízněnou duši",
        },
      ],
    },
  },

  gaze: {
    kicker: "Nefér výhoda",
    titleHim: "Vytvořeno pro ženský pohled",
    titleHer: "Vytvořeno pro mužský pohled",
    body: "Muži fotí tak, aby to vypadalo cool ostatním mužům. Ženy vybírají fotky, které se líbí kamarádkám. Obojí je špatně. Reverse-engineerovali jsme, na co lidé, které chcete přitáhnout, skutečně reagují - přirozené rámování, přirozené světlo, reálná prostředí - a natrénovali jsme na to náš systém",
    toggleForHim: "Muži",
    toggleForHer: "Ženy",
    points: [
      {
        title: "Přirozené, ne naaranžované",
        body: "Fotky, které vypadají, jako by vás talentovaný kamarád zachytil uprostřed okamžiku. To buduje důvěru a odpovědi",
      },
      {
        title: "Ručně vybrané reference",
        body: "Každá naše stylová reference byla vybrána, protože statisticky funguje lépe na seznamovacích aplikacích. Žádná výplň, žádné generické AI portréty",
      },
      {
        title: "Vaše skutečná estetika",
        body: "Žádná vosková kůže, žádné roztavené ruce, žádné uncanny valley. Pokud to nevypadá jako skutečná fotka, nikdy se nedostane do vaší galerie",
      },
    ],
  },

  profileBadge: {
    line1: "#1 generátor",
    line2: "seznamovacích profilových fotek",
  },

  photoshoot: {
    kicker: "Spočítejte si to",
    title: "Nekonečně lepší než focení za {photographerPrice}",
    body: "Fotograf vám dá jedno odpoledne, jeden outfit a fotky, které křičí: „Najal jsem fotografa na seznamovací profil.“ My vám dáme celý katalog přirozených looků - váš nejlepší život - za zlomek ceny",
    themLabel: "Tradiční focení",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ za jednu session",
        us: "Jedna platba {price}, to je vše",
      },
      {
        them: "10 až 20 použitelných fotek, pokud máte štěstí",
        us: "{photoCount} fotek v ověřených stylech",
      },
      {
        them: "Jeden outfit, jedno místo, jedna nálada",
        us: "Desítky outfitů, scén a nálad",
      },
      {
        them: "Viditelně pózované a naaranžované",
        us: "Přirozené, ladící s estetikou feedu",
      },
      { them: "Týdny plánování a čekání", us: "Hotovo během hodin, z pohovky" },
      { them: "Nové focení? Plaťte znovu.", us: "100 AI úprav v ceně" },
    ],
    punchline:
      "Láska je v sázce. Nesvěřujte ji někomu, kdo už dostal zaplaceno",
  },

  match: {
    kicker: "Kam to vede",
    title: "Kvalitnější konverzace začínají lepšími fotkami",
    body: "Více matchů je jen začátek. Když vaše fotky konečně ukazují, jak zajímavě a sebevědomě vypadáte, rande přestávají mizet, konverzace začínají silněji a „vypadáš přesně jako na fotkách“ je kompliment, ne úleva",
    imageAlt: "Obrazovky Tinder matchů s It's a Match",
  },

  manifesto: {
    text: "Lepší fotky znamenají lepší matche. Tak jednoduché to je. Rada číslo jedna, kterou vám dá každý dating guru, je pořídit lepší seznamovací headshoty. Lidé jsou přece vizuální bytosti. Používáme špičkovou AI, aby byl tento proces super dostupný a stejně snadný jako 1 2 3",
    attribution: "Proč jsme vytvořili {appName}",
  },

  steps: {
    kicker: "Stejně snadné jako 1 2 3",
    title: "Váš glow-up na autopilotu",
    items: [
      {
        title: "Nahrajte své selfie",
        body: "10+ každodenních fotek. Naše AI se naučí vaši tvář ze všech úhlů",
      },
      {
        title: "AI vytvoří vaši postavu",
        body: "Soukromý model vás, natrénovaný jednou, znovu použitelný v každém stylu",
      },
      {
        title: "Stáhněte {photoCount} fotek",
        body: "Ručně vybrané styly, bez vodoznaku, připravené pro každou seznamovací aplikaci",
      },
    ],
  },

  pricing: {
    kicker: "Jedna platba. Žádné předplatné",
    title: "Levnější než jedno špatné první rande",
    body: "U rande s nekvalitními matchy utratíte víc. Opravte fotky jednou a váš zážitek ze seznamovacích aplikací se navždy změní",
    planName: "Profilové fotky",
    features: [
      "{photoCount} AI generovaných seznamovacích fotek",
      "100 AI úprav na změnu outfitu, úpravu scény nebo lepší úsměv",
      "Přes 200+ ručně vybraných, vysoce výkonných stylů a scén",
      "Optimalizováno pro lidi, které chcete přitáhnout",
      "Bez vodoznaku, připravené ke stažení do aplikací",
      "Soukromé: vaše fotky se nikdy nesdílí",
      "Prioritní zpracování",
    ],
    cta: "Získat mé fotky",
    guarantee: "Vaše tréninkové fotky zůstávají soukromé a bezpečně uložené",
    payoff:
      "Pokud vám jedna fotka přinese jedno extra skvělé rande, už se zaplatila",
  },

  faq: {
    title: "Otázky, zodpovězené",
    items: [
      {
        q: "Budou fotky opravdu vypadat jako já?",
        a: "Ano. AI trénuje na vaší skutečné tváři z nahraných selfie a odpovídá vaší skutečné estetice. Žádné uncanny valley, žádná plastická kůže. Pokud fotka nevypadá reálně, vygenerujte ji znovu nebo opravte zahrnutou AI úpravou",
      },
      {
        q: "Jak je to lepší než profesionální focení?",
        a: "Focení za {photographerPrice} vám dá jeden outfit, jedno místo a viditelně pózované fotky. Vy dostanete celý katalog přirozených looků - váš nejlepší život - v desítkách scén, plus AI úpravy, za zlomek ceny, aniž byste opustili domov",
      },
      {
        q: "Co myslíte optimalizací pro ženský / mužský pohled?",
        a: "Naše stylové reference byly ručně vybrány podle toho, na co lidé, které chcete přitáhnout, skutečně reagují - přirozené rámování, přirozená prostředí, teplé světlo, ne to, co vás ohromí. Proto fungují 10× lépe",
      },
      {
        q: "Jak rychle dostanu své fotky?",
        a: "Trénink vaší soukromé AI postavy trvá asi 20 až 45 minut. Poté se každá fotka generuje během minut. Většina uživatelů má kompletně nový profil tentýž den",
      },
      {
        q: "Mohu upravovat tetování, outfity nebo pozadí?",
        a: "Ano, každý plán zahrnuje AI úpravy. Přidejte nebo odstraňte tetování, vyměňte oblečení, odstraňte objekty nebo upravte pozadí napsáním věty",
      },
      {
        q: "Jsou moje data soukromá?",
        a: "Vaše nahrané a vygenerované fotky jsou soukromé ve vašem účtu. Nikdy nepostujeme, nesdílíme ani netrénujeme veřejné modely na vaší tváři a kdykoli můžete požádat o smazání",
      },
      {
        q: "Jak dlouho se ukládají mé fotky a jak dlouho platí kredity?",
        a: "Vygenerované fotky zůstávají v galerii 1–2 měsíce. Kredity platí celý rok od nákupu, takže máte dost času na generování, úpravy a stažení",
      },
    ],
  },

  finalCta: {
    title: "Buďte profilem, který zastaví scroll",
    body: "80 % je ignorováno. 20 % si pořídilo lepší fotky. Který chcete být dnes večer?",
    cta: "Začít",
  },

  footer: {
    tagline: "AI seznamovací fotky navržené, abyste byli vidět",
    support: "Otázky?",
    rights: "Všechna práva vyhrazena",
  },
  feedbackPrompt: {
    question: "Chybí vám nějaké informace pro používání naší služby?",
    placeholder: "Řekněte nám, co chybí nebo není jasné...",
    submit: "Odeslat",
    closeLabel: "Zavřít",
    thanks: "Děkujeme za zpětnou vazbu!",
  },
} satisfies Dictionary;
