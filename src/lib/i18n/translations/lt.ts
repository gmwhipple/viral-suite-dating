import type { Dictionary } from "./en";

export const lt = {
  nav: {
    results: "Rezultatai",
    pricing: "Kainos",
    faq: "FAQ",
    signIn: "Prisijungti",
    getStarted: "Pradėti",
  },

  stickyCta: {
    label: "Pradėti",
    sub: "Vienkartinis mokėjimas · {photoCount} nuotraukų",
  },

  hero: {
    badge: "80 % pažinčių profilių ignoruojami. Būk tarp 20 %",
    titleLine1: "Pažinčių nuotraukos sukurtos",
    titleAccent: "jos akims",
    titleAccentAlt: "jo akims",
    titleLine2: "ne tavo ego",
    subtitle:
      "Mūsų nuosavybės dirbtinis intelektas išstudijuoja, kas iš tikrųjų sustabdo swipe, tada perkuria tavo profilį su natūraliomis, žurnalo lygio nuotraukomis, atitinkančiomis tavo tikrą estetiką. Jokio plastinio AI vaizdo. Jokių pastebimų artefaktų",
    cta: "Transformuoti mano profilį",
    ctaSecondary: "Pamatyti tikrus rezultatus",
    ratingLabel: "vertinama vienišų, kurie nebeignoruojami",
  },

  trustBar: {
    label: "Pasitiki vienišieji, laimintys",
  },

  proof: {
    kicker: "Matematika negailestinga",
    title: "Turi vieną swipe, kad ją sustabdytum",
    titleAlt: "Turi vieną swipe, kad jį sustabdytum",
    body: "80 % pažinčių profilių ignoruojami ne dėl žmogaus, o dėl nuotraukų. Pirmas patarimas kiekvieno pažinčių trenerio tas pats: pirmiausia pataisyk nuotraukas. Mes apmokėme savo nuosavybės AI sistemą būti vertinamai kaip patraukli, išlaikant natūralų vaizdą",
    stats: [
      {
        value: "75%",
        label: "profilių praleidžiama per mažiau nei sekundę",
      },
      {
        value: "10x",
        label: "geresnė atitikimų kokybė",
      },
      {
        value: "100+",
        label: "minučių sutaupoma kas savaitę dėl ignoravimo ir atšaukimų",
      },
    ],
  },

  beforeAfter: {
    kicker: "Tikra estetika. Nulis artefaktų",
    title: "Tas pats veidas. Visiškai kitas pirmas įspūdis",
    body: "Kiekviena mūsų katalogo nuoroda buvo rankiniu būdu parinkta, nes pažinčių programėlėse veikia 10 kartų geriau. Mūsų nuosavybės AI pritaiko jas prie tavo tikros estetikos, todėl nuotraukos atrodo kaip tu geriausią dieną, o ne kaip tavo renderis",
    toggleForHim: "Jam",
    toggleForHer: "Jai",
    toggleHint: "Nuotraukos optimizuotos tam, ką nori pritraukti",
    beforeLabel: "Prieš",
    afterLabel: "Po",
    meterLabel: "Swipe patrauklumas",
    meterBeforeCaption: "Praleidžiama",
    meterAfterCaption:
      "Gauna žinutę pirmas, geresni pasimatymai, daugiau atitikimų",
    disclaimer: "Transformacijos klientų, su kuriais dirbome",
    examples: {
      him: [
        { beforeCaption: "Ignoravimas, kuris emociškai išsekina" },
        {
          beforeCaption: "Pokalbiai, bet daug atšaukimų",
          afterCaption: "Jis renkasi, ką ignoruos",
        },
      ],
      her: [
        {
          beforeCaption: "Pasimatymai be pastangų",
          afterCaption: "Gauna savo svajonių vyrą",
        },
        {
          beforeCaption: "Tik pasimatymai be rimto įsipareigojimo",
          afterCaption: "Randa savo sielos draugą",
        },
      ],
    },
  },

  gaze: {
    kicker: "Nesąžiningas pranašumas",
    titleHim: "Sukurta moters žvilgsniui",
    titleHer: "Sukurta vyro žvilgsniui",
    body: "Vyrai fotografuoja tai, ką kiti vyrai laiko cool. Moterys renkasi nuotraukas, kurios patinka draugėms. Abu neteisingi. Atvirkštine inžinerija nustatėme, į ką iš tikrųjų reaguoja žmonės, kuriuos nori pritraukti, natūralus kadravimas, natūrali šviesa, tikros aplinkos, ir apmokėme sistemą",
    toggleForHim: "Vyrai",
    toggleForHer: "Moterys",
    points: [
      {
        title: "Natūralu, ne inscenizuota",
        body: "Nuotraukos, kurios atrodo, tarsi talentingas draugas pagavo tave vidury akimirkos. Tai kuria pasitikėjimą ir atsakymus",
      },
      {
        title: "Rankiniu būdu parinktos nuorodos",
        body: "Kiekviena mūsų stiliaus nuoroda parinkta, nes statistiškai geriau veikia pažinčių programėlėse. Jokio užpildo, jokių bendrinių AI portretų",
      },
      {
        title: "Tavo tikra estetika",
        body: "Jokios vaškinės odos, jokių išsiliejusių rankų, jokio uncanny valley. Jei neatrodo kaip tikra nuotrauka, niekada nepatenka į tavo galeriją",
      },
    ],
  },

  profileBadge: {
    line1: "#1 pažinčių profilio",
    line2: "nuotraukų generatorius",
  },

  photoshoot: {
    kicker: "Susiskaičiuok",
    title: "Be galo geriau nei {photographerPrice} fotosesija",
    body: "Fotografas duoda vieną popietę, vieną aprangą ir nuotraukas, kurios šaukia: „Pasamdžiau fotografą savo pažinčių profiliui.“ Mes duodame visą katalogą natūralių vaizdų, tavo geriausią gyvenimą, už dalį kainos",
    themLabel: "Tradicinė fotosesija",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ už vieną sesiją",
        us: "Vienas mokėjimas {price}, viskas",
      },
      {
        them: "10-20 naudotinų nuotraukų, jei pasiseks",
        us: "{photoCount} nuotraukų patikrintais stiliais",
      },
      {
        them: "Viena apranga, viena vieta, viena nuotaika",
        us: "Dešimtys aprangų, scenų ir nuotaikų",
      },
      {
        them: "Akivaizdžiai pozuota ir inscenizuota",
        us: "Natūralu, pritaikyta feed estetikai",
      },
      {
        them: "Savaitės planavimo ir laukimo",
        us: "Paruošta per kelias valandas, iš sofos",
      },
      {
        them: "Pakartoti fotosesiją? Mokėk vėl.",
        us: "100 AI redagavimų įskaičiuota",
      },
    ],
    punchline: "Meilė statyje. Nepatikėk jos tam, kas jau buvo apmokėtas",
  },

  match: {
    kicker: "Kur tai veda",
    title: "Kokybiškesni pokalbiai prasideda nuo geresnių nuotraukų",
    body: "Daugiau atitikimų, tik pradžia. Kai tavo nuotraukos pagaliau parodo, koks įdomus ir pasitikintis atrodai, pasimatymai nebedingsta, pokalbiai prasideda stipriau, o „atrodi kaip nuotraukose“ tampa komplimentu, ne palengvėjimu",
    imageAlt: "Tinder atitikimų ekranai su It's a Match",
  },

  manifesto: {
    text: "Geresnės nuotraukos reiškia geresnius atitikimus. Taip paprasta. Pirmas patarimas, kurį duos bet kuris pažinčių guru: gauk geresnes pažinčių headshot nuotraukas. Juk žmonės yra vizualūs. Naudojame pažangiausią AI, kad šis procesas būtų labai prieinamas ir paprastas kaip 1 2 3",
    attribution: "Kodėl sukūrėme {appName}",
  },

  steps: {
    kicker: "Taip paprasta kaip 1 2 3",
    title: "Tavo glow up autopilote",
    items: [
      {
        title: "Įkelk savo selfius",
        body: "10+ kasdienių nuotraukų. Mūsų AI išmoksta tavo veidą iš visų kampų",
      },
      {
        title: "AI sukuria tavo personažą",
        body: "Privatus tavo modelis, apmokytas vieną kartą, pakartotinai naudojamas kiekviename stiliuje",
      },
      {
        title: "Atsisiųsk {photoCount} nuotraukų",
        body: "Rankiniu būdu parinkti stiliai, be vandens ženklų, paruošti kiekvienai pažinčių programėlei",
      },
    ],
  },

  pricing: {
    kicker: "Vienas mokėjimas. Be prenumeratos",
    title: "Pigiau nei vienas blogas pirmas pasimatymas",
    body: "Daugiau išleisi pasimatymams su prastos kokybės atitikimais. Pataisyk nuotraukas vieną kartą ir tavo pažinčių programėlių patirtis pasikeis visam laikui",
    planName: "Profilio nuotraukos",
    features: [
      "{photoCount} AI sugeneruotų pažinčių nuotraukų",
      "100 AI redagavimų: aprangos keitimas, aplinkos koregavimas ar geresnė šypsena",
      "Daugiau nei 200+ rankiniu būdu parinktų, aukštos naudos stilių ir scenų",
      "Optimizuota žmonėms, kuriuos nori pritraukti",
      "Be vandens ženklų, paruošta atsisiuntimui programėlėms",
      "Privatu: tavo nuotraukos niekada nesidalijamos",
      "Prioritetinis apdorojimas",
    ],
    cta: "Gauti mano nuotraukas",
    guarantee: "Tavo mokymo nuotraukos lieka privačios ir saugiai saugomos",
    payoff:
      "Jei viena nuotrauka atneša vieną papildomą puikų pasimatymą, ji jau atsipirko",
  },

  faq: {
    title: "Klausimai, atsakyta",
    items: [
      {
        q: "Ar nuotraukos tikrai atrodys kaip aš?",
        a: "Taip. AI mokosi ant tavo tikro veido iš įkeltų selfių ir atitinka tavo tikrą estetiką. Jokio uncanny valley, jokios plastinės odos. Jei nuotrauka neatrodo tikra, regeneruok arba pataisyk su įskaičiuotu AI redagavimu",
      },
      {
        q: "Kaip tai geriau nei profesionali fotosesija?",
        a: "{photographerPrice} fotosesija duoda vieną aprangą, vieną vietą ir akivaizdžiai pozuotas nuotraukas. Tu gauni visą katalogą natūralių vaizdų, tavo geriausią gyvenimą, dešimtyse scenų, plius AI redagavimus, už dalį kainos, nepalikdamas namų",
      },
      {
        q: "Ką reiškia optimizuota moters / vyro žvilgsniui?",
        a: "Mūsų stiliaus nuorodos parinktos rankiniu būdu pagal tai, į ką iš tikrųjų reaguoja žmonės, kuriuos nori pritraukti, natūralus kadravimas, natūralios aplinkos, šilta šviesa, ne tai, kas tau atrodo įspūdinga. Todėl jos veikia 10 kartų geriau",
      },
      {
        q: "Kaip greitai gausiu nuotraukas?",
        a: "Tavo privataus AI personažo apmokymas trunka apie 20-45 minutes. Po to kiekviena nuotrauka generuojama per minutes. Dauguma vartotojų turi visiškai naują profilį tą pačią dieną",
      },
      {
        q: "Ar galiu redaguoti tatuiruotes, aprangą ar foną?",
        a: "Taip, kiekvienas planas apima AI redagavimus. Pridėk ar pašalink tatuiruotes, pakeisk drabužius, pašalink objektus ar išvalyk foną vienu sakiniu",
      },
      {
        q: "Ar mano duomenys privatūs?",
        a: "Tavo įkėlimai ir sugeneruotos nuotraukos privatai tavo paskyroje. Niekada nepostiname, nesidalijame ir neapmokome viešų modelių tavo veidu, o ištrynimą gali prašyti bet kada",
      },
      {
        q: "Kiek laiko saugomos mano nuotraukos ir kiek galioja kreditai?",
        a: "Sugeneruotos nuotraukos lieka galerijoje 1–2 mėnesius. Kreditai galioja visus metus nuo pirkimo",
      },
    ],
  },

  finalCta: {
    title: "Būk profilis, kuris sustabdo scroll",
    body: "80 % ignoruojami. 20 % gavo geresnes nuotraukas. Kurį nori būti šį vakarą?",
    cta: "Pradėti",
  },

  footer: {
    tagline: "AI pažinčių nuotraukos, sukurtos kad tave pastebėtų",
    support: "Klausimai?",
    rights: "Visos teisės saugomos",
  },
} satisfies Dictionary;
