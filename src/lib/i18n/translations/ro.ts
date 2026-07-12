import type { Dictionary } from "./en";

export const ro = {
  nav: {
    results: "Rezultate",
    pricing: "Prețuri",
    faq: "Întrebări",
    signIn: "Autentificare",
    getStarted: "Începe acum",
  },

  stickyCta: {
    label: "Începe acum",
    sub: "Plată unică · {photoCount} fotografii",
  },

  hero: {
    badge: "80% din profilurile de dating sunt ignorate. Fii în cei 20%",
    titleLine1: "Fotografii de dating create",
    titleAccent: "pentru ochii ei",
    titleAccentAlt: "pentru ochii lui",
    titleLine2: "nu pentru ego-ul tău",
    subtitle:
      "Inteligența noastră artificială proprietară studiază ce oprește cu adevărat swipe-ul, apoi îți reconstruiește profilul cu fotografii naturale, de nivel revistă, care se potrivesc esteticii tale reale. Zero aspect plastic de AI. Zero artefacte vizibile",
    cta: "Transformă-mi profilul",
    ctaSecondary: "Vezi rezultate reale",
    ratingLabel: "evaluat de single-uri care nu mai sunt ignorate",
  },

  trustBar: {
    label: "De încredere pentru single-uri care câștigă pe",
  },

  proof: {
    kicker: "Matematica e crudă",
    title: "Ai un singur swipe ca să o faci să se oprească",
    titleAlt: "Ai un singur swipe ca să-l faci să se oprească",
    body: "80% din profilurile de dating sunt ignorate, nu din cauza persoanei, ci din cauza fotografiilor. Sfatul nr. 1 al oricărui coach de dating e același: repară-ți mai întâi fotografiile. Am antrenat sistemul nostru proprietar de AI să fie evaluat ca atrăgător, păstrând în același timp aspectul natural",
    stats: [
      {
        value: "75%",
        label: "din profiluri sunt sărite în mai puțin de o secundă",
      },
      {
        value: "10x",
        label: "calitate îmbunătățită a potrivirilor",
      },
      {
        value: "100+",
        label: "minute economisite săptămânal de cei care dispar și de anulări",
      },
    ],
  },

  beforeAfter: {
    kicker: "Estetică reală. Zero artefacte",
    title: "Aceeași față. Impresie complet diferită",
    body: "Fiecare referință din catalogul nostru a fost aleasă manual pentru că performează de 10 ori mai bine pe aplicațiile de dating. AI-ul nostru proprietar le mapează pe estetica ta reală, astfel încât fotografiile arată ca tine în cea mai bună zi, nu ca un render al tău",
    toggleForHim: "Pentru el",
    toggleForHer: "Pentru ea",
    toggleHint: "Fotografii optimizate pentru cine vrei să atragi",
    beforeLabel: "Înainte",
    afterLabel: "După",
    meterLabel: "Atractivitate la swipe",
    meterBeforeCaption: "Este sărit",
    meterAfterCaption:
      "Primește mesaj primul, date mai bune, mai multe potriviri",
    disclaimer: "Transformări de la clienți cu care am lucrat",
    examples: {
      him: [
        { beforeCaption: "Să fii ignorat te epuizează mental" },
        {
          beforeCaption: "Conversații, dar multe anulări",
          afterCaption: "Alege pe cine lasă fără răspuns",
        },
      ],
      her: [
        {
          beforeCaption: "Date cu efort minim",
          afterCaption: "Își găsește bărbatul visurilor",
        },
        {
          beforeCaption: "Primește doar date fără angajament",
          afterCaption: "Își găsește sufletul pereche",
        },
      ],
    },
  },

  gaze: {
    kicker: "Avantajul nedrept",
    titleHim: "Creat pentru privirea feminină",
    titleHer: "Creat pentru privirea masculină",
    body: "Bărbații fac poze pe care alți bărbați le consideră cool. Femeile aleg poze care le plac prietenelor. Ambele sunt greșite. Am inginerizat invers ce răspund de fapt oamenii pe care vrei să-i atragi - cadre naturale, lumină naturală, medii reale - și am antrenat sistemul nostru pe asta",
    toggleForHim: "Bărbați",
    toggleForHer: "Femei",
    points: [
      {
        title: "Natural, nu pus în scenă",
        body: "Fotografii care par că un prieten talentat te-a prins în moment. Asta câștigă încredere și răspunsuri",
      },
      {
        title: "Referințe alese manual",
        body: "Fiecare referință de stil a fost selectată pentru că performează statistic mai bine pe aplicațiile de dating. Fără umplutură, fără portrete AI generice",
      },
      {
        title: "Estetica ta reală",
        body: "Fără piele cerată, fără mâini deformate, fără uncanny valley. Dacă nu trece drept fotografie reală, nu ajunge niciodată în galeria ta",
      },
    ],
  },

  profileBadge: {
    line1: "Profil dating nr. 1",
    line2: "generator de fotografii",
  },

  photoshoot: {
    kicker: "Fă calculul",
    title: "Infinit superior unei ședințe foto de {photographerPrice}",
    body: "Un fotograf îți oferă o după-amiază, o ținută și fotografii care urlă „am angajat un fotograf pentru profilul meu de dating”. Noi îți oferim un catalog întreg de look-uri naturale, trăind viața ta la maximum, la o fracțiune din preț",
    themLabel: "Ședință foto tradițională",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ pentru o singură sesiune",
        us: "O plată de {price}, atât",
      },
      {
        them: "10-20 fotografii folosibile dacă ai noroc",
        us: "{photoCount} fotografii în stiluri dovedite",
      },
      {
        them: "O ținută, o locație, o atmosferă",
        us: "Zeci de ținute, scene și stări",
      },
      {
        them: "Vizibil pozate și regizate",
        us: "Naturale, native esteticii feed-ului",
      },
      {
        them: "Săptămâni de programare și așteptare",
        us: "Gata în câteva ore, de pe canapea",
      },
      { them: "Refacere? Plătești din nou.", us: "100 editări AI incluse" },
    ],
    punchline: "Dragostea e în joc. Nu o lăsa pe seama cuiva deja plătit",
  },

  match: {
    kicker: "Unde ajunge asta",
    title: "Conversații de calitate superioară încep cu fotografii mai bune",
    body: "Mai multe potriviri sunt doar începutul. Când fotografiile tale arată în sfârșit cât de interesant și încrezător arăți, datele nu mai sunt anulate, conversațiile pornesc mai puternic, iar „arăți exact ca în poze” devine un compliment, nu o ușurare",
    imageAlt: "Ecrane de match Tinder cu It's a Match",
  },

  manifesto: {
    text: "Fotografii mai bune înseamnă potriviri mai bune. Atât de simplu. Sfatul nr. 1 pe care ți-l dă orice guru de dating este să obții portrete mai bune pentru dating. Oamenii sunt ființe vizuale, la urma urmei. Folosim AI de ultimă generație ca să facem acest proces super accesibil și la fel de simplu ca 1 2 3",
    attribution: "De ce am construit {appName}",
  },

  steps: {
    kicker: "La fel de simplu ca 1 2 3",
    title: "Transformarea ta, pe pilot automat",
    items: [
      {
        title: "Încarcă selfie-urile tale",
        body: "10+ fotografii de zi cu zi. AI-ul nostru învață fața ta din fiecare unghi",
      },
      {
        title: "AI-ul îți construiește personajul",
        body: "Un model privat al tău, antrenat o dată, reutilizabil în fiecare stil",
      },
      {
        title: "Descarcă {photoCount} fotografii",
        body: "Stiluri alese manual, fără watermark, dimensionate pentru fiecare aplicație de dating",
      },
    ],
  },

  pricing: {
    kicker: "O plată. Fără abonament",
    title: "Mai ieftin decât un prim date prost",
    body: "Vei cheltui mai mult pe date cu potriviri de calitate slabă. Repară fotografiile o dată și experiența ta pe aplicațiile de dating se va schimba pentru totdeauna",
    planName: "Fotografii de profil",
    features: [
      "{photoCount} fotografii de dating generate cu AI",
      "100 editări AI: schimbare ținută, ajustare decor sau zâmbet mai bun",
      "Peste 200+ stiluri și scene alese manual, cu performanță ridicată",
      "Optimizat pentru oamenii pe care vrei să-i atragi",
      "Descărcări fără watermark, gata pentru aplicații",
      "Privat: fotografiile tale nu sunt niciodată partajate",
      "Procesare prioritară",
    ],
    cta: "Ia-mi fotografiile",
    guarantee:
      "Fotografiile tale de antrenament rămân private și stocate în siguranță",
    payoff:
      "Dacă o fotografie îți aduce un date excelent în plus, s-a amortizat deja",
  },

  faq: {
    title: "Întrebări, răspunsuri",
    items: [
      {
        q: "Fotografiile vor arăta cu adevărat ca mine?",
        a: "Da. AI-ul se antrenează pe fața ta reală din selfie-urile încărcate și se potrivește esteticii tale reale. Fără uncanny valley, fără piele plastică. Dacă o fotografie nu pare reală, regenereaz-o sau corecteaz-o cu o editare AI inclusă",
      },
      {
        q: "Cum e mai bun decât o ședință foto profesională?",
        a: "O ședință foto de {photographerPrice} îți cumpără o ținută, o locație și fotografii vizibil pozate. Tu primești un catalog întreg de look-uri naturale, trăind viața ta la maximum, în zeci de scene, plus editări AI, la o fracțiune din preț, fără să pleci de acasă",
      },
      {
        q: "Ce înseamnă optimizat pentru privirea feminină / masculină?",
        a: "Referințele noastre de stil au fost alese manual pe baza a ce răspund de fapt oamenii pe care vrei să-i atragi - cadre naturale, setări naturale, lumină caldă - nu ce te impresionează pe tine. De aceea performează de 10 ori mai bine",
      },
      {
        q: "Cât de repede primesc fotografiile?",
        a: "Antrenarea personajului tău privat de AI durează aproximativ 20-45 de minute. După aceea, fiecare fotografie se generează în câteva minute. Majoritatea utilizatorilor au un profil nou complet în aceeași zi",
      },
      {
        q: "Pot edita tatuaje, ținute sau fundaluri?",
        a: "Da, fiecare plan include editări AI. Adaugă sau elimină tatuaje, schimbă haine, elimină obiecte sau curăță fundalurile tastând o propoziție",
      },
      {
        q: "Datele mele sunt private?",
        a: "Încărcările și fotografiile generate sunt private în contul tău. Nu postăm, nu partajăm și nu antrenăm modele publice pe fața ta, iar poți solicita ștergerea oricând",
      },
      {
        q: "Cât timp sunt stocate fotografiile și cât durează creditele?",
        a: "Fotografiile generate rămân în galerie 1–2 luni. Creditele sunt valabile un an întreg de la cumpărare, pentru generare, editare și descărcare",
      },
    ],
  },

  finalCta: {
    title: "Fii profilul care oprește scroll-ul",
    body: "80% sunt ignorați. Cei 20% au primit fotografii mai bune. Care vrei să fii în seara asta?",
    cta: "Începe acum",
  },

  footer: {
    tagline: "Fotografii de dating cu AI create să fii remarcat",
    support: "Întrebări?",
    rights: "Toate drepturile rezervate",
  },
} satisfies Dictionary;
