import type { Dictionary } from "./en";

export const hu = {
  nav: {
    results: "Eredmények",
    pricing: "Árak",
    faq: "GYIK",
    signIn: "Bejelentkezés",
    getStarted: "Kezdd el",
  },

  stickyCta: {
    label: "Kezdd el",
    sub: "Egyszeri fizetés · {photoCount} fotó",
  },

  hero: {
    badge:
      "A társkereső profilok 80%-át figyelmen kívül hagyják. Legyél a 20%-ban",
    titleLine1: "Társkereső fotók, amelyeket",
    titleAccent: "az ő szemének",
    titleAccentAlt: "az ő szemének",
    titleLine2: "terveztek, nem az egódra",
    subtitle:
      "Saját fejlesztésű mesterséges intelligenciánk azt tanulmányozza, mi állítja meg valójában a swipe-ot, majd újraépíti a profilodat természetes, magazinszintű fotókkal, amelyek illenek a valódi életstílusodhoz. Nulla művi AI-kinézet. Nulla észrevehető hiba",
    cta: "Profilom átalakítása",
    ctaSecondary: "Valódi eredmények megtekintése",
    ratingLabel:
      "értékelve azoktól a single-öktől, akiket már nem hagy figyelmen kívül senki",
  },

  trustBar: {
    label: "Olyan single-ök bíznak benne, akik ezeken nyernek",
  },

  proof: {
    kicker: "A matek kegyetlen",
    title: "Egy swipe-od van, hogy megállítsd őt",
    titleAlt: "Egy swipe-od van, hogy megállítsd őt",
    body: "A társkereső profilok 80%-át figyelmen kívül hagyják - nem az ember miatt, hanem a fotók miatt. Minden társkereső coach első tanácsa ugyanaz: először a fotókat javítsd. Saját AI-rendszerünket úgy tanítottuk, hogy vonzónak értékeljék, miközben megőrzi a természetes kinézetet",
    stats: [
      {
        value: "75%",
        label: "a profilokat egy másodperc alatt átlapozzák",
      },
      {
        value: "10x",
        label: "jobb match-minőség",
      },
      {
        value: "100+",
        label: "perc spórolva hetente figyelmen kívül hagyás és lemondás miatt",
      },
    ],
  },

  beforeAfter: {
    kicker: "Valódi esztétika. Nulla hiba",
    title: "Ugyanaz az arc. Teljesen más első benyomás",
    body: "Katalógusunk minden referenciáját kézzel választottuk ki, mert 10-szer jobban teljesít a társkereső appokon. Saját AI-nk a valódi életstílusodra illeszti őket, így a fotók úgy néznek ki, mintha a legjobb napodon lennél - nem mintha egy render lennél",
    toggleForHim: "Férfiaknak",
    toggleForHer: "Nőknek",
    toggleHint: "Fotók optimalizálva arra, akit vonzani szeretnél",
    beforeLabel: "Előtte",
    afterLabel: "Utána",
    meterLabel: "Swipe-vonzereje",
    meterBeforeCaption: "Átlapozzák",
    meterAfterCaption: "Először neki írnak, jobb randik, több match",
    disclaimer: "Ügyfeleink átalakulásai, akikkel dolgoztunk",
    examples: {
      him: [
        { beforeCaption: "Lelkileg kimerítő figyelmen kívül hagyás" },
        {
          beforeCaption: "Beszélgetések, de sok lemondás",
          afterCaption: "Ő választja ki, kit hagy readen",
        },
      ],
      her: [
        {
          beforeCaption: "Alacsony erőfeszítésű randik",
          afterCaption: "Megkapja álmai férfiját",
        },
        {
          beforeCaption: "Csak elkötelezettség nélküli randikat kap",
          afterCaption: "Megtalálja lelkitársát",
        },
      ],
    },
  },

  gaze: {
    kicker: "A tisztességtelen előny",
    titleHim: "A női tekintetre építve",
    titleHer: "A férfi tekintetre építve",
    body: "A férfiak olyan fotókat készítenek, amelyek más férfiaknak tűnnek menőnek. A nők olyan fotókat választanak, amelyeket a barátnőik szeretnek. Mindkettő rossz. Visszafejtettük, mire reagálnak valójában azok, akiket vonzani szeretnél - természetes képalkotás, természetes fény, valódi környezetek - és erre tanítottuk a rendszerünket",
    toggleForHim: "Férfiak",
    toggleForHer: "Nők",
    points: [
      {
        title: "Természetes, nem beállított",
        body: "Olyan fotók, mintha egy tehetséges barátod kapta volna el a pillanatot. Ez épít bizalmat és válaszokat",
      },
      {
        title: "Kézzel válogatott referenciák",
        body: "Minden stílusreferenciánkat azért választottuk, mert statisztikailag jobban teljesít a társkereső appokon. Nincs töltelék, nincs generikus AI-portré",
      },
      {
        title: "A te valódi esztétikád",
        body: "Nincs viaszos bőr, nincs elolvadt kéz, nincs uncanny valley. Ha nem tűnik valódi fotónak, soha nem kerül a galériádba",
      },
    ],
  },

  profileBadge: {
    line1: "#1 társkereső profil",
    line2: "fotógenerátor",
  },

  photoshoot: {
    kicker: "Számold ki",
    title: "Végtelenül jobb, mint egy {photographerPrice} fotózás",
    body: "Egy fotós egy délutánt, egy öltözéket és olyan fotókat ad, amelyek azt kiabálják: „Fotóst béreltem a társkereső profilomhoz.” Mi egy egész katalógust adunk természetes lookokból - a legjobb életedről - töredékáron",
    themLabel: "Hagyományos fotózás",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ egyetlen alkalomért",
        us: "Egy fizetés: {price}, ennyi",
      },
      {
        them: "10-20 használható fotó, ha szerencséd van",
        us: "{photoCount} fotó bevált stílusokban",
      },
      {
        them: "Egy öltözék, egy helyszín, egy hangulat",
        us: "Tucatnyi öltözék, jelenet és hangulat",
      },
      {
        them: "Láthatóan pózolt és beállított",
        us: "Természetes, a feed esztétikájához illő",
      },
      {
        them: "Hetek tervezése és várakozás",
        us: "Órák alatt kész, a kanapédról",
      },
      { them: "Újrafotózás? Fizess újra.", us: "100 AI-szerkesztés benne van" },
    ],
    punchline: "A szerelem a tét. Ne bízd olyanra, akit már kifizettek",
  },

  match: {
    kicker: "Ahová ez vezet",
    title: "Jobb minőségű beszélgetések a swipe-tól kezdődnek",
    body: "A több match csak a kezdet. Amikor a fotóid végre megmutatják, mennyire érdekes és magabiztos vagy, a randik nem mondanak le, a beszélgetések erősebben indulnak, és a „pontosan úgy nézel ki, mint a képeiden” mondat bók lesz, nem megkönnyebbülés",
    imageAlt: "Tinder match képernyők It's a Match felirattal",
  },

  manifesto: {
    text: "Jobb fotók jobb matcheket jelentenek. Ennyire egyszerű. Minden társkereső guru első tanácsa: szerezz jobb társkereső portrékat. Az emberek végül is vizuális lények. Cutting edge AI-t használunk, hogy ezt a folyamatot szuper megfizethetővé és olyan egyszerűvé tegyük, mint az 1 2 3",
    attribution: "Miért építettük a {appName}-t",
  },

  steps: {
    kicker: "Olyan egyszerű, mint az 1 2 3",
    title: "A glow-upod, autopilótán",
    items: [
      {
        title: "Töltsd fel a szelfijeidet",
        body: "10+ hétköznapi fotó. AI-nk minden szögből megtanulja az arcodat",
      },
      {
        title: "Az AI felépíti a karakteredet",
        body: "Egy privát modell rólad, egyszer betanítva, minden stílusban újrahasználható",
      },
      {
        title: "Töltsd le a {photoCount} fotót",
        body: "Kézzel válogatott stílusok, vízjel nélkül, minden társkereső apphoz méretezve",
      },
    ],
  },

  pricing: {
    kicker: "Egy fizetés. Nincs előfizetés",
    title: "Olcsóbb, mint egy rossz első randi",
    body: "Többet költesz majd gyenge minőségű matchekkel való randikra. Javítsd ki a fotókat egyszer, és a társkereső élményed örökre megváltozik",
    planName: "Profilképek",
    features: [
      "{photoCount} AI-generált társkereső fotó",
      "100 AI-szerkesztés: öltözékváltás, háttér módosítás vagy jobb mosoly",
      "Több mint 200+ kézzel válogatott, jól teljesítő stílus és jelenet",
      "Optimalizálva azokra, akiket vonzani szeretnél",
      "Vízjel nélkül, appra kész letöltések",
      "Privát: a fotóidat soha nem osztjuk meg",
      "Prioritásos feldolgozás",
    ],
    cta: "Fotóim megrendelése",
    guarantee: "A betanítási fotóid privátak és biztonságosan tárolva maradnak",
    payoff: "Ha egy fotó egy extra remek randit hoz, már megtérült",
  },

  faq: {
    title: "Kérdések, megválaszolva",
    items: [
      {
        q: "A fotók tényleg úgy fognak kinézni, mint én?",
        a: "Igen. Az AI a feltöltött szelfikről tanulja a valódi arcodat, és illik a valódi életstílusodhoz. Nincs uncanny valley, nincs művi bőr. Ha egy fotó nem tűnik valódinak, generáld újra vagy javítsd egy benne foglalt AI-szerkesztéssel",
      },
      {
        q: "Hogyan jobb ez egy profi fotózásnál?",
        a: "Egy {photographerPrice} fotózás egy öltözéket, egy helyszínt és láthatóan pózolt fotókat ad. Te egy egész katalógust kapsz természetes lookokból - a legjobb életedről - tucatnyi jelenetben, plusz AI-szerkesztésekkel, töredékáron, otthonról",
      },
      {
        q: "Mit jelent a női / férfi tekintetre optimalizálva?",
        a: "Stílusreferenciáinkat kézzel választottuk ki aszerint, mire reagálnak valójában azok, akiket vonzani szeretnél - természetes képalkotás, természetes környezetek, meleg fény - nem az, ami téged lenyűgöz. Ezért teljesítenek 10-szer jobban",
      },
      {
        q: "Milyen gyorsan kapom meg a fotóimat?",
        a: "A privát AI-karaktered betanítása kb. 20-45 percet vesz igénybe. Utána minden fotó percek alatt készül. A legtöbb felhasználónak ugyanazon a napon megvan az új profilja",
      },
      {
        q: "Szerkeszthetem a tetoválásokat, öltözékeket vagy háttereket?",
        a: "Igen, minden csomag AI-szerkesztéseket tartalmaz. Tetoválások hozzáadása vagy eltávolítása, ruhacsere, tárgyak törlése vagy hátterek tisztítása egy mondattal",
      },
      {
        q: "Privátak az adataim?",
        a: "A feltöltéseid és generált fotóid privátak a fiókodban. Soha nem posztoljuk, osztjuk meg vagy tanítunk nyilvános modelleket az arcoddal, és bármikor kérheted a törlést",
      },
      {
        q: "Meddig tárolódnak a képeim és meddig érvényesek a kreditek?",
        a: "A generált fotók 1–2 hónapig érhetők el a galériában. A kreditek a vásárlástól számított egy teljes évig érvényesek",
      },
    ],
  },

  finalCta: {
    title: "Légy az a profil, amely megállítja a görgetést",
    body: "80%-ot figyelmen kívül hagynak. A 20% jobb fotókat kapott. Melyik szeretnél lenni ma este?",
    cta: "Kezdd el",
  },

  footer: {
    tagline: "AI társkereső fotók, amelyeket észrevesznek",
    support: "Kérdések?",
    rights: "Minden jog fenntartva",
  },
} satisfies Dictionary;
