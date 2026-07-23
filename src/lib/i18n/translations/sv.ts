import type { Dictionary } from "./en";

export const sv = {
  nav: {
    results: "Resultat",
    pricing: "Priser",
    faq: "Vanliga frågor",
    signIn: "Logga in",
    getStarted: "Kom igång",
  },

  stickyCta: {
    label: "Kom igång",
    sub: "Engångsbetalning · {photoCount} foton",
  },

  hero: {
    badge: "80 % av dejtingprofiler ignoreras. Var bland de 20 %",
    titleLine1: "Dejtingfoton konstruerade",
    titleAccent: "för hennes blick",
    titleAccentAlt: "för hans blick",
    titleLine2: "inte för ditt ego",
    subtitle:
      "Vår egenutvecklade AI studerar vad som faktiskt får någon att stanna vid swipen, och bygger om din profil med naturliga, tidningskvalitetsfoton som matchar din verkliga livsstil. Ingen plastig AI-look. Inga synliga artefakter",
    cta: "Förvandla min profil",
    ctaSecondary: "Se riktiga resultat",
    ratingLabel: "betygsatt av singlar som slutade bli ignorerade",
  },

  trustBar: {
    label: "Betrodd av singlar som vinner på",
  },

  proof: {
    kicker: "Siffrorna är brutala",
    title: "Du har ett swipe på dig att få henne att stanna",
    titleAlt: "Du har ett swipe på dig att få honom att stanna",
    body: "80 % av dejtingprofiler ignoreras, inte på grund av personen utan på grund av fotona. Råd nummer ett från varje dejtingcoach är detsamma: fixa dina foton först. Vi tränade vårt egenutvecklade AI-system att bedömas som attraktivt samtidigt som den naturliga looken behålls",
    stats: [
      {
        value: "75%",
        label: "av profilerna hoppas över på under en sekund",
      },
      {
        value: "10x",
        label: "förbättrad matchkvalitet",
      },
      {
        value: "100+",
        label: "minuter sparade varje vecka på ignorering och avbokningar",
      },
    ],
  },

  beforeAfter: {
    kicker: "Riktig estetik. Noll artefakter",
    title: "Samma ansikte. Helt annorlunda första intryck",
    body: "Varje referens i vår katalog handplockades för att prestera 10 gånger bättre på dejtingappar. Vår egenutvecklade AI mappar dem till din verkliga livsstil, så fotona ser ut som du på din bästa dag - inte en rendering av dig",
    toggleForHim: "För honom",
    toggleForHer: "För henne",
    toggleHint: "Foton optimerade för vem du vill attrahera",
    beforeLabel: "Före",
    afterLabel: "Efter",
    meterLabel: "Swipe-attraktion",
    meterBeforeCaption: "Hoppas över",
    meterAfterCaption: "Får meddelanden först, bättre dejter, fler matchningar",
    disclaimer: "Transformationer från kunder vi har arbetat med",
    examples: {
      him: [
        { beforeCaption: "Att bli ignorerad är mentalt dränerande" },
        {
          beforeCaption: "Samtal men många avbokningar",
          afterCaption: "Får välja vem han avbokar",
        },
      ],
      her: [
        {
          beforeCaption: "Dejter utan ansträngning",
          afterCaption: "Får sin drömkille",
        },
        {
          beforeCaption: "Får bara dejter utan commitment",
          afterCaption: "Hittar sin soulmate",
        },
      ],
    },
  },

  gaze: {
    kicker: "Den orättvisa fördelen",
    titleHim: "Byggd för den kvinnliga blicken",
    titleHer: "Byggd för den manliga blicken",
    body: "Killar fotar det andra killar tycker ser coolt ut. Kvinnor väljer foton som vännerna gillar. Båda har fel. Vi reverse-engineerade vad folk du vill attrahera faktiskt reagerar på - naturlig inramning, naturligt ljus, riktiga miljöer - och tränade vårt system på det",
    toggleForHim: "Män",
    toggleForHer: "Kvinnor",
    points: [
      {
        title: "Naturligt, inte iscensatt",
        body: "Foton som ser ut som att en begåvad vän fångade dig mitt i ögonblicket. Det är det som skapar förtroende och svar",
      },
      {
        title: "Handplockade referenser",
        body: "Varje stilreferens valdes för att den statistiskt presterar bättre på dejtingappar. Ingen utfyllnad, inga generiska AI-porträtt",
      },
      {
        title: "Din riktiga estetik",
        body: "Ingen vaxig hud, inga smälta händer, inget uncanny valley. Om det inte klarar att se ut som ett riktigt foto når det aldrig ditt galleri",
      },
    ],
  },

  profileBadge: {
    line1: "Dejtingprofilens",
    line2: "bildgenerator #1",
  },

  photoshoot: {
    kicker: "Räkna på det",
    title: "Oändligt överlägsen ett {photographerPrice}-fotoshoot",
    body: "En fotograf ger dig en eftermiddag, en outfit och foton som skriker \u201cJag anlitade en fotograf för min dejtingprofil.\u201d Vi ger dig en hel katalog av naturliga looks, där du lever ditt bästa liv, till en bråkdel av priset",
    themLabel: "Traditionellt fotoshoot",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ för en enda session",
        us: "En betalning på {price}, det är allt",
      },
      {
        them: "10-20 användbara foton om du har tur",
        us: "{photoCount} foton i beprövade stilar",
      },
      {
        them: "En outfit, en plats, en vibe",
        us: "Dussintals outfits, scener och stämningar",
      },
      {
        them: "Synligt poserade och iscensatta",
        us: "Naturliga, native till flödets estetik",
      },
      {
        them: "Veckor av schemaläggning och väntan",
        us: "Klart på timmar, från din soffa",
      },
      {
        them: "Omfotografering? Betala igen.",
        us: "100 AI-redigeringar ingår",
      },
    ],
    punchline:
      "Kärleken står på spel. Lämna inte den till någon som redan fått betalt",
  },

  match: {
    kicker: "Var det här slutar",
    title: "Högkvalitativa samtal börjar med bättre bilder",
    body: "Fler matchningar är bara början. När dina foton äntligen visar hur intressant och självsäker du ser ut avbokas dejter inte längre, samtal öppnar starkare, och \u201cdu ser ut precis som på bilderna\u201d blir en komplimang, inte en lättnad",
    imageAlt: "Tinder-matchskärmar som visar It's a Match",
  },

  manifesto: {
    text: "Bättre foton betyder bättre matchningar. Så enkelt är det. Råd nummer ett från varje dejtingguru är att skaffa bättre dejtingheadshots. Människor är visuella varelser trots allt. Vi använder banbrytande AI för att göra processen superprisvärd och lika enkel som 1 2 3",
    attribution: "Varför vi byggde {appName}",
  },

  steps: {
    kicker: "Lika enkelt som 1 2 3",
    title: "Din glow up, på autopilot",
    items: [
      {
        title: "Ladda upp dina selfies",
        body: "10+ vardagsfoton. Vår AI lär sig ditt ansikte från alla vinklar",
      },
      {
        title: "AI bygger din karaktär",
        body: "En privat modell av dig, tränad en gång, återanvändbar i varje stil",
      },
      {
        title: "Ladda ner {photoCount} foton",
        body: "Handplockade stilar, utan vattenstämpel, storleksanpassade för varje dejtingapp",
      },
    ],
  },

  pricing: {
    kicker: "En betalning. Ingen prenumeration",
    title: "Billigare än en dålig första dejt",
    body: "Du kommer att spendera mer på dejter med lågkvalitativa matchningar. Fixa fotona en gång så förändras din dejtingapp-upplevelse för alltid",
    planName: "Profilbilder",
    features: [
      "{photoCount} AI-genererade dejtingfoton",
      "100 AI-redigeringar - byta outfit, justera miljö eller ett bättre leende",
      "Över 200+ handplockade, högpresterande stilar och scener",
      "Optimerade för folk du vill attrahera",
      "Nedladdningar utan vattenstämpel, redo för appen",
      "Privat: dina foton delas aldrig",
      "Prioriterad bearbetning",
    ],
    cta: "Skaffa mina foton",
    guarantee: "Dina träningsfoton förblir privata och lagras säkert",
    payoff:
      "Om ett foto ger dig en extra fantastisk dejt har det redan betalat sig",
  },

  faq: {
    title: "Frågor, besvarade",
    items: [
      {
        q: "Kommer fotona faktiskt att se ut som mig?",
        a: "Ja. AI:n tränas på ditt riktiga ansikte från selfies du laddar upp och matchar din verkliga livsstil. Inget uncanny valley, ingen plastig hud. Om ett foto inte klarar att se riktigt ut, generera om det eller fixa det med en inkluderad AI-redigering",
      },
      {
        q: "Hur är detta bättre än ett professionellt fotoshoot?",
        a: "Ett {photographerPrice}-fotoshoot ger dig en outfit, en plats och synligt poserade foton. Du får en hel katalog av naturliga looks, där du lever ditt bästa liv, över dussintals scener, plus AI-redigeringar, till en bråkdel av priset, utan att lämna hemmet",
      },
      {
        q: "Vad menar ni med optimerat för kvinnlig / manlig blick?",
        a: "Våra stilreferenser handplockades baserat på vad folk du vill attrahera faktiskt reagerar på - naturlig inramning, naturliga miljöer, varmt ljus - inte vad som imponerar på dig. Därför presterar de 10 gånger bättre",
      },
      {
        q: "Hur snabbt får jag mina foton?",
        a: "Att träna din privata AI-karaktär tar cirka 20-45 minuter. Därefter genereras varje foto på minuter. De flesta användare har en helt ny profil samma dag",
      },
      {
        q: "Kan jag redigera tatueringar, outfits eller bakgrunder?",
        a: "Ja, varje plan inkluderar AI-redigeringar. Lägg till eller ta bort tatueringar, byt kläder, ta bort objekt eller städa bakgrunder genom att skriva en mening",
      },
      {
        q: "Är mina data privata?",
        a: "Dina uppladdningar och genererade foton är privata för ditt konto. Vi publicerar, delar eller tränar aldrig publika modeller på ditt ansikte, och du kan begära radering när som helst",
      },
      {
        q: "Hur länge sparas mina bilder och hur länge gäller krediter?",
        a: "Genererade bilder finns i galleriet i 1–2 månader. Krediter gäller ett helt år från köp, så du har gott om tid att generera, redigera och ladda ner",
      },
    ],
  },

  finalCta: {
    title: "Var profilen som stoppar scrollen",
    body: "80 % ignoreras. De 20 % fick bättre foton. Vilket vill du vara i kväll?",
    cta: "Kom igång",
  },

  footer: {
    tagline: "AI-dejtingfoton konstruerade för att du ska synas",
    support: "Frågor?",
    rights: "Alla rättigheter förbehållna",
  },
  feedbackPrompt: {
    question: "Saknar du information för att använda vår tjänst?",
    placeholder: "Berätta vad som saknas eller är otydligt...",
    submit: "Skicka",
    closeLabel: "Stäng",
    thanks: "Tack för din feedback!",
  },
} satisfies Dictionary;
