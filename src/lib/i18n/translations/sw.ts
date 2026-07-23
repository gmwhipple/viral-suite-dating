import type { Dictionary } from "./en";

export const sw = {
  nav: {
    results: "Matokeo",
    pricing: "Bei",
    faq: "FAQ",
    signIn: "Ingia",
    getStarted: "Anza",
  },

  stickyCta: {
    label: "Anza",
    sub: "Malipo ya mara moja · picha {photoCount}",
  },

  hero: {
    badge:
      "Asilimia 80 ya wasifu wa mahusiano hupuuzwa. Kuwa miongoni mwa asilimia 20",
    titleLine1: "Picha za mahusiano zimeundwa",
    titleAccent: "kwa macho ya mwanamke",
    titleAccentAlt: "kwa macho ya mwanaume",
    titleLine2: "si kwa ego lako",
    subtitle:
      "AI yetu ya kipekee inachunguza kinachosimamisha swipe kweli, kisha inajenga upya wasifu wako kwa picha za asili zenye ubora wa magazini zinazolingana na estetiki yako halisi. Hakuna muonekano wa plastiki wa AI. Hakuna dosari zinazoonekana",
    cta: "Badilisha Wasifu Wangu",
    ctaSecondary: "Angalia matokeo halisi",
    ratingLabel: "imekadiriwa na waliobaki bila kupuuzwa",
  },

  trustBar: {
    label: "Inaaminiwa na waliobaki wanaoshinda kwenye",
  },

  proof: {
    kicker: "Hesabu ni kali",
    title: "Una swipe moja kumfanya asonge zaidi",
    titleAlt: "Una swipe moja kumfanya asonge zaidi",
    body: "Asilimia 80 ya wasifu wa mahusiano hupuuzwa, si kwa sababu ya mtu, bali kwa sababu ya picha. Ushauri namba 1 kutoka kwa kocha yeyote wa mahusiano ni sawa: rekebisha picha zako kwanza. Tumefundisha mfumo wetu wa AI wa kipekee kukadiriwa kuwa wa kuvutia huku tukidumisha muonekano wa asili",
    stats: [
      {
        value: "75%",
        label: "ya wasifu hurukwa chini ya sekunde moja",
      },
      {
        value: "10x",
        label: "ubora bora wa mechi",
      },
      {
        value: "100+",
        label:
          "dakika zinazookolewa kila wiki kutokana na kunyamazishwa na kupotea",
      },
    ],
  },

  beforeAfter: {
    kicker: "Estetiki halisi. Sifuri dosari",
    title: "Uso sawa. Hisia tofauti kabisa ya kwanza",
    body: "Kila rejeleo katika katalogi yetu lilichaguliwa kwa mkono kwa sababu linafanya kazi mara 10 bora kwenye programu za mahusiano. AI yetu ya kipekee inaielekeza kwenye estetiki yako halisi, ili picha zionekane kama wewe siku yako bora, si kama render yako",
    toggleForHim: "Kwake",
    toggleForHer: "Kwake",
    toggleHint: "Picha zimeboreshwa kwa mtu unayetaka kuvutia",
    beforeLabel: "Kabla",
    afterLabel: "Baada",
    meterLabel: "Uwezo wa kuvutia swipe",
    meterBeforeCaption: "Hurukwa",
    meterAfterCaption: "Hupata ujumbe kwanza, miadi bora, mechi zaidi",
    disclaimer: "Mabadiliko kutoka kwa wateja ambao tumefanya nao kazi",
    examples: {
      him: [
        { beforeCaption: "Kunyamazishwa kunachosha akili" },
        {
          beforeCaption: "Mazungumzo lakini wengi hupotea",
          afterCaption: "Anachagua nani atamnyamazisha",
        },
      ],
      her: [
        {
          beforeCaption: "Miadi ya juhudi ndogo",
          afterCaption: "Anapata mwanaume wa ndoto yake",
        },
        {
          beforeCaption: "Miadi tu bila kujitolea",
          afterCaption: "Anapata mwenzi wake wa roho",
        },
      ],
    },
  },

  gaze: {
    kicker: "Faida isiyo ya haki",
    titleHim: "Imeundwa kwa mtazamo wa mwanamke",
    titleHer: "Imeundwa kwa mtazamo wa mwanaume",
    body: "Wanaume hupiga picha ambazo wanaume wengine wanadhani ni nzuri. Wanawake huchagua picha ambazo marafiki zao wanapenda. Zote mbili ni makosa. Tulifanya reverse engineering ya kinachowafanya watu unayetaka kuvutia kujibu, fremu za asili, mwanga wa asili, mazingira halisi, na kufundisha mfumo wetu juu yake",
    toggleForHim: "Wanaume",
    toggleForHer: "Wanawake",
    points: [
      {
        title: "Asili, si zilizopangwa",
        body: "Picha zinazoonekana kama rafiki mwenye vipaji alikukamata katikati ya wakati. Hiyo ndiyo inayopata uaminifu na majibu",
      },
      {
        title: "Marejeleo yaliyochaguliwa kwa mkono",
        body: "Kila rejeleo la mtindo wetu lilichaguliwa kwa sababu linafanya kazi bora kim takwimu kwenye programu za mahusiano. Hakuna ujazo, hakuna picha za AI za jumla",
      },
      {
        title: "Estetiki yako halisi",
        body: "Hakuna ngozi ya mafuta, hakuna mikono iliyoyeyuka, hakuna uncanny valley. Ikiwa haipitishi kama picha halisi, haifikii kamwe galeria yako",
      },
    ],
  },

  profileBadge: {
    line1: "Kizalishaji cha picha",
    line2: "cha wasifu wa mahusiano #1",
  },

  photoshoot: {
    kicker: "Fanya hesabu",
    title: "Bora zaidi bila kikomo kuliko upigaji picha wa {photographerPrice}",
    body: 'Mpiga picha anakupa mchana mmoja, nguo moja, na picha zinazopiga kelele: "Nimeajiri mpiga picha kwa wasifu wangu wa mahusiano." Sisi tunakupa katalogi nzima ya mionekano ya asili, maisha yako bora, kwa sehemu ndogo ya bei',
    themLabel: "Upigaji picha wa jadi",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ kwa kipindi kimoja",
        us: "Malipo moja ya {price}, ndio hiyo",
      },
      {
        them: "Picha 10 hadi 20 zinazotumika ukiwa na bahati",
        us: "Picha {photoCount} katika mitindo iliyothibitishwa",
      },
      {
        them: "Nguo moja, eneo moja, hali moja",
        us: "Makumi ya nguo, mandhari, na hisia",
      },
      {
        them: "Zinaonekana zimepangwa na kuigizwa",
        us: "Asili, zinalingana na estetiki ya feed",
      },
      {
        them: "Wiki za kupanga na kusubiri",
        us: "Tayari ndani ya masaa, kutoka sofa yako",
      },
      {
        them: "Upigaji tena? Lipa tena.",
        us: "Uhariri 100 wa AI umejumuishwa",
      },
    ],
    punchline:
      "Mapenzi yako yako hatarini. Usiyacheke kwa mtu ambaye tayari amelipwa",
  },

  match: {
    kicker: "Mahali hii inaelekea",
    title: "Mazungumzo bora zaidi huanza na picha bora zaidi",
    body: 'Mechi zaidi ni mwanzo tu. Picha zako zinapoonyesha jinsi unavyovutia na kujiamini, miadi haibati tena, mazungumzo huanza kwa nguvu zaidi, na "unaonekana kama picha zako" inakuwa sifa, si faraja',
    imageAlt: "Skrini za mechi za Tinder zinaonyesha It's a Match",
  },

  manifesto: {
    text: "Picha bora zinamaanisha mechi bora. Ni rahisi hivyo. Ushauri namba 1 utakaopewa na guru yeyote wa mahusiano ni: pata picha bora za mahusiano. Binadamu ni viumbe wa kuona hata hivyo. Tunatumia AI ya kisasa kufanya mchakato huu uwe nafuu sana na rahisi kama 1 2 3",
    attribution: "Kwa nini tulijenga {appName}",
  },

  steps: {
    kicker: "Rahisi kama 1 2 3",
    title: "Mabadiliko yako kwenye autopilot",
    items: [
      {
        title: "Pakia selfie zako",
        body: "Picha 10+ za kila siku. AI yetu inajifunza uso wako kutoka kila pembe",
      },
      {
        title: "AI inajenga tabia yako",
        body: "Modeli yako ya kibinafsi, imefundishwa mara moja, inaweza kutumika tena katika kila mtindo",
      },
      {
        title: "Pakua picha {photoCount}",
        body: "Mitindo iliyochaguliwa kwa mkono, bila alama ya maji, tayari kwa kila programu ya mahusiano",
      },
    ],
  },

  pricing: {
    kicker: "Malipo moja. Hakuna usajili",
    title: "Nafuu kuliko miadi mbaya ya kwanza",
    body: "Utatumia zaidi kwenye miadi na mechi za ubora wa chini. Rekebisha picha mara moja na uzoefu wako wa programu za mahusiano utabadilika milele",
    planName: "Picha za Wasifu",
    features: [
      "Picha {photoCount} za mahusiano zilizotengenezwa na AI",
      "Uhariri 100 wa AI: kubadilisha nguo, kurekebisha mandhari au tabasamu bora",
      "Zaidi ya mitindo na mandhari 200+ iliyochaguliwa kwa mkono na inayofanya vizuri",
      "Imeboreshwa kwa watu unayetaka kuvutia",
      "Bila alama ya maji, upakuaji tayari kwa programu",
      "Faragha: picha zako hazishirikiwi kamwe",
      "Usindikaji wa kipaumbele",
    ],
    cta: "Pata Picha Zangu",
    guarantee:
      "Picha zako za mafunzo zinabaki za faragha na zimehifadhiwa salama",
    payoff:
      "Ikiwa picha moja itakuletea miadi moja nzuri zaidi, tayari imelipia gharama yake",
  },

  faq: {
    title: "Maswali, yamejibiwa",
    items: [
      {
        q: "Je, picha zitaonekana kama mimi kweli?",
        a: "Ndiyo. AI inafundishwa kwa uso wako halisi kutoka selfie unazopakia na inalingana na estetiki yako halisi. Hakuna uncanny valley, hakuna ngozi ya plastiki. Ikiwa picha haionekani halisi, itengeneze tena au irekebishe kwa uhariri wa AI uliojumuishwa",
      },
      {
        q: "Hii ni bora vipi kuliko upigaji picha wa kitaalamu?",
        a: "Upigaji picha wa {photographerPrice} unakununulia nguo moja, eneo moja, na picha zilizopangwa wazi. Unapata katalogi nzima ya mionekano ya asili, maisha yako bora, katika makumi ya mandhari, pamoja na uhariri wa AI, kwa sehemu ndogo ya bei, bila kuondoka nyumbani",
      },
      {
        q: "Unamaanisha nini kwa kumeboreshwa kwa mtazamo wa mwanamke / mwanaume?",
        a: "Marejeleo yetu ya mtindo yalichaguliwa kwa mkono kulingana na kinachowafanya watu unayetaka kuvutia kujibu, fremu za asili, mazingira ya asili, mwanga wa joto, si kinachokuvutia wewe. Ndiyo maana zinafanya kazi mara 10 bora",
      },
      {
        q: "Nitapata picha zangu haraka kiasi gani?",
        a: "Kufundisha tabia yako ya AI ya kibinafsi kunachukua takriban dakika 20 hadi 45. Baada ya hapo, kila picha inatengenezwa ndani ya dakika. Watumiaji wengi wana wasifu mpya kamili siku hiyo hiyo",
      },
      {
        q: "Je, ninaweza kuhariri tattoo, nguo, au mandhari?",
        a: "Ndiyo, kila mpango unajumuisha uhariri wa AI. Ongeza au ondoa tattoo, badilisha nguo, ondoa vitu, au safisha mandhari kwa kuandika sentensi",
      },
      {
        q: "Je, data yangu ni ya faragha?",
        a: "Upakiaji wako na picha zilizotengenezwa ni za faragha kwenye akaunti yako. Hatutawahi kuchapisha, kushiriki, au kufundisha modeli za umma kwa uso wako, na unaweza kuomba kufutwa wakati wowote",
      },
      {
        q: "Picha zinahifadhiwa kwa muda gani na mikopo inadumu kwa muda gani?",
        a: "Picha zilizotengenezwa zinabaki kwenye gallery kwa mwezi 1–2. Mikopo inatumika mwaka mzima tangu ununuzi",
      },
    ],
  },

  finalCta: {
    title: "Kuwa wasifu unaosimamisha scroll",
    body: "Asilimia 80 hupuuzwa. Asilimia 20 walipata picha bora. Unataka kuwa yupi leo usiku?",
    cta: "Anza",
  },

  footer: {
    tagline: "Picha za mahusiano za AI zimeundwa kukufanya uonekane",
    support: "Maswali?",
    rights: "Haki zote zimehifadhiwa",
  },
  feedbackPrompt: {
    question: "Je, kuna taarifa unazokosa ili kutumia huduma yetu?",
    placeholder: "Tuambie kinachokosekana au hakiko wazi...",
    submit: "Tuma",
    closeLabel: "Funga",
    thanks: "Asante kwa maoni yako!",
  },
} satisfies Dictionary;
