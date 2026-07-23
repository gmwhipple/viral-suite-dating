import type { Dictionary } from "./en";

export const lv = {
  nav: {
    results: "Rezultāti",
    pricing: "Cenas",
    faq: "FAQ",
    signIn: "Pierakstīties",
    getStarted: "Sākt",
  },

  stickyCta: {
    label: "Sākt",
    sub: "Vienreizējs maksājums · {photoCount} fotogrāfijas",
  },

  hero: {
    badge: "80 % iepazīšanās profilu tiek ignorēti. Esi starp 20 %",
    titleLine1: "Iepazīšanās fotogrāfijas veidotas",
    titleAccent: "viņas acīm",
    titleAccentAlt: "viņa acīm",
    titleLine2: "ne tavam egom",
    subtitle:
      "Mūsu patentētais mākslīgais intelekts izpēta, kas patiesībā aptur swipe, tad pārbūvē tavu profilu ar dabiskām, žurnāla līmeņa fotogrāfijām, kas atbilst tavai īstajai estētikai. Nulle plastiska AI izskata. Nulle pamanāmu artefaktu",
    cta: "Pārveidot manu profilu",
    ctaSecondary: "Skatīt īstos rezultātus",
    ratingLabel: "novērtējuši viensētie, kurus vairs neignorē",
  },

  trustBar: {
    label: "Uzticas viensētie, kas uzvar",
  },

  proof: {
    kicker: "Matemātika ir nežēlīga",
    title: "Tev ir viens swipe, lai viņu apturētu",
    titleAlt: "Tev ir viens swipe, lai viņu apturētu",
    body: "80 % iepazīšanās profilu tiek ignorēti ne cilvēka dēļ, bet fotogrāfiju dēļ. Nr. 1 padoms no katra iepazīšanās trenera ir vienāds: vispirms salabo fotogrāfijas. Mēs apmācījām savu patentēto AI sistēmu tikt vērtētai kā pievilcīgai, saglabājot dabisko izskatu",
    stats: [
      {
        value: "75%",
        label: "profilu tiek izlaisti mazāk nekā sekundē",
      },
      {
        value: "10x",
        label: "labāka atbilstību kvalitāte",
      },
      {
        value: "100+",
        label: "minūtes ietaupītas katru nedēļu ignorēšanas un atcelšanas dēļ",
      },
    ],
  },

  beforeAfter: {
    kicker: "Īsta estētika. Nulle artefaktu",
    title: "Tā pati seja. Pilnīgi cits pirmais iespaids",
    body: "Katra atsauce mūsu katalogā tika izvēlēta ar roku, jo iepazīšanās lietotnēs darbojas 10 reizes labāk. Mūsu patentētais AI tos pielāgo tavai īstajai estētikai, lai fotogrāfijas izskatītos kā tu savā labākajā dienā, nevis kā tavs renderis",
    toggleForHim: "Viņam",
    toggleForHer: "Viņai",
    toggleHint: "Fotogrāfijas optimizētas cilvēkam, kuru vēlies piesaistīt",
    beforeLabel: "Pirms",
    afterLabel: "Pēc",
    meterLabel: "Swipe pievilcība",
    meterBeforeCaption: "Tiek izlaists",
    meterAfterCaption: "Saņem ziņu pirmais, labākas randiņi, vairāk atbilstību",
    disclaimer: "Transformācijas klientiem, ar kuriem esam strādājuši",
    examples: {
      him: [
        { beforeCaption: "Ignorēšana, kas emocionāli iztukšo" },
        {
          beforeCaption: "Sarunas, bet daudz atcelšanu",
          afterCaption: "Viņš izvēlas, ko ignorēt",
        },
      ],
      her: [
        {
          beforeCaption: "Randiņi bez pūļa",
          afterCaption: "Iegūst savu sapņu vīrieti",
        },
        {
          beforeCaption: "Tikai randiņi bez nopietnas saistības",
          afterCaption: "Atrod savu dvēseles radinieku",
        },
      ],
    },
  },

  gaze: {
    kicker: "Negodīga priekšrocība",
    titleHim: "Veidots sieviešu skatījumam",
    titleHer: "Veidots vīriešu skatījumam",
    body: "Vīrieši fotografē to, ko citi vīrieši uzskata par foršu. Sievietes izvēlas fotogrāfijas, kas patīk draudzenēm. Abi ir nepareizi. Mēs reverso inženierijā noskaidrojām, uz ko patiesībā reaģē cilvēki, kurus vēlies piesaistīt, dabisku kadru, dabisku gaismu, īstas vides, un apmācījām sistēmu",
    toggleForHim: "Vīrieši",
    toggleForHer: "Sievietes",
    points: [
      {
        title: "Dabiski, ne inscenēti",
        body: "Fotogrāfijas, kas izskatās, it kā talantīgs draugs nofotografējis tevi vidū mirkļa. Tas rada uzticību un atbildes",
      },
      {
        title: "Ar roku izvēlētas atsauces",
        body: "Katra mūsu stila atsauce izvēlēta, jo statistiski labāk darbojas iepazīšanās lietotnēs. Bez aizpildītājiem, bez vispārīgiem AI portretiem",
      },
      {
        title: "Tava īstā estētika",
        body: "Bez vaksveida ādas, bez izkusušām rokām, bez uncanny valley. Ja neizskatās kā īsta fotogrāfija, tā nekad nenonāk tavā galerijā",
      },
    ],
  },

  profileBadge: {
    line1: "#1 iepazīšanās profila",
    line2: "fotogrāfiju ģenerators",
  },

  photoshoot: {
    kicker: "Aprēķini",
    title: "Bezgalīgi labāk nekā {photographerPrice} fotosesija",
    body: "Fotogrāfs dod vienu pēcpusdienu, vienu tērpu un fotogrāfijas, kas kliedz: „Es nolīgu fotogrāfu savam iepazīšanās profilam.“ Mēs dodam visu katalogu dabisku izskatu, tavu labāko dzīvi, par daļu cenas",
    themLabel: "Tradicionāla fotosesija",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ par vienu sesiju",
        us: "Viens maksājums {price}, viss",
      },
      {
        them: "10-20 lietojamas fotogrāfijas, ja veicas",
        us: "{photoCount} fotogrāfijas pārbaudītos stilos",
      },
      {
        them: "Viens tērps, viena vieta, viens noskaņojums",
        us: "Desmitiem tērpu, ainu un noskaņu",
      },
      {
        them: "Redzami pozēti un inscenēti",
        us: "Dabiski, piemēroti feed estētikai",
      },
      {
        them: "Nedēļas plānošanas un gaidīšanas",
        us: "Gatavs stundu laikā, no dīvāna",
      },
      {
        them: "Atkārtota fotosesija? Maksā vēlreiz.",
        us: "100 AI rediģējumi iekļauti",
      },
    ],
    punchline: "Mīlestība ir spēlē. Nepatici to tam, kas jau ir apmaksāts",
  },

  match: {
    kicker: "Kur tas beidzas",
    title: "Kvalitatīvākas sarunas sākas ar labākām fotogrāfijām",
    body: "Vairāk atbilstību, tikai sākums. Kad tavas fotogrāfijas beidzot parāda, cik interesants un pārliecināts izskaties, randiņi vairs neatceļas, sarunas sākas spēcīgāk, un „izskaties tieši kā bildēs“ kļūst par komplimentu, nevis atvieglojumu",
    imageAlt: "Tinder atbilstību ekrāni ar It's a Match",
  },

  manifesto: {
    text: "Labākas fotogrāfijas nozīmē labākas atbilstības. Tik vienkārši. Nr. 1 padoms, ko dos jebkurš iepazīšanās guru: iegūsti labākas iepazīšanās headshot fotogrāfijas. Cilvēki tomēr ir vizuāli. Mēs izmantojam jaunāko AI, lai šis process būtu ļoti pieejams un tik vienkāršs kā 1 2 3",
    attribution: "Kāpēc mēs izveidojām {appName}",
  },

  steps: {
    kicker: "Tik vienkārši kā 1 2 3",
    title: "Tavs glow up autopilotā",
    items: [
      {
        title: "Augšupielādē savus selfijus",
        body: "10+ ikdienas fotogrāfijas. Mūsu AI iemācās tavu seju no visiem leņķiem",
      },
      {
        title: "AI izveido tavu tēlu",
        body: "Privāts tavs modelis, apmācīts vienreiz, atkārtoti lietojams katrā stilā",
      },
      {
        title: "Lejupielādē {photoCount} fotogrāfijas",
        body: "Ar roku izvēlēti stili, bez ūdenszīmēm, gatavi katrai iepazīšanās lietotnei",
      },
    ],
  },

  pricing: {
    kicker: "Viens maksājums. Bez abonementa",
    title: "Lētāk nekā viens slikts pirmais randiņš",
    body: "Tu tērēsi vairāk randiņiem ar zemas kvalitātes atbilstībām. Salabo fotogrāfijas vienreiz un tava iepazīšanās lietotņu pieredze mainīsies uz visiem laikiem",
    planName: "Profila fotogrāfijas",
    features: [
      "{photoCount} AI ģenerētas iepazīšanās fotogrāfijas",
      "100 AI rediģējumi: tērpa maiņa, ainavas pielāgošana vai labāks smaids",
      "Vairāk nekā 200+ ar roku izvēlēti, augsti veiktspējīgi stili un ainas",
      "Optimizēts cilvēkiem, kurus vēlies piesaistīt",
      "Bez ūdenszīmēm, gatavi lejupielādei lietotnēs",
      "Privāti: tavas fotogrāfijas nekad netiek koplietotas",
      "Prioritāra apstrāde",
    ],
    cta: "Iegūt manas fotogrāfijas",
    guarantee: "Tavas apmācības fotogrāfijas paliek privātas un droši glabātas",
    payoff:
      "Ja viena fotogrāfija atnes vienu papildu lielisku randiņu, tā jau ir atmaksājusies",
  },

  faq: {
    title: "Jautājumi, atbildēti",
    items: [
      {
        q: "Vai fotogrāfijas patiesībā izskatīsies kā es?",
        a: "Jā. AI mācās uz tavas īstās sejas no augšupielādētajiem selfijiem un atbilst tavai īstajai estētikai. Nav uncanny valley, nav plastiskas ādas. Ja fotogrāfija neizskatās īsta, ģenerē no jauna vai labo ar iekļautu AI rediģējumu",
      },
      {
        q: "Kā tas ir labāk par profesionālu fotosesiju?",
        a: "{photographerPrice} fotosesija dod vienu tērpu, vienu vietu un redzami pozētas fotogrāfijas. Tu iegūsti visu katalogu dabisku izskatu, tavu labāko dzīvi, desmitiem ainu, plus AI rediģējumus, par daļu cenas, neizejot no mājām",
      },
      {
        q: "Ko nozīmē optimizēts sieviešu / vīriešu skatījumam?",
        a: "Mūsu stila atsauces izvēlētas ar roku pēc tā, uz ko patiesībā reaģē cilvēki, kurus vēlies piesaistīt, dabisku kadru, dabiskām vidēm, siltu gaismu, nevis to, kas tevi iespaido. Tāpēc tās darbojas 10 reizes labāk",
      },
      {
        q: "Cik ātri saņemšu savas fotogrāfijas?",
        a: "Tava privātā AI tēla apmācība aizņem apmēram 20-45 minūtes. Pēc tam katra fotogrāfija ģenerējas minūtēs. Lielākā daļa lietotāju tajā pašā dienā iegūst pilnīgi jaunu profilu",
      },
      {
        q: "Vai varu rediģēt tetovējumus, tērpus vai fonu?",
        a: "Jā, katrs plāns ietver AI rediģējumus. Pievieno vai noņem tetovējumus, maini apģērbu, noņem objektus vai notīri fonu ar vienu teikumu",
      },
      {
        q: "Vai mani dati ir privāti?",
        a: "Tavi augšupielādes un ģenerētie attēli ir privāti tavā kontā. Mēs nekad nepublicējam, nekopīgojam un neapmācām publiskos modeļus ar tavu seju, un izdzēšanu vari pieprasīt jebkurā laikā",
      },
      {
        q: "Cik ilgi tiek glabātas manas fotogrāfijas un cik ilgi der kredīti?",
        a: "Ģenerētās fotogrāfijas paliek galerijā 1–2 mēnešus. Kredīti ir derīgi visu gadu no pirkuma",
      },
    ],
  },

  finalCta: {
    title: "Esi profils, kas aptur scroll",
    body: "80 % tiek ignorēti. 20 % ieguva labākas fotogrāfijas. Kurš vēlies būt šovakar?",
    cta: "Sākt",
  },

  footer: {
    tagline: "AI iepazīšanās fotogrāfijas, veidotas lai tevi pamanītu",
    support: "Jautājumi?",
    rights: "Visas tiesības aizsargātas",
  },
  feedbackPrompt: {
    question: "Vai jums trūkst informācijas, lai izmantotu mūsu pakalpojumu?",
    placeholder: "Pastāstiet, kas trūkst vai nav skaidrs...",
    submit: "Iesniegt",
    closeLabel: "Aizvērt",
    thanks: "Paldies par atsauksmi!",
  },
} satisfies Dictionary;
