import type { Dictionary } from "./en";

export const et = {
  nav: {
    results: "Tulemused",
    pricing: "Hinnad",
    faq: "FAQ",
    signIn: "Logi sisse",
    getStarted: "Alusta",
  },

  stickyCta: {
    label: "Alusta",
    sub: "Ühekordne makse · {photoCount} fotot",
  },

  hero: {
    badge: "80% tutvumisprofiile ignoreeritakse. Ole 20% hulgas",
    titleLine1: "Tutvumisfotod loodud",
    titleAccent: "naiste silmadele",
    titleAccentAlt: "meeste silmadele",
    titleLine2: "mitte sinu egole",
    subtitle:
      "Meie patenteeritud tehisintellekt uurib, mis swipe'i tegelikult peatab, seejärel ehitab sinu profiili ümber ausate, ajakirjakvaliteediga fotodega, mis sobivad sinu tõelise esteetikaga. Null plastilist AI-välimust. Null märgatavaid artefakte",
    cta: "Muuda mu profiil",
    ctaSecondary: "Vaata päris tulemusi",
    ratingLabel: "hinnanud vallalised, keda enam ei ignoreerita",
  },

  trustBar: {
    label: "Usaldavad vallalised, kes võidavad",
  },

  proof: {
    kicker: "Matemaatika on julm",
    title: "Sul on üks swipe, et ta peataks",
    titleAlt: "Sul on üks swipe, et ta peataks",
    body: "80% tutvumisprofiile ignoreeritakse mitte inimese, vaid fotode pärast. Iga tutvumiscoachi nr 1 nõuanne on sama: paranda esmalt fotod. Treenisime oma patenteeritud AI-süsteemi saama hinnangu atraktiivsuse osas, säilitades ausa välimuse",
    stats: [
      {
        value: "75%",
        label: "profiilidest jäetakse vahele alla sekundiga",
      },
      {
        value: "10x",
        label: "parem vaste kvaliteet",
      },
      {
        value: "100+",
        label: "minutit säästetud nädalas ignoreerimise ja tühistamise tõttu",
      },
    ],
  },

  beforeAfter: {
    kicker: "Päris esteetika. Null artefakte",
    title: "Sama nägu. Täiesti teistsugune esimene mulje",
    body: "Iga meie kataloogi viide valiti käsitsi, sest see toimib tutvumisrakendustes 10 korda paremini. Meie patenteeritud AI kaardistab need sinu tõelisele esteetikale, nii et fotod näevad välja nagu sina parimal päeval, mitte nagu sinu render",
    toggleForHim: "Talle",
    toggleForHer: "Talle",
    toggleHint: "Fotod optimeeritud inimesele, keda soovid meelitada",
    beforeLabel: "Enne",
    afterLabel: "Pärast",
    meterLabel: "Swipe'i atraktiivsus",
    meterBeforeCaption: "Jäetakse vahele",
    meterAfterCaption:
      "Saab esimesena sõnumi, paremad kohtingud, rohkem vasteid",
    disclaimer: "Meie klientide transformatsioonid",
    examples: {
      him: [
        { beforeCaption: "Ignoreerimine, mis kurnab vaimselt" },
        {
          beforeCaption: "Vestlused, aga palju tühistamisi",
          afterCaption: "Ta valib, keda ignoreerida",
        },
      ],
      her: [
        {
          beforeCaption: "Vähe pingutust nõudvad kohtingud",
          afterCaption: "Saab oma unistuste mehe",
        },
        {
          beforeCaption: "Ainult pühendumuseta kohtingud",
          afterCaption: "Leiab oma hingesõbra",
        },
      ],
    },
  },

  gaze: {
    kicker: "Ebaõiglane eelis",
    titleHim: "Loodud naiste pilgu jaoks",
    titleHer: "Loodud meeste pilgu jaoks",
    body: "Mehed teevad fotosid, mida teised mehed lahedaks peavad. Naised valivad fotosid, mis meeldivad sõbrannadele. Mõlemad on valed. Pöörasime inseneriteaduse ja uurisime, millele inimesed, keda soovid meelitada, tegelikult reageerivad, aus kaader, loomulik valgus, päris keskkonnad, ja treenisime süsteemi sellel",
    toggleForHim: "Mehed",
    toggleForHer: "Naised",
    points: [
      {
        title: "Aus, mitte lavastatud",
        body: "Fotod, mis näevad välja nagu andekas sõber püüdis sind hetke keskel. See teenib usaldust ja vastuseid",
      },
      {
        title: "Käsitsi valitud viited",
        body: "Iga meie stiiliviide valiti, sest see toimib statistiliselt tutvumisrakendustes paremini. Ei täitematerjali, ei geneerilisi AI portreesid",
      },
      {
        title: "Sinu tõeline esteetika",
        body: "Ei vahalist nahka, ei sulanud käsi, ei uncanny valley't. Kui see ei paista päris fotona, ei jõua see kunagi sinu galeriisse",
      },
    ],
  },

  profileBadge: {
    line1: "#1 tutvumisprofiili",
    line2: "fotode generaator",
  },

  photoshoot: {
    kicker: "Arvuta",
    title: "Lõputult parem kui {photographerPrice} fotosessioon",
    body: "Fotograaf annab ühe pärastlõuna, ühe riietuse ja fotod, mis karjuvad: „Ma palkasin fotograafi oma tutvumisprofiili jaoks.“ Me anname terve kataloogi ausaid välimusi, sinu parimat elu, murdosa hinnaga",
    themLabel: "Traditsiooniline fotosessioon",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ ühe sessiooni eest",
        us: "Üks makse {price}, see on kõik",
      },
      {
        them: "10-20 kasutatavat fotot, kui veab",
        us: "{photoCount} fotot tõestatud stiilides",
      },
      {
        them: "Üks riietus, üks koht, üks meeleolu",
        us: "Kümneid riietusi, stseene ja meeleolusid",
      },
      {
        them: "Nähtavalt poseeritud ja lavastatud",
        us: "Aus, feedi esteetikale sobiv",
      },
      {
        them: "Nädalaid planeerimist ja ootamist",
        us: "Valmis tundidega diivanilt",
      },
      {
        them: "Uus sessioon? Maksa uuesti.",
        us: "100 AI redigeerimist kaasas",
      },
    ],
    punchline:
      "Armastus on mängus. Ära jäta seda kellegi hoole, kes on juba tasustatud",
  },

  match: {
    kicker: "Kuhu see viib",
    title: "Kvaliteetsemad vestlused algavad swipe'ist",
    body: "Rohkem vasteid on alles algus. Kui sinu fotod näitavad lõpuks, kui huvitav ja enesekindel sa välja näed, kohtingud ei tühistu enam, vestlused algavad tugevamalt ja „sa näed välja täpselt nagu piltidel“ muutub komplimendiks, mitte kergenduseks",
    imageAlt: "Tinderi vaste ekraanid It's a Match kirjaga",
  },

  manifesto: {
    text: "Paremad fotod tähendavad paremaid vasteid. Nii lihtne see ongi. Iga tutvumisguru nr 1 nõuanne on: hangi paremad tutvumis-headshot'id. Inimesed on ju visuaalsed olendid. Kasutame tipptasemel AI-d, et see protsess oleks väga taskukohane ja lihtne nagu 1 2 3",
    attribution: "Miks me ehitasime {appName}",
  },

  steps: {
    kicker: "Nii lihtne nagu 1 2 3",
    title: "Sinu glow up autopiloodil",
    items: [
      {
        title: "Laadi üles oma selfid",
        body: "10+ igapäevast fotot. Meie AI õpib sinu nägu igast nurgast",
      },
      {
        title: "AI loob sinu tegelase",
        body: "Privaatne sinu mudel, üks kord treenitud, taaskasutatav igas stiilis",
      },
      {
        title: "Laadi alla {photoCount} fotot",
        body: "Käsitsi valitud stiilid, ilma veemärkideta, iga tutvumisrakenduse jaoks valmis",
      },
    ],
  },

  pricing: {
    kicker: "Üks makse. Ilma tellimuseta",
    title: "Odavam kui üks halb esimene kohting",
    body: "Kulutad rohkem kohtingutele madala kvaliteediga vastetega. Paranda fotod üks kord ja sinu tutvumisrakenduse kogemus muutub igaveseks",
    planName: "Profiilifotod",
    features: [
      "{photoCount} AI-ga loodud tutvumisfotot",
      "100 AI redigeerimist: riietuse vahetus, stseeni kohandamine või parem naeratus",
      "Üle 200+ käsitsi valitud, kõrge tootlusega stiile ja stseene",
      "Optimeeritud inimestele, keda soovid meelitada",
      "Ilma veemärkideta, rakendusteks valmis allalaadimised",
      "Privaatne: sinu fotosid ei jagata kunagi",
      "Prioriteetne töötlemine",
    ],
    cta: "Hangi mu fotod",
    guarantee:
      "Sinu treeningfotod jäävad privaatseks ja turvaliselt salvestatuks",
    payoff:
      "Kui üks foto toob ühe lisaväga hea kohtingu, on see end juba ära tasunud",
  },

  faq: {
    title: "Küsimused, vastused",
    items: [
      {
        q: "Kas fotod näevad tegelikult välja nagu mina?",
        a: "Jah. AI treenib sinu päris näolt üles laaditud selfide põhjal ja sobib sinu tõelise esteetikaga. Ei uncanny valley't, ei plastilist nahka. Kui foto ei paista päris, genereeri uuesti või paranda kaasasoleva AI redigeerimisega",
      },
      {
        q: "Kuidas see on parem kui professionaalne fotosessioon?",
        a: "{photographerPrice} fotosessioon annab ühe riietuse, ühe koha ja nähtavalt poseeritud fotod. Sa saad terve kataloogi ausaid välimusi, sinu parimat elu, kümnetes stseenides, pluss AI redigeerimised, murdosa hinnaga, ilma kodust lahkumata",
      },
      {
        q: "Mida tähendab optimeeritud naiste / meeste pilgu jaoks?",
        a: "Meie stiiliviited valiti käsitsi selle põhjal, millele inimesed, keda soovid meelitada, tegelikult reageerivad, aus kaader, loomulikud keskkonnad, soe valgus, mitte see, mis sind muljet avaldab. Seetõttu toimivad need 10 korda paremini",
      },
      {
        q: "Kui kiiresti saan oma fotod?",
        a: "Sinu privaatse AI tegelase treenimine võtab umbes 20-45 minutit. Pärast seda genereeritakse iga foto minutitega. Enamik kasutajaid saab samal päeval täiesti uue profiili",
      },
      {
        q: "Kas saan redigeerida tätoveeringuid, riietust või tausta?",
        a: "Jah, iga plaan sisaldab AI redigeerimisi. Lisa või eemalda tätoveeringuid, vaheta riideid, eemalda objekte või puhasta taust ühe lausega",
      },
      {
        q: "Kas mu andmed on privaatsed?",
        a: "Sinu üleslaadimised ja genereeritud fotod on privaatsed sinu kontol. Me ei postita, jaga ega treeni avalikke mudeleid sinu näoga kunagi, ja saad igal ajal kustutamist taotleda",
      },
    ],
  },

  finalCta: {
    title: "Ole profiil, mis peatab scrolli",
    body: "80% ignoreeritakse. 20% said paremad fotod. Kumb sa tahad täna õhtul olla?",
    cta: "Alusta",
  },

  footer: {
    tagline: "AI tutvumisfotod, loodud et sind märkaks",
    support: "Küsimused?",
    rights: "Kõik õigused kaitstud",
  },
} satisfies Dictionary;
