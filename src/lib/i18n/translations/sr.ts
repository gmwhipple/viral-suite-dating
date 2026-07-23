import type { Dictionary } from "./en";

export const sr = {
  nav: {
    results: "Rezultati",
    pricing: "Cene",
    faq: "FAQ",
    signIn: "Prijava",
    getStarted: "Započni",
  },

  stickyCta: {
    label: "Započni",
    sub: "Jednokratna uplata · {photoCount} fotografija",
  },

  hero: {
    badge: "80 % dating profila se ignoriše. Budi u onih 20 %",
    titleLine1: "Dating fotografije osmišljene",
    titleAccent: "za njezine oči",
    titleAccentAlt: "za njegove oči",
    titleLine2: "ne za tvoje ego",
    subtitle:
      "Naša vlasnička AI proučava šta stvarno zaustavlja swipe, zatim obnavlja tvoj profil prirodnim fotografijama na nivou magazina koje odgovaraju tvojoj stvarnoj estetici. Nula plastičnog AI izgleda. Nula vidljivih artefakata",
    cta: "Transformiši moj profil",
    ctaSecondary: "Pogledaj stvarne rezultate",
    ratingLabel: "ocenjeno od strane singlova koji više nisu ignorisani",
  },

  trustBar: {
    label: "Veruju nam singlovi koji pobeđuju na",
  },

  proof: {
    kicker: "Matematika je okrutna",
    title: "Imaš jedan swipe da je zaustaviš",
    titleAlt: "Imaš jedan swipe da ga zaustaviš",
    body: "80 % dating profila se ignoriše, ne zbog osobe, nego zbog fotografija. Savet broj 1 od svakog dating trenera isti je: prvo popravi fotografije. Trenirali smo naš vlasnički AI sistem da bude ocenjen atraktivnim, a da i dalje zadrži taj prirodan izgled",
    stats: [
      {
        value: "75%",
        label: "profila se preskoči za manje od sekunde",
      },
      {
        value: "10x",
        label: "bolji kvalitet matchova",
      },
      {
        value: "100+",
        label: "minuta ušteđeno svake nedelje zbog ignorisanja i odustajanja",
      },
    ],
  },

  beforeAfter: {
    kicker: "Stvarna estetika. Nula artefakata",
    title: "Isto lice. Potpuno drugačiji prvi utisak",
    body: "Svaka referenca u našem katalogu ručno je odabrana jer 10x bolje funkcioniše na dating aplikacijama. Naša vlasnička AI ih mapira na tvoju stvarnu estetiku, pa fotografije izgledaju kao ti na tvoj najbolji dan, a ne kao render tebe",
    toggleForHim: "Za njega",
    toggleForHer: "Za nju",
    toggleHint: "Fotografije optimizovane za ljude koje želiš da privučeš",
    beforeLabel: "Pre",
    afterLabel: "Posle",
    meterLabel: "Swipe privlačnost",
    meterBeforeCaption: "Preskače se",
    meterAfterCaption: "Prvi dobija poruke, bolji dejtovi i više matchova",
    disclaimer: "Transformacije klijenata sa kojima smo radili",
    examples: {
      him: [
        { beforeCaption: "Ignorisanje koje mentalno iscrpljuje" },
        {
          beforeCaption: "Razgovori, ali puno odustajanja",
          afterCaption: "Sam bira koga će ignorisati",
        },
      ],
      her: [
        {
          beforeCaption: "Dejtovi bez truda",
          afterCaption: "Dobija muškarca svojih snova",
        },
        {
          beforeCaption: "Samo dejtovi bez obaveze",
          afterCaption: "Pronalazi svoju srodnu dušu",
        },
      ],
    },
  },

  gaze: {
    kicker: "Nepravedna prednost",
    titleHim: "Stvoreno za ženski pogled",
    titleHer: "Stvoreno za muški pogled",
    body: "Muškarci snimaju fotografije koje se drugim muškarcima čine cool. Žene biraju fotografije koje se sviđaju prijateljicama. Oboje greši. Reverzno smo analizirali na šta ljudi koje pokušavaš da privučeš stvarno reaguju: prirodno kadriranje, prirodno svetlo, stvarno okruženje, i na to smo trenirali naš sistem",
    toggleForHim: "Muškarci",
    toggleForHer: "Žene",
    points: [
      {
        title: "Prirodno, ne inscenirano",
        body: "Fotografije koje izgledaju kao da te je talentovan prijatelj uhvatio usred trenutka. Tako se stiče poverenje i odgovori",
      },
      {
        title: "Ručno odabrane reference",
        body: "Svaka naša stilska referenca odabrana je jer statistički nadmašuje na dating aplikacijama. Bez punila, bez generičkih AI portreta",
      },
      {
        title: "Tvoja stvarna estetika",
        body: "Bez voskaste kože, rastopljenih ruku, bez uncanny valley. Ako ne prođe kao stvarna fotografija, nikad ne stiže u tvoju galeriju",
      },
    ],
  },

  profileBadge: {
    line1: "Generator profilnih",
    line2: "dating fotografija br. 1",
  },

  photoshoot: {
    kicker: "Izračunaj",
    title: "Besprekorno bolje od fotografisanja za {photographerPrice}",
    body: "Fotograf ti daje jedno popodne, jednu odeću i fotografije koje viču \u201eUnajmio sam fotografa za dating profil.\u201c Mi ti dajemo ceo katalog prirodnih lookova, života na najvišem nivou, za delić cene",
    themLabel: "Tradicionalno fotografisanje",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ za jednu sesiju",
        us: "Jedna uplata {price}, to je to",
      },
      {
        them: "10 do 20 upotrebljivih fotografija ako imaš sreće",
        us: "{photoCount} fotografija u proverenim stilovima",
      },
      {
        them: "Jedna odeća, jedna lokacija, jedna atmosfera",
        us: "Desetine outfita, scena i raspoloženja",
      },
      {
        them: "Vidljivo pozirano i inscenirano",
        us: "Prirodno, prirodno za estetiku feeda",
      },
      { them: "Nedelje planiranja i čekanja", us: "Spremno za sati, sa kauča" },
      {
        them: "Ponovno snimanje? Plati opet.",
        us: "100 AI uređivanja uključeno",
      },
    ],
    punchline: "Ljubav je u igri. Ne prepusti je nekome ko je već plaćen",
  },

  match: {
    kicker: "Gde to završava",
    title: "Kvalitetniji razgovori počinju boljim fotografijama",
    body: "Više matchova je tek početak. Kada tvoje fotografije konačno pokažu koliko zanimljivo i samopouzdano izgledaš, dejtovi prestaju da nestaju, razgovori kreću jače, a \u201eizgledaš baš kao na slikama\u201c postaje kompliment, a ne olakšanje",
    imageAlt: "Ekrani Tinder matchova sa natpisom It's a Match",
  },

  manifesto: {
    text: "Bolje fotografije znače bolje matchove. Jednostavno je. Savet broj 1 koji će ti dati svaki dating guru jeste da nabaviš bolje dating fotografije. Ljudi su ipak vizuelna bića. Koristimo vrhunsku AI da taj proces učinimo super pristupačnim i jednostavnim kao 1 2 3",
    attribution: "Zašto smo stvorili {appName}",
  },

  steps: {
    kicker: "Jednostavno kao 1 2 3",
    title: "Tvoj glow up na autopilotu",
    items: [
      {
        title: "Otpremi svoje selfije",
        body: "10+ svakodnevnih fotografija. Naša AI uči tvoje lice iz svakog ugla",
      },
      {
        title: "AI gradi tvoj lik",
        body: "Privatni model tebe, treniran jednom, višekratno upotrebljiv u svakom stilu",
      },
      {
        title: "Preuzmi {photoCount} fotografija",
        body: "Ručno odabrani stilovi, bez vodenog žiga, prilagođeni svakoj dating aplikaciji",
      },
    ],
  },

  pricing: {
    kicker: "Jedna uplata. Bez pretplate",
    title: "Jeftinije od jednog lošeg prvog dejta",
    body: "Potrošićeš više na dejtove sa lošim matchovima. Popravi fotografije jednom i tvoje iskustvo sa dating aplikacijama promeniće se zauvek",
    planName: "Profilne fotografije",
    features: [
      "{photoCount} AI generisanih dating fotografija",
      "100 AI uređivanja za promenu odeće, prilagođavanje scene ili bolji osmeh",
      "Preko 200+ ručno odabranih, visoko efikasnih stilova i scena",
      "Optimizovano za ljude koje želiš da privučeš",
      "Bez vodenog žiga, spremno za preuzimanje u aplikacije",
      "Privatno: tvoje fotografije se nikad ne dele",
      "Prioritetna obrada",
    ],
    cta: "Preuzmi moje fotografije",
    guarantee:
      "Tvoje fotografije za treniranje ostaju privatne i sigurno sačuvane",
    payoff:
      "Ako ti jedna fotografija donese jedan dodatni sjajan dejt, već se isplatila",
  },

  faq: {
    title: "Pitanja i odgovori",
    items: [
      {
        q: "Hoće li fotografije stvarno izgledati kao ja?",
        a: "Da. AI trenira na tvom stvarnom licu iz otpremljenih selfija i odgovara tvojoj stvarnoj estetici. Bez uncanny valley, bez plastične kože. Ako fotografija ne prođe kao stvarna, regeneriši je ili popravi uključenim AI uređivanjem",
      },
      {
        q: "Čime je ovo bolje od profesionalnog fotografisanja?",
        a: "Fotografisanje za {photographerPrice} kupuje ti jednu odeću, jednu lokaciju i vidljivo pozirane fotografije. Ti dobijaš ceo katalog prirodnih lookova, života na najvišem nivou, u desetinama scena, plus AI uređivanja, za delić cene, bez izlaska iz kuće",
      },
      {
        q: "Šta znači optimizovano za ženski / muški pogled?",
        a: "Naše stilske reference ručno su odabrane na osnovu onoga na šta ljudi koje želiš da privučeš stvarno reaguju: prirodno kadriranje, prirodno okruženje, toplo svetlo, a ne ono što tebi izgleda impresivno. Zato 10x bolje funkcionišu",
      },
      {
        q: "Koliko brzo dobijam fotografije?",
        a: "Treniranje tvog privatnog AI lika traje otprilike 20 do 45 minuta. Nakon toga svaka fotografija generiše se za minute. Većina korisnika ima potpuno nov profil istog dana",
      },
      {
        q: "Mogu li da uređujem tetovaže, odeću ili pozadine?",
        a: "Da, svaki plan uključuje AI uređivanja. Dodaj ili ukloni tetovaže, zameni odeću, ukloni objekte ili očisti pozadine upisivanjem rečenice",
      },
      {
        q: "Da li su moji podaci privatni?",
        a: "Tvoji otpremljeni i generisani materijali privatni su na tvom nalogu. Nikad ne objavljujemo, ne delimo niti treniramo javne modele na tvom licu, a brisanje možeš da zatražiš bilo kada",
      },
      {
        q: "Koliko dugo se čuvaju moje fotografije i koliko traju krediti?",
        a: "Generisane fotografije ostaju u galeriji 1–2 meseca. Krediti važe celu godinu od kupovine",
      },
    ],
  },

  finalCta: {
    title: "Budi profil koji zaustavlja scroll",
    body: "80 % se ignoriše. 20 % je dobilo bolje fotografije. U koju grupu želiš večeras?",
    cta: "Započni",
  },

  footer: {
    tagline: "AI dating fotografije osmišljene da te primeče",
    support: "Pitanja?",
    rights: "Sva prava zadržana",
  },
  feedbackPrompt: {
    question: "Да ли вам недостаје информација да бисте користили нашу услугу?",
    placeholder: "Реците нам шта недостаје или није јасно...",
    submit: "Пошаљи",
    closeLabel: "Затвори",
    thanks: "Хвала на повратној информацији!",
  },
} satisfies Dictionary;
