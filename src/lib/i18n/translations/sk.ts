import type { Dictionary } from "./en";

export const sk = {
  nav: {
    results: "Výsledky",
    pricing: "Cenník",
    faq: "FAQ",
    signIn: "Prihlásiť sa",
    getStarted: "Začať",
  },

  stickyCta: {
    label: "Začať",
    sub: "Jednorazová platba · {photoCount} fotiek",
  },

  hero: {
    badge: "80 % rande profilov sa ignoruje. Buďte v tých 20 %",
    titleLine1: "Rande fotky navrhnuté",
    titleAccent: "pre jej oči",
    titleAccentAlt: "pre jeho oči",
    titleLine2: "nie pre vaše ego",
    subtitle:
      "Naša proprietárna AI skúma, čo skutočne zastaví swipe, a potom prebuduje váš profil prirodzenými fotkami na úrovni magazínu, ktoré zodpovedajú vašej skutočnej estetike. Žiadny plastický AI vzhľad. Žiadne viditeľné artefakty",
    cta: "Transformovať môj profil",
    ctaSecondary: "Pozrieť skutočné výsledky",
    ratingLabel: "hodnotené singlami, ktorí prestali byť ignorovaní",
  },

  trustBar: {
    label: "Dôverujú nám single, ktorí vyhrávajú na",
  },

  proof: {
    kicker: "Matematika je krutá",
    title: "Máte jeden swipe, aby ste ju zastavili",
    titleAlt: "Máte jeden swipe, aby ste ho zastavili",
    body: "80 % rande profilov sa ignoruje nie kvôli človeku, ale kvôli fotkám. Rada číslo 1 od každého rande kouča je rovnaká: najprv opravte fotky. Natrénovali sme náš proprietárny AI systém tak, aby bol hodnotený ako atraktívny, pričom si zachoval ten prirodzený vzhľad",
    stats: [
      {
        value: "75%",
        label: "profilov sa preskočí za menej ako sekundu",
      },
      {
        value: "10x",
        label: "lepšia kvalita matchov",
      },
      {
        value: "100+",
        label: "minút ušetrených každý týždeň na ignorovaní a odmietnutiach",
      },
    ],
  },

  beforeAfter: {
    kicker: "Skutočná estetika. Nulové artefakty",
    title: "Rovnaká tvár. Úplne iný prvý dojem",
    body: "Každá referencia v našom katalógu bola ručne vybraná, pretože funguje 10x lepšie na rande aplikáciách. Naša proprietárna AI ich mapuje na vašu skutočnú estetiku, takže fotky vyzerajú ako vy v najlepší deň, nie ako render vás",
    toggleForHim: "Pre neho",
    toggleForHer: "Pre ňu",
    toggleHint: "Fotky optimalizované pre ľudí, ktorých chcete pritiahnuť",
    beforeLabel: "Pred",
    afterLabel: "Po",
    meterLabel: "Swipe príťažlivosť",
    meterBeforeCaption: "Preskočí sa",
    meterAfterCaption: "Dostane správu ako prvý, lepšie rande a viac matchov",
    disclaimer: "Transformácie klientov, s ktorými sme pracovali",
    examples: {
      him: [
        { beforeCaption: "Ignorovanie, ktoré psychicky vyčerpáva" },
        {
          beforeCaption: "Rozhovory, ale veľa odmietnutí",
          afterCaption: "Sám si vyberá, koho odmietne",
        },
      ],
      her: [
        {
          beforeCaption: "Rande bez snahy",
          afterCaption: "Dostane muža svojich snov",
        },
        {
          beforeCaption: "Len rande bez záväzku",
          afterCaption: "Nájde svoju spriaznenú dušu",
        },
      ],
    },
  },

  gaze: {
    kicker: "Neferová výhoda",
    titleHim: "Vytvorené pre ženský pohľad",
    titleHer: "Vytvorené pre mužský pohľad",
    body: "Muži fotia fotky, ktoré sa iným mužom zdajú cool. Ženy vyberajú fotky, ktoré sa páčia kamarátkam. Obaja sa mýlia. Reverzne sme analyzovali, na čo skutočne reagujú ľudia, ktorých chcete pritiahnuť: prirodzené kadrovanie, prirodzené svetlo, skutočné prostredie, a na tom sme natrénovali náš systém",
    toggleForHim: "Muži",
    toggleForHer: "Ženy",
    points: [
      {
        title: "Prirodzene, nie naaranžované",
        body: "Fotky, ktoré vyzerajú, akoby vás v polovičke momentu zachytil talentovaný kamarát. Tak sa získava dôvera a odpovede",
      },
      {
        title: "Ručne vybrané referencie",
        body: "Každá naša štýlová referencia bola vybraná, pretože štatisticky prekonáva na rande aplikáciách. Žiadne výplne, žiadne generické AI portréty",
      },
      {
        title: "Vaša skutočná estetika",
        body: "Žiadna vosková pokožka, roztopené ruky, žiadne uncanny valley. Ak neprejde za skutočnú fotku, nikdy sa nedostane do vašej galérie",
      },
    ],
  },

  profileBadge: {
    line1: "Generátor rande profilových",
    line2: "fotiek č. 1",
  },

  photoshoot: {
    kicker: "Spočítajte si to",
    title: "Nekonečne lepšie než fotenie za {photographerPrice}",
    body: "Fotograf vám dá jedno popoludnie, jeden outfit a fotky, ktoré kričia \u201eNajal som si fotografa na rande profil.\u201c My vám dáme celý katalóg prirodzených lookov, život na najvyššej úrovni, za zlomok ceny",
    themLabel: "Tradičné fotenie",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ za jednu session",
        us: "Jedna platba {price}, to je všetko",
      },
      {
        them: "10 až 20 použiteľných fotiek, ak máte šťastie",
        us: "{photoCount} fotiek v overených štýloch",
      },
      {
        them: "Jeden outfit, jedna lokalita, jedna atmosféra",
        us: "Desiatky outfitov, scén a nálad",
      },
      {
        them: "Viditeľne naaranžované a naštýlované",
        us: "Prirodzené, prirodzené pre estetiku feedu",
      },
      {
        them: "Týždne plánovania a čakania",
        us: "Hotové za hodiny, z pohovky",
      },
      { them: "Opätovné fotenie? Platíte znova.", us: "100 AI úprav v cene" },
    ],
    punchline:
      "Láska je v stávke. Nenechávajte ju na niekoho, kto už dostal zaplatené",
  },

  match: {
    kicker: "Kde to končí",
    title: "Kvalitnejšie rozhovory začínajú lepšími fotkami",
    body: "Viac matchov je len začiatok. Keď vaše fotky konečne ukazujú, ak zaujímavo a sebavedomo vyzeráte, rande prestávajú miznúť, rozhovory začínajú silnejšie a \u201evyzeráš presne ako na fotkách\u201c sa stáva komplimentom, nie úľavou",
    imageAlt: "Obrazovky Tinder matchov s nápisom It's a Match",
  },

  manifesto: {
    text: "Lepšie fotky znamenajú lepšie matchy. Je to také jednoduché. Rada číslo 1, ktorú vám povie každý rande guru, je získať lepšie rande fotky. Ľudia sú predsa vizuálne bytosti. Používame špičkovú AI, aby bol tento proces super dostupný a jednoduchý ako 1 2 3",
    attribution: "Prečo sme vytvorili {appName}",
  },

  steps: {
    kicker: "Tak jednoduché ako 1 2 3",
    title: "Váš glow up na autopilote",
    items: [
      {
        title: "Nahrajte svoje selfie",
        body: "10+ každodenných fotiek. Naša AI sa učí vašu tvár z každého uhla",
      },
      {
        title: "AI vytvorí vašu postavu",
        body: "Súkromný model vás, natrénovaný raz, znovu použiteľný v každom štýle",
      },
      {
        title: "Stiahnite {photoCount} fotiek",
        body: "Ručne vybrané štýly, bez vodotlače, pripravené pre každú rande aplikáciu",
      },
    ],
  },

  pricing: {
    kicker: "Jedna platba. Bez predplatného",
    title: "Lacnejšie než jedno zlé prvé rande",
    body: "Miniete viac na rande so slabými matchmi. Opravte fotky raz a vaša skúsenosť s rande aplikáciami sa navždy zmení",
    planName: "Profilové fotky",
    features: [
      "{photoCount} AI generovaných rande fotiek",
      "100 AI úprav na zmenu outfitu, úpravu scenérie alebo lepší úsmev",
      "Viac ako 200+ ručne vybraných, vysoko výkonných štýlov a scén",
      "Optimalizované pre ľudí, ktorých chcete pritiahnuť",
      "Bez vodotlače, pripravené na stiahnutie do aplikácií",
      "Súkromné: vaše fotky sa nikdy nezdieľajú",
      "Prioritné spracovanie",
    ],
    cta: "Získať moje fotky",
    guarantee: "Vaše tréningové fotky zostávajú súkromné a bezpečne uložené",
    payoff:
      "Ak vám jedna fotka prinesie jedno extra skvelé rande, už sa zaplatila sama",
  },

  faq: {
    title: "Otázky a odpovede",
    items: [
      {
        q: "Budú fotky naozaj vyzerať ako ja?",
        a: "Áno. AI trénuje na vašej skutočnej tvári z nahraných selfie a zodpovedá vašej skutočnej estetike. Žiadne uncanny valley, žiadna plastická pokožka. Ak fotka neprejde za skutočnú, vygenerujte ju znova alebo opravte zahrnutou AI úpravou",
      },
      {
        q: "Čím je to lepšie než profesionálne fotenie?",
        a: "Fotenie za {photographerPrice} vám kúpi jeden outfit, jednu lokalitu a viditeľne naaranžované fotky. Vy dostanete celý katalóg prirodzených lookov, život na najvyššej úrovni, v desiatkach scén, plus AI úpravy, za zlomok ceny, bez toho, aby ste opustili dom",
      },
      {
        q: "Čo znamená optimalizované pre ženský / mužský pohľad?",
        a: "Naše štýlové referencie boli ručne vybrané na základe toho, na čo skutočne reagujú ľudia, ktorých chcete pritiahnuť: prirodzené kadrovanie, prirodzené prostredie, teplé svetlo, nie to, čo sa vám zdá pôsobivé. Preto fungujú 10x lepšie",
      },
      {
        q: "Ako rýchlo dostanem fotky?",
        a: "Tréning vašej súkromnej AI postavy trvá približne 20 až 45 minút. Potom sa každá fotka generuje za minúty. Väčšina používateľov má kompletne nový profil ešte ten istý deň",
      },
      {
        q: "Môžem upravovať tetovania, outfity alebo pozadia?",
        a: "Áno, každý plán zahŕňa AI úpravy. Pridávajte alebo odstraňujte tetovania, meňte oblečenie, odstraňujte objekty alebo upravujte pozadia napísaním vety",
      },
      {
        q: "Sú moje dáta súkromné?",
        a: "Vaše nahraté a vygenerované fotky sú súkromné vo vašom účte. Nikdy nezverejňujeme, nezdieľame ani netrénujeme verejné modely na vašej tvári a kedykoľvek môžete požiadať o vymazanie",
      },
      {
        q: "Ako dlho sa ukladajú moje fotky a ako dlho platia kredity?",
        a: "Vygenerované fotky zostávajú v galérii 1–2 mesiace. Kredity platia celý rok od nákupu",
      },
    ],
  },

  finalCta: {
    title: "Buďte profilom, ktorý zastaví scroll",
    body: "80 % sa ignoruje. 20 % dostalo lepšie fotky. Ku ktorej skupine chcete patriť dnes večer?",
    cta: "Začať",
  },

  footer: {
    tagline: "AI rande fotky navrhnuté tak, aby vás všimli",
    support: "Otázky?",
    rights: "Všetky práva vyhradené",
  },
  feedbackPrompt: {
    question: "Chýbajú vám nejaké informácie na používanie našej služby?",
    placeholder: "Povedzte nám, čo chýba alebo nie je jasné...",
    submit: "Odoslať",
    closeLabel: "Zavrieť",
    thanks: "Ďakujeme za spätnú väzbu!",
  },
} satisfies Dictionary;
