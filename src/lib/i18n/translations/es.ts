import type { Dictionary } from "./en";

export const es = {
  nav: {
    results: "Resultados",
    pricing: "Precios",
    faq: "Preguntas frecuentes",
    signIn: "Iniciar sesión",
    getStarted: "Empezar",
  },

  stickyCta: {
    label: "Empezar",
    sub: "Pago único · {photoCount} fotos",
  },

  hero: {
    badge: "El 80% de los perfiles de citas se ignoran. Sé del 20%",
    titleLine1: "Fotos de citas diseñadas",
    titleAccent: "para sus ojos",
    titleAccentAlt: "para sus ojos",
    titleLine2: "no para tu ego",
    subtitle:
      "Nuestra IA propietaria estudia lo que realmente detiene el swipe, y luego reconstruye tu perfil con fotos espontáneas de calidad editorial que encajan con tu estética real. Cero aspecto plástico de IA. Cero artefactos visibles",
    cta: "Transformar mi perfil",
    ctaSecondary: "Ver resultados reales",
    ratingLabel: "valorado por solteros que dejaron de ser ignorados",
  },

  trustBar: {
    label: "Con la confianza de solteros que están ganando en",
  },

  proof: {
    kicker: "Las cifras son brutales",
    title: "Tienes un swipe para hacer que ella se detenga",
    titleAlt: "Tienes un swipe para hacer que él se detenga",
    body: "El 80% de los perfiles de citas se ignoran, no por la persona, sino por las fotos. El consejo número uno de todo coach de citas es el mismo: arregla tus fotos primero. Entrenamos nuestro sistema de IA propietario para ser valorado como atractivo sin perder ese look espontáneo",
    stats: [
      {
        value: "75%",
        label: "de los perfiles se descartan en menos de un segundo",
      },
      {
        value: "10x",
        label: "mejor calidad de matches",
      },
      {
        value: "100+",
        label:
          "minutos ahorrados cada semana evitando plantones y quienes desaparecen",
      },
    ],
  },

  beforeAfter: {
    kicker: "Estética real. Cero artefactos",
    title: "La misma cara. Una primera impresión totalmente distinta",
    body: "Cada referencia de nuestro catálogo fue elegida a mano porque rinde 10 veces mejor en apps de citas. Nuestra IA propietaria las adapta a tu estética real, para que las fotos parezcan tú en tu mejor día, no un render de ti",
    toggleForHim: "Para él",
    toggleForHer: "Para ella",
    toggleHint: "Fotos optimizadas para a quien quieres atraer",
    beforeLabel: "Antes",
    afterLabel: "Después",
    meterLabel: "Atractivo al swipe",
    meterBeforeCaption: "Se descarta",
    meterAfterCaption: "Recibe mensajes primero, mejores citas y más matches",
    disclaimer: "Transformaciones de clientes con los que hemos trabajado",
    examples: {
      him: [
        { beforeCaption: "Que te desaparezcan agota mentalmente" },
        {
          beforeCaption: "Conversaciones, pero muchos plantones",
          afterCaption: "Elige a quién dejar en visto",
        },
      ],
      her: [
        {
          beforeCaption: "Citas de poco esfuerzo",
          afterCaption: "Consigue al hombre de sus sueños",
        },
        {
          beforeCaption: "Solo consigue citas sin compromiso",
          afterCaption: "Encuentra a su alma gemela",
        },
      ],
    },
  },

  gaze: {
    kicker: "La ventaja injusta",
    titleHim: "Diseñado para la mirada femenina",
    titleHer: "Diseñado para la mirada masculina",
    body: "Los hombres hacen fotos que otros hombres creen que quedan geniales. Las mujeres eligen fotos que les gustan a sus amigas. Ambos se equivocan. Ingeniamos al revés lo que realmente responde la gente que quieres atraer: encuadres espontáneos, luz natural, entornos reales, y entrenamos nuestro sistema con ello",
    toggleForHim: "Hombres",
    toggleForHer: "Mujeres",
    points: [
      {
        title: "Espontáneas, no posadas",
        body: "Fotos que parecen tomadas por un amigo con talento en pleno momento. Eso genera confianza y respuestas",
      },
      {
        title: "Referencias elegidas a mano",
        body: "Cada una de nuestras referencias de estilo fue seleccionada porque rinde mejor en apps de citas. Sin relleno, sin retratos genéricos de IA",
      },
      {
        title: "Tu estética real",
        body: "Sin piel cerosa, sin manos deformes, sin valle inquietante. Si no pasa por una foto real, nunca llega a tu galería",
      },
    ],
  },

  profileBadge: {
    line1: "Generador de fotos de perfil",
    line2: "de citas n.º 1",
  },

  photoshoot: {
    kicker: "Haz las cuentas",
    title:
      "Infinitamente superior a una sesión de fotos de {photographerPrice}",
    body: "Un fotógrafo te da una tarde, un outfit y fotos que gritan «contraté a un fotógrafo para mi perfil de citas». Nosotros te damos un catálogo entero de looks espontáneos, viviendo tu mejor vida, por una fracción del precio",
    themLabel: "Sesión de fotos tradicional",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ por una sola sesión",
        us: "Un pago de {price}, y listo",
      },
      {
        them: "10 a 20 fotos útiles si tienes suerte",
        us: "{photoCount} fotos en estilos probados",
      },
      {
        them: "Un outfit, un lugar, una vibra",
        us: "Docenas de outfits, escenas y moods",
      },
      {
        them: "Visiblemente posadas y preparadas",
        us: "Espontáneas, nativas de la estética del feed",
      },
      {
        them: "Semanas de coordinación y espera",
        us: "Listas en horas, desde tu sofá",
      },
      {
        them: "¿Repetir sesión? Paga otra vez.",
        us: "100 ediciones con IA incluidas",
      },
    ],
    punchline:
      "El amor está en juego. No lo dejes en manos de alguien que ya cobró",
  },

  match: {
    kicker: "Donde termina esto",
    title: "Conversaciones de mayor calidad empiezan con el swipe",
    body: "Más matches es solo el principio. Cuando tus fotos por fin muestran lo interesante y seguro que te ves, dejas de comerte plantones, las conversaciones arrancan más fuertes, y «te ves igual que en tus fotos» se vuelve un cumplido, no un alivio",
    imageAlt: "Pantallas de match de Tinder mostrando It's a Match",
  },

  manifesto: {
    text: "Mejores fotos significan mejores matches. Así de simple. El consejo número uno que te dará cualquier gurú de citas es conseguir mejores fotos de perfil. Al fin y al cabo, los humanos somos criaturas visuales. Usamos IA de vanguardia para hacer ese proceso muy asequible y tan fácil como 1 2 3",
    attribution: "Por qué creamos {appName}",
  },

  steps: {
    kicker: "Tan fácil como 1 2 3",
    title: "Tu glow up, en piloto automático",
    items: [
      {
        title: "Sube tus selfies",
        body: "Más de 10 fotos cotidianas. Nuestra IA aprende tu rostro desde todos los ángulos",
      },
      {
        title: "La IA crea tu personaje",
        body: "Un modelo privado de ti, entrenado una vez, reutilizable en cada estilo",
      },
      {
        title: "Descarga {photoCount} fotos",
        body: "Estilos elegidos a mano, sin marca de agua, listas para cualquier app de citas",
      },
    ],
  },

  pricing: {
    kicker: "Un pago. Sin suscripción",
    title: "Más barato que una mala primera cita",
    body: "Gastarás más en citas con matches de baja calidad. Arregla las fotos una vez y tu experiencia en apps de citas cambiará para siempre",
    planName: "Fotos de perfil",
    features: [
      "{photoCount} fotos de citas generadas con IA",
      "100 ediciones con IA: cambio de outfit, ajuste de escenario o una sonrisa mejor",
      "Más de 200 estilos y escenas seleccionados a mano y de alto rendimiento",
      "Optimizadas para las personas que quieres atraer",
      "Descargas sin marca de agua, listas para la app",
      "Privado: tus fotos nunca se comparten",
      "Procesamiento prioritario",
    ],
    cta: "Obtener mis fotos",
    guarantee:
      "Tus fotos de entrenamiento permanecen privadas y almacenadas de forma segura",
    payoff: "Si una foto te consigue una cita extra genial, ya se pagó sola",
  },

  faq: {
    title: "Preguntas, respondidas",
    items: [
      {
        q: "¿Las fotos realmente se parecerán a mí?",
        a: "Sí. La IA se entrena con tu rostro real a partir de las selfies que subes y encaja con tu estética de la vida real. Sin valle inquietante, sin piel plástica. Si una foto no pasa por real, regénérala o corrígela con una edición con IA incluida",
      },
      {
        q: "¿En qué es mejor que una sesión de fotos profesional?",
        a: "Una sesión de {photographerPrice} te compra un outfit, un lugar y fotos visiblemente posadas. Tú obtienes un catálogo entero de looks espontáneos, viviendo tu mejor vida, en docenas de escenas, más ediciones con IA, por una fracción del precio, sin salir de casa",
      },
      {
        q: "¿Qué significa optimizado para la mirada femenina / masculina?",
        a: "Nuestras referencias de estilo fueron elegidas a mano según lo que realmente responde la gente que quieres atraer: encuadres espontáneos, entornos naturales, luz cálida, no lo que te impresiona a ti. Por eso rinden 10 veces mejor",
      },
      {
        q: "¿Qué tan rápido recibo mis fotos?",
        a: "Entrenar tu personaje privado de IA tarda unos 20 a 45 minutos. Después, cada foto se genera en minutos. La mayoría de usuarios tiene un perfil nuevo el mismo día",
      },
      {
        q: "¿Puedo editar tatuajes, outfits o fondos?",
        a: "Sí, cada plan incluye ediciones con IA. Añade o quita tatuajes, cambia ropa, elimina objetos o limpia fondos escribiendo una frase",
      },
      {
        q: "¿Mis datos son privados?",
        a: "Tus subidas y fotos generadas son privadas de tu cuenta. Nunca publicamos, compartimos ni entrenamos modelos públicos con tu rostro, y puedes solicitar la eliminación en cualquier momento",
      },
    ],
  },

  finalCta: {
    title: "Sé el perfil que detiene el scroll",
    body: "El 80% se ignora. El 20% consiguió mejores fotos. ¿Cuál quieres ser esta noche?",
    cta: "Empezar",
  },

  footer: {
    tagline: "Fotos de citas con IA diseñadas para que te noten",
    support: "¿Preguntas?",
    rights: "Todos los derechos reservados",
  },
} satisfies Dictionary;
