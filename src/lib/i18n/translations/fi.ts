import type { Dictionary } from "./en";

export const fi = {
  nav: {
    results: "Tulokset",
    pricing: "Hinnat",
    faq: "UKK",
    signIn: "Kirjaudu sisään",
    getStarted: "Aloita",
  },

  stickyCta: {
    label: "Aloita",
    sub: "Kertamaksu · {photoCount} kuvaa",
  },

  hero: {
    badge: "80 % deittiprofiileista jätetään huomiotta. Ole se 20 %",
    titleLine1: "Deittikuvat suunniteltu",
    titleAccent: "naisen silmiin",
    titleAccentAlt: "miehen silmiin",
    titleLine2: "ei egollesi",
    subtitle:
      "Oma tekoälymme analysoi, mikä todella pysäyttää pyyhkäisyn, ja rakentaa profiilisi uudelleen luonnollisilla, lehtitasoisilla kuvilla, jotka sopivat todelliseen tyyliisi. Ei muovista tekoälylookia. Ei näkyviä artefakteja",
    cta: "Muuta profiilini",
    ctaSecondary: "Katso oikeita tuloksia",
    ratingLabel:
      "arvosteltu sinkkujen toimesta, jotka eivät enää jää huomiotta",
  },

  trustBar: {
    label: "Sinkut luottavat meihin näillä sovelluksilla",
  },

  proof: {
    kicker: "Matematiikka on armoton",
    title: "Sinulla on yksi pyyhkäisy saadaksesi hänet pysähtymään",
    titleAlt: "Sinulla on yksi pyyhkäisy saadaksesi hänet pysähtymään",
    body: "80 % deittiprofiileista jätetään huomiotta - ei henkilön takia, vaan kuvien. Jokaisen deittivalmentajan ykkösvinkki on sama: korjaa kuvasi ensin. Olemme kouluttaneet oman tekoälyjärjestelmämme arvioiduksi houkuttelevaksi säilyttäen luonnollisen ilmeen",
    stats: [
      {
        value: "75%",
        label: "profiileista ohitetaan alle sekunnissa",
      },
      {
        value: "10x",
        label: "parempi matchien laatu",
      },
      {
        value: "100+",
        label: "minuuttia säästetty viikossa hylkäämisen ja peruutusten takia",
      },
    ],
  },

  beforeAfter: {
    kicker: "Aito estetiikka. Nolla artefakteja",
    title: "Sama kasvot. Täysin erilainen ensivaikutelma",
    body: "Jokainen katalogimme referenssi on valittu käsin, koska se toimii deittisovelluksissa 10 kertaa paremmin. Oma tekoälymme kartoittaa ne todelliseen tyyliisi, joten kuvat näyttävät sinulta parhaimmillasi - eivät renderöinniltä sinusta",
    toggleForHim: "Miehelle",
    toggleForHer: "Naiselle",
    toggleHint: "Kuvat optimoitu sille, ketä haluat houkutella",
    beforeLabel: "Ennen",
    afterLabel: "Jälkeen",
    meterLabel: "Pyyhkäisyvetovoima",
    meterBeforeCaption: "Ohitetaan",
    meterAfterCaption:
      "Saadaan viestejä ensin, parempia treffeja ja enemmän matcheja",
    disclaimer: "Muutoksia asiakkailta, joiden kanssa olemme työskennelleet",
    examples: {
      him: [
        { beforeCaption: "Hylätyksi tuleminen uuvuttaa henkisesti" },
        {
          beforeCaption: "Keskusteluja, mutta paljon peruutuksia",
          afterCaption: "Valitsee itse, ketä peruuttaa",
        },
      ],
      her: [
        {
          beforeCaption: "Vähän vaivannäköä vaativat treffit",
          afterCaption: "Löytää unelmiensa miehen",
        },
        {
          beforeCaption: "Vain sitoutumattomia treffejä",
          afterCaption: "Löytää sielunkumppaninsa",
        },
      ],
    },
  },

  gaze: {
    kicker: "Epäreilu etu",
    titleHim: "Rakennettu naisen katseelle",
    titleHer: "Rakennettu miehen katseelle",
    body: "Miehet ottavat kuvia, joita muut miehet pitävät siisteinä. Naiset valitsevat kuvia, joista ystävät pitävät. Molemmat ovat väärin. Olemme purkaneet, mihin houkuteltavat ihmiset oikeasti reagoivat - luonnollinen kehystys, luonnonvalo, aidot ympäristöt - ja kouluttaneet järjestelmämme sen mukaan",
    toggleForHim: "Miehet",
    toggleForHer: "Naiset",
    points: [
      {
        title: "Luonnollinen, ei lavastettu",
        body: "Kuvat, jotka näyttävät siltä kuin lahjakas ystävä olisi napannut sinut hetken keskeltä. Se luo luottamusta ja vastauksia",
      },
      {
        title: "Käsin valitut referenssit",
        body: "Jokainen tyylireferenssimme on valittu, koska se toimii tilastollisesti paremmin deittisovelluksissa. Ei täytettä, ei geneerisiä tekoälymuotokuvia",
      },
      {
        title: "Todellinen tyylisi",
        body: "Ei vahamaista ihoa, ei sulaneita käsiä, ei uncanny valley -tunnetta. Jos se ei näytä aidolta kuvilta, se ei koskaan päädy galleriaasi",
      },
    ],
  },

  profileBadge: {
    line1: "#1 deittiprofiilin",
    line2: "kuvageneraattori",
  },

  photoshoot: {
    kicker: "Laske itse",
    title: "Loputtomasti parempi kuin {photographerPrice} valokuvaus",
    body: "Valokuvaaja antaa sinulle yhden iltapäivän, yhden asun ja kuvat, jotka huutavat: „Palkkasin valokuvaajan deittiprofiiliini.“ Me annamme koko katalogin luonnollisia lookkeja - parasta elämääsi - murto-osalla hinnasta",
    themLabel: "Perinteinen valokuvaus",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ yhdestä sessiosta",
        us: "Yksi maksu {price}, siinä se",
      },
      {
        them: "10-20 käyttökelpoista kuvaa jos onni potkaisee",
        us: "{photoCount} kuvaa todistetuissa tyyleissä",
      },
      {
        them: "Yksi asu, yksi paikka, yksi fiilis",
        us: "Kymmeniä asuja, kohtauksia ja tunnelmia",
      },
      {
        them: "Näkyvästi poseerattu ja lavastettu",
        us: "Luonnollinen, feed-estetiikkaan sopiva",
      },
      {
        them: "Viikkoja aikataulutusta ja odottelua",
        us: "Valmis tunneissa, sohvaltasi",
      },
      {
        them: "Uusi kuvaus? Maksa uudelleen.",
        us: "100 tekoälymuokkausta mukana",
      },
    ],
    punchline:
      "Rakkaus on pelissä. Älä jätä sitä jo maksetun valokuvaajan varaan",
  },

  match: {
    kicker: "Mihin tämä johtaa",
    title: "Laadukkaammat keskustelut alkavat paremmista kuvista",
    body: "Enemmän matcheja on vasta alku. Kun kuvasi vihdoin näyttävät, kuinka mielenkiintoinen ja itsevarma näytät, treffit eivät enää peruunnu, keskustelut alkavat vahvemmin, ja „näytät juuri kuviesi kaltaiselta“ on kohteliaisuus, ei helpotus",
    imageAlt: "Tinder-match-näytöt, joissa lukee It's a Match",
  },

  manifesto: {
    text: "Paremmat kuvat tarkoittavat parempia matcheja. Näin yksinkertaista se on. Jokaisen deittigurun ykkösvinkki on hankkia paremmat deittikuvat. Ihmiset ovat visuaalisia olentoja. Käytämme huipputeknologiaa tehdäksemme prosessista superedullisen ja yhtä helppoa kuin 1 2 3",
    attribution: "Miksi rakensimme {appName}",
  },

  steps: {
    kicker: "Yhtä helppoa kuin 1 2 3",
    title: "Glow-upisi autopilotilla",
    items: [
      {
        title: "Lataa selfiet",
        body: "10+ arjen kuvaa. Tekoälymme oppii kasvosi jokaisesta kulmasta",
      },
      {
        title: "Tekoäly rakentaa hahmosi",
        body: "Yksityinen mallisi sinusta, koulutettu kerran, uudelleenkäytettävissä jokaisessa tyylissä",
      },
      {
        title: "Lataa {photoCount} kuvaa",
        body: "Käsin valitut tyylit, ilman vesileimaa, valmiina kaikkiin deittisovelluksiin",
      },
    ],
  },

  pricing: {
    kicker: "Yksi maksu. Ei tilausta",
    title: "Halvempi kuin yksi huono ensitreffi",
    body: "Käytät enemmän treffeihin heikkolaatuisiin matcheihin. Korjaa kuvat kerran, ja deittisovelluskokemuksesi muuttuu ikuisesti",
    planName: "Profiilikuvat",
    features: [
      "{photoCount} tekoälyllä luotua deittikuvaa",
      "100 tekoälymuokkausta asun vaihtoon, maiseman säätöön tai parempaan hymyyn",
      "Yli 200+ käsin valittua, tehokasta tyyliä ja kohtausta",
      "Optimoitu houkuteltaville ihmisille",
      "Ilman vesileimaa, valmiit lataukset sovelluksiin",
      "Yksityistä: kuviasi ei jaeta koskaan",
      "Priorisoitu käsittely",
    ],
    cta: "Hanki kuvani",
    guarantee:
      "Koulutuskuvasi pysyvät yksityisinä ja tallennetaan turvallisesti",
    payoff:
      "Jos yksi kuva tuo yhden ylimääräisen loistavan treffin, se on jo maksanut itsensä takaisin",
  },

  faq: {
    title: "Kysymyksiin vastattu",
    items: [
      {
        q: "Näyttävätkö kuvat oikeasti minulta?",
        a: "Kyllä. Tekoäly koulutetaan oikealla kasvoillasi lataamistasi selfieistä ja vastaa todellista tyyliäsi. Ei uncanny valley -tunnetta, ei muovista ihoa. Jos kuva ei näytä aidolta, luo se uudelleen tai korjaa se mukana olevalla tekoälymuokkauksella",
      },
      {
        q: "Miten tämä on parempi kuin ammattivalokuvaus?",
        a: "{photographerPrice} valokuvaus antaa yhden asun, yhden paikan ja näkyvästi poseerattuja kuvia. Saat koko katalogin luonnollisia lookkeja - parasta elämääsi - kymmenissä kohtauksissa, plus tekoälymuokkauksia, murto-osalla hinnasta, poistumatta kotoa",
      },
      {
        q: "Mitä tarkoitatte naisen / miehen katseelle optimoidulla?",
        a: "Tyylireferenssimme on valittu käsin sen perusteella, mihin houkuteltavat ihmiset oikeasti reagoivat - luonnollinen kehystys, luonnolliset ympäristöt, lämmin valo, ei siihen mikä impressaa sinua. Siksi ne toimivat 10 kertaa paremmin",
      },
      {
        q: "Kuinka nopeasti saan kuvani?",
        a: "Yksityisen tekoälyhahmosi koulutus kestää noin 20-45 minuuttia. Sen jälkeen jokainen kuva generoidaan minuuteissa. Useimmat käyttäjät saavat täysin uuden profiilin saman päivän aikana",
      },
      {
        q: "Voinko muokata tatuointeja, asuja tai taustoja?",
        a: "Kyllä, jokainen paketti sisältää tekoälymuokkauksia. Lisää tai poista tatuointeja, vaihda vaatteita, poista esineitä tai siivoa taustoja kirjoittamalla lause",
      },
      {
        q: "Ovatko tietoni yksityisiä?",
        a: "Latauksesi ja generoidut kuvasi ovat yksityisiä tililläsi. Emme koskaan julkaise, jaa tai kouluta julkisia malleja kasvoillasi, ja voit pyytää poistoa milloin tahansa",
      },
      {
        q: "Kuinka kauan kuviani säilytetään ja kuinka kauan krediitit ovat voimassa?",
        a: "Luodut kuvat ovat galleriassa 1–2 kuukautta. Krediitit ovat voimassa täyden vuoden oston jälkeen, joten sinulla on aikaa luoda, muokata ja ladata",
      },
    ],
  },

  finalCta: {
    title: "Ole profiili, joka pysäyttää scrollauksen",
    body: "80 % jää huomiotta. 20 % sai paremmat kuvat. Kumpi haluat olla tänä iltana?",
    cta: "Aloita",
  },

  footer: {
    tagline: "Tekoälydeittikuvat suunniteltu huomion herättämiseen",
    support: "Kysymyksiä?",
    rights: "Kaikki oikeudet pidätetään",
  },
} satisfies Dictionary;
