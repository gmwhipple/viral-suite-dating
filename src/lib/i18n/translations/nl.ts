import type { Dictionary } from "./en";

export const nl = {
  nav: {
    results: "Resultaten",
    pricing: "Prijzen",
    faq: "FAQ",
    signIn: "Inloggen",
    getStarted: "Aan de slag",
  },

  stickyCta: {
    label: "Aan de slag",
    sub: "Eenmalige betaling · {photoCount} foto's",
  },

  hero: {
    badge: "80% van de datingprofielen wordt genegeerd. Wees de 20%",
    titleLine1: "Datingfoto's ontworpen",
    titleAccent: "voor haar ogen",
    titleAccentAlt: "voor zijn ogen",
    titleLine2: "niet voor je ego",
    subtitle:
      "Onze eigen AI bestudeert wat de swipe echt laat stoppen en bouwt je profiel opnieuw op met spontane, magazine-waardige foto's die passen bij je echte esthetiek. Geen plastic AI-look. Geen zichtbare artefacten",
    cta: "Transformeer mijn profiel",
    ctaSecondary: "Bekijk echte resultaten",
    ratingLabel: "beoordeeld door singles die niet meer werden genegeerd",
  },

  trustBar: {
    label: "Vertrouwd door singles die winnen op",
  },

  proof: {
    kicker: "De cijfers zijn genadeloos",
    title: "Je hebt één swipe om haar te laten stoppen",
    titleAlt: "Je hebt één swipe om hem te laten stoppen",
    body: "80% van de datingprofielen wordt genegeerd, niet vanwege de persoon, maar vanwege de foto's. Het #1 advies van elke datingcoach is hetzelfde: fix eerst je foto's. We hebben ons eigen AI-systeem getraind om als aantrekkelijk beoordeeld te worden terwijl die spontane look behouden blijft",
    stats: [
      {
        value: "75%",
        label: "van de profielen wordt in minder dan een seconde overgeslagen",
      },
      {
        value: "10x",
        label: "betere kwaliteit matches",
      },
      {
        value: "100+",
        label: "minuten per week bespaard door negeren en afzeggen",
      },
    ],
  },

  beforeAfter: {
    kicker: "Echte esthetiek. Geen artefacten",
    title: "Hetzelfde gezicht. Compleet andere eerste indruk",
    body: "Elke referentie in onze catalogus is handmatig gekozen omdat die 10x beter presteert op datingapps. Onze eigen AI past ze toe op je echte esthetiek, zodat de foto's lijken op jou op je beste dag, niet op een render van jou",
    toggleForHim: "Voor hem",
    toggleForHer: "Voor haar",
    toggleHint: "Foto's geoptimaliseerd voor wie je wilt aantrekken",
    beforeLabel: "Voor",
    afterLabel: "Na",
    meterLabel: "Swipe-appeal",
    meterBeforeCaption: "Wordt overgeslagen",
    meterAfterCaption:
      "Krijgt als eerste berichten, betere dates en meer matches",
    disclaimer: "Transformaties van klanten waarmee we hebben gewerkt",
    examples: {
      him: [
        { beforeCaption: "Genegeerd worden, mentaal uitputtend" },
        {
          beforeCaption: "Gesprekken maar veel afzeggingen",
          afterCaption: "Kiest zelf wie hij afzegt",
        },
      ],
      her: [
        {
          beforeCaption: "Dates zonder moeite",
          afterCaption: "Krijgt haar droomman",
        },
        {
          beforeCaption: "Alleen dates zonder commitment",
          afterCaption: "Vindt haar soulmate",
        },
      ],
    },
  },

  gaze: {
    kicker: "Het oneerlijke voordeel",
    titleHim: "Gebouwd voor de vrouwelijke blik",
    titleHer: "Gebouwd voor de mannelijke blik",
    body: "Mannen maken foto's die andere mannen cool vinden. Vrouwen kiezen foto's die hun vriendinnen leuk vinden. Beide zijn fout. We hebben omgekeerd ontworpen waar de mensen die je wilt aantrekken echt op reageren: spontane kadrering, natuurlijk licht, echte omgevingen, en daarop getraind",
    toggleForHim: "Mannen",
    toggleForHer: "Vrouwen",
    points: [
      {
        title: "Spontaan, niet geposeerd",
        body: "Foto's die lijken alsof een getalenteerde vriend je midden in het moment heeft vastgelegd. Zo win je vertrouwen en reacties",
      },
      {
        title: "Handmatig gekozen referenties",
        body: "Elke stijlreferentie is geselecteerd omdat die statistisch beter presteert op datingapps. Geen opvulling, geen generieke AI-portretten",
      },
      {
        title: "Jouw echte esthetiek",
        body: "Geen wasachtige huid, geen vervormde handen, geen uncanny valley. Als het niet als een echte foto doorgaat, komt het nooit in je galerij",
      },
    ],
  },

  profileBadge: {
    line1: "#1 datingprofiel",
    line2: "fotogenerator",
  },

  photoshoot: {
    kicker: "Reken het uit",
    title: "Oneindig beter dan een fotoshoot van {photographerPrice}",
    body: "Een fotograaf geeft je één middag, één outfit en foto's die schreeuwen \u201cIk heb een fotograaf ingehuurd voor mijn datingprofiel.\u201d Wij geven je een hele catalogus spontane looks, je leven op z'n best, voor een fractie van de prijs",
    themLabel: "Traditionele fotoshoot",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ voor één sessie",
        us: "Eén betaling van {price}, dat is alles",
      },
      {
        them: "10 tot 20 bruikbare foto's als je geluk hebt",
        us: "{photoCount} foto's in bewezen stijlen",
      },
      {
        them: "Eén outfit, één locatie, één sfeer",
        us: "Tientallen outfits, scènes en moods",
      },
      {
        them: "Zichtbaar geposeerd en geënsceneerd",
        us: "Spontaan, passend bij de feed-esthetiek",
      },
      {
        them: "Weken plannen en wachten",
        us: "Klaar binnen uren, vanaf je bank",
      },
      {
        them: "Opnieuw shooten? Weer betalen.",
        us: "100 AI-bewerkingen inbegrepen",
      },
    ],
    punchline:
      "Liefde staat op het spel. Laat het niet aan iemand over die al betaald is",
  },

  match: {
    kicker: "Waar dit eindigt",
    title: "Gesprekken van hogere kwaliteit beginnen met betere foto's",
    body: "Meer matches is pas het begin. Als je foto's eindelijk laten zien hoe interessant en zelfverzekerd je eruitziet, haken dates niet meer af, gesprekken starten sterker en \u201cje lijkt precies op je foto's\u201d wordt een compliment, geen opluchting",
    imageAlt: "Tinder match-schermen met It's a Match",
  },

  manifesto: {
    text: "Betere foto's betekenen betere matches. Zo simpel is het. Het #1 advies dat elke datinggoeroe je geeft is betere profielfoto's. Mensen zijn nu eenmaal visuele wezens. We gebruiken geavanceerde AI om dat proces super betaalbaar en zo makkelijk als 1 2 3 te maken",
    attribution: "Waarom we {appName} hebben gebouwd",
  },

  steps: {
    kicker: "Zo makkelijk als 1 2 3",
    title: "Jouw glow-up, op de automatische piloot",
    items: [
      {
        title: "Upload je selfies",
        body: "10+ alledaagse foto's. Onze AI leert je gezicht vanuit elke hoek",
      },
      {
        title: "AI bouwt je karakter",
        body: "Een privémodel van jou, één keer getraind, herbruikbaar in elke stijl",
      },
      {
        title: "Download {photoCount} foto's",
        body: "Handmatig gekozen stijlen, zonder watermerk, formaat voor elke datingapp",
      },
    ],
  },

  pricing: {
    kicker: "Eén betaling. Geen abonnement",
    title: "Goedkoper dan één slechte eerste date",
    body: "Je geeft meer uit aan dates met matches van lage kwaliteit. Fix de foto's één keer en je datingapp-ervaring verandert voorgoed",
    planName: "Profielfoto's",
    features: [
      "{photoCount} AI-gegenereerde datingfoto's",
      "100 AI-bewerkingen, voor outfitwissels, achtergrondaanpassing of een betere glimlach",
      "Meer dan 200+ handmatig gekozen, hoogpresterende stijlen en scènes",
      "Geoptimaliseerd voor de mensen die je wilt aantrekken",
      "Zonder watermerk, klaar voor apps",
      "Privé: je foto's worden nooit gedeeld",
      "Prioriteitsverwerking",
    ],
    cta: "Haal mijn foto's",
    guarantee: "Je trainingsfoto's blijven privé en veilig opgeslagen",
    payoff:
      "Als één foto je één extra geweldige date oplevert, heeft het zichzelf al terugverdiend",
  },

  faq: {
    title: "Vragen, beantwoord",
    items: [
      {
        q: "Lijken de foto's echt op mij?",
        a: "Ja. De AI traint op je echte gezicht vanuit de selfies die je uploadt en past bij je echte esthetiek. Geen uncanny valley, geen plastic huid. Als een foto niet echt oogt, genereer hem opnieuw of fix hem met een inbegrepen AI-bewerking",
      },
      {
        q: "Hoe is dit beter dan een professionele fotoshoot?",
        a: "Een fotoshoot van {photographerPrice} koopt je één outfit, één locatie en zichtbaar geposeerde foto's. Jij krijgt een hele catalogus spontane looks, je leven op z'n best, in tientallen scènes, plus AI-bewerkingen, voor een fractie van de prijs, zonder je huis te verlaten",
      },
      {
        q: "Wat bedoel je met geoptimaliseerd voor de vrouwelijke / mannelijke blik?",
        a: "Onze stijlreferenties zijn handmatig gekozen op basis van waar de mensen die je wilt aantrekken echt op reageren: spontane kadrering, natuurlijke settings, warm licht, niet wat indrukwekkend op jou overkomt. Daarom presteren ze 10x beter",
      },
      {
        q: "Hoe snel krijg ik mijn foto's?",
        a: "Het trainen van je privé AI-karakter duurt ongeveer 20 tot 45 minuten. Daarna genereert elke foto binnen minuten. De meeste gebruikers hebben dezelfde dag een volledig nieuw profiel",
      },
      {
        q: "Kan ik tatoeages, outfits of achtergronden bewerken?",
        a: "Ja, elk plan bevat AI-bewerkingen. Voeg tatoeages toe of verwijder ze, wissel kleding, verwijder objecten of maak achtergronden schoon door een zin te typen",
      },
      {
        q: "Zijn mijn gegevens privé?",
        a: "Je uploads en gegenereerde foto's zijn privé voor je account. We plaatsen, delen of trainen nooit publieke modellen op je gezicht, en je kunt op elk moment verwijdering aanvragen",
      },
      {
        q: "Hoe lang worden mijn foto's bewaard en hoe lang blijven credits geldig?",
        a: "Gegenereerde foto's blijven 1 tot 2 maanden beschikbaar in je galerij. Credits zijn een volledig jaar geldig vanaf aankoop, zodat je ruim de tijd hebt om alles te genereren, bewerken en downloaden",
      },
    ],
  },

  finalCta: {
    title: "Wees het profiel dat de scroll stopt",
    body: "80% wordt genegeerd. De 20% kreeg betere foto's. Bij welke groep wil je vanavond horen?",
    cta: "Aan de slag",
  },

  footer: {
    tagline: "AI-datingfoto's ontworpen om op te vallen",
    support: "Vragen?",
    rights: "Alle rechten voorbehouden",
  },
  feedbackPrompt: {
    question: "Mis je informatie om onze dienst te gebruiken?",
    placeholder: "Vertel ons wat ontbreekt of onduidelijk is...",
    submit: "Versturen",
    closeLabel: "Sluiten",
    thanks: "Bedankt voor je feedback!",
  },
} satisfies Dictionary;
