import type { Dictionary } from "./en";

export const tr: Dictionary = {
  nav: {
    results: "Sonuçlar",
    pricing: "Fiyatlandırma",
    faq: "SSS",
    signIn: "Giriş yap",
    getStarted: "Başla",
  },

  stickyCta: {
    label: "Başla",
    sub: "Tek seferlik ödeme · {photoCount} fotoğraf",
  },

  hero: {
    badge: "Flört profillerinin %80'i görmezden gelinir. O %20'de olun",
    titleLine1: "Flört fotoğrafları tasarlandı",
    titleAccent: "onun gözü için",
    titleAccentAlt: "onun gözü için",
    titleLine2: "egonuz için değil",
    subtitle:
      "Özel yapay zekamız kaydırmayı gerçekten neyin durdurduğunu inceler, ardından profilinizi günlük, dergi kalitesinde fotoğraflarla yeniden oluşturur, gerçek yaşam estetiğinize uygun. Sıfır plastik yapay zeka görünümü. Sıfır fark edilir kusur",
    cta: "Profilimi Dönüştür",
    ctaSecondary: "Gerçek sonuçları gör",
    ratingLabel: "görmezden gelinmeyi bırakan bekarlar tarafından puanlandı",
  },

  trustBar: {
    label: "Kazanan bekarların güvendiği",
  },

  proof: {
    kicker: "Matematik acımasız",
    title: "Onu durdurmak için tek bir kaydırmanız var",
    titleAlt: "Onu durdurmak için tek bir kaydırmanız var",
    body: "Flört profillerinin %80'i görmezden gelinir, kişi yüzünden değil, fotoğraflar yüzünden. Her flört koçunun 1 numaralı tavsiyesi aynı: önce fotoğraflarınızı düzeltin. Özel yapay zeka sistemimizi çekici bulunurken doğal görünümü koruyacak şekilde eğittik",
    stats: [
      {
        value: "75%",
        label: "profil bir saniyeden kısa sürede atlanır",
      },
      {
        value: "10x",
        label: "daha iyi eşleşme kalitesi",
      },
      {
        value: "100+",
        label:
          "her hafta iptal edenlerden ve hayaletleyenlerden kazanılan dakika",
      },
    ],
  },

  beforeAfter: {
    kicker: "Gerçek estetik. Sıfır kusur",
    title: "Aynı yüz. Tamamen farklı ilk izlenim",
    body: "Kataloğumuzdaki her referans, flört uygulamalarında 10 kat daha iyi performans gösterdiği için elle seçildi. Özel yapay zekamız bunları gerçek yaşam estetiğinize uyarlar; fotoğraflar en iyi gününüzdeki siz gibi görünür, bir render gibi değil",
    toggleForHim: "Onun için",
    toggleForHer: "Onun için",
    toggleHint: "Çekmek istediğiniz kişiler için optimize edilmiş fotoğraflar",
    beforeLabel: "Önce",
    afterLabel: "Sonra",
    meterLabel: "Kaydırma çekiciliği",
    meterBeforeCaption: "Atlanır",
    meterAfterCaption:
      "İlk mesajı alır, daha iyi randevular daha fazla eşleşme",
    disclaimer: "Çalıştığımız müşterilerin dönüşümleri",
    examples: {
      him: [
        { beforeCaption: "Zihinsel olarak yıpratan hayaletleme" },
        {
          beforeCaption: "Konuşmalar var ama çok iptal",
          afterCaption: "Kimi iptal edeceğini o seçer",
        },
      ],
      her: [
        {
          beforeCaption: "Az çaba gerektiren randevular",
          afterCaption: "Hayalindeki adamı bulur",
        },
        {
          beforeCaption: "Sadece düşük bağlılıklı randevular",
          afterCaption: "Ruh eşini bulur",
        },
      ],
    },
  },

  gaze: {
    kicker: "Haksız avantaj",
    titleHim: "Kadın bakışı için tasarlandı",
    titleHer: "Erkek bakışı için tasarlandı",
    body: "Erkekler diğer erkeklere havalı görünen fotoğraflar çeker. Kadınlar arkadaşlarının beğendiği fotoğrafları seçer. İkisi de yanlış. Çekmeye çalıştığınız kişilerin gerçekten neye tepki verdiğini tersine mühendislik ettik, doğal kadraj, doğal ışık, gerçek ortamlar, ve sistemimizi buna göre eğittik",
    toggleForHim: "Erkekler",
    toggleForHer: "Kadınlar",
    points: [
      {
        title: "Doğal, pozlu değil",
        body: "Yetenekli bir arkadaşın sizi anın ortasında yakalamış gibi görünen fotoğraflar. Güven ve yanıt bununla kazanılır",
      },
      {
        title: "Elle seçilmiş referanslar",
        body: "Her stil referansımız, flört uygulamalarında istatistiksel olarak daha iyi performans gösterdiği için seçildi. Dolgu yok, jenerik yapay zeka portreleri yok",
      },
      {
        title: "Gerçek estetiğiniz",
        body: "Balmumu cilt yok, erimiş eller yok, tuhaf vadi yok. Gerçek bir fotoğraf gibi görünmüyorsa galerinize asla ulaşmaz",
      },
    ],
  },

  profileBadge: {
    line1: "#1 flört profili",
    line2: "fotoğraf oluşturucu",
  },

  photoshoot: {
    kicker: "Hesabı yapın",
    title: "{photographerPrice} fotoğraf çekiminden sonsuz üstün",
    body: 'Bir fotoğrafçı size bir öğleden sonra, bir kıyafet ve "flört profilim için fotoğrafçı tuttum" diye bağıran fotoğraflar verir. Biz size doğal görünümlerin tüm kataloğunu veriyoruz, en iyi hayatınızı yaşarken, fiyatın küçük bir kısmına',
    themLabel: "Geleneksel fotoğraf çekimi",
    usLabel: "{appName}",
    rows: [
      {
        them: "Tek seans için {photographerPrice}+",
        us: "Tek ödeme {price}, hepsi bu",
      },
      {
        them: "Şanslıysanız 10 ila 20 kullanılabilir fotoğraf",
        us: "{photoCount} fotoğraf kanıtlanmış stillerde",
      },
      {
        them: "Bir kıyafet, bir mekan, bir hava",
        us: "Düzinelerce kıyafet, sahne ve ruh hali",
      },
      {
        them: "Belirgin şekilde pozlu ve kurgulu",
        us: "Doğal, akış estetiğine uygun",
      },
      {
        them: "Haftalarca planlama ve bekleme",
        us: "Saatler içinde hazır, kanepenizden",
      },
      {
        them: "Yeniden çekim? Tekrar ödeyin.",
        us: "100 yapay zeka düzenlemesi dahil",
      },
    ],
    punchline: "Aşk söz konusu. Bunu zaten ödenmiş birine bırakmayın",
  },

  match: {
    kicker: "Bunun sonu",
    title: "Daha kaliteli sohbetler kaydırmayla başlar",
    body: 'Daha fazla eşleşme sadece başlangıç. Fotoğraflarınız sonunda ne kadar ilginç ve kendinden emin göründüğünüzü gösterdiğinde randevular iptal etmeyi bırakır, sohbetler daha güçlü açılır ve "fotoğraflarına çok benziyorsun" bir iltifat olur, rahatlama değil',
    imageAlt: "It's a Match gösteren Tinder eşleşme ekranları",
  },

  manifesto: {
    text: "Daha iyi fotoğraflar daha iyi eşleşmeler demek. Bu kadar basit. Her flört gurusunun 1 numaralı tavsiyesi daha iyi flört portreleri almaktır. Sonuçta insanlar görsel varlıklardır. Bu süreci son derece uygun fiyatlı ve 1 2 3 kadar kolay yapmak için en gelişmiş yapay zekayı kullanıyoruz",
    attribution: "Neden {appName} oluşturduk",
  },

  steps: {
    kicker: "1 2 3 kadar kolay",
    title: "Parıltınız, otomatik pilotta",
    items: [
      {
        title: "Selfielerinizi yükleyin",
        body: "10+ günlük fotoğraf. Yapay zekamız yüzünüzü her açıdan öğrenir",
      },
      {
        title: "Yapay zeka karakterinizi oluşturur",
        body: "Size özel model, bir kez eğitilir, her stilde yeniden kullanılabilir",
      },
      {
        title: "{photoCount} fotoğraf indirin",
        body: "Elle seçilmiş stiller, filigransız, her flört uygulaması için boyutlandırılmış",
      },
    ],
  },

  pricing: {
    kicker: "Tek ödeme. Abonelik yok",
    title: "Kötü bir ilk randevudan ucuz",
    body: "Düşük kaliteli eşleşmelerle daha fazla harcayacaksınız. Fotoğrafları bir kez düzeltin ve flört uygulaması deneyiminiz sonsuza dek değişsin",
    planName: "Profil Fotoğrafları",
    features: [
      "{photoCount} yapay zeka ile üretilmiş flört fotoğrafı",
      "100 yapay zeka düzenlemesi, kıyafet değiştirme, manzara ayarı veya daha iyi bir gülümseme için",
      "200'den fazla elle seçilmiş, yüksek performanslı stil ve sahne",
      "Çekmek istediğiniz kişiler için optimize edilmiş",
      "Filigransız, uygulamaya hazır indirmeler",
      "Özel: fotoğraflarınız asla paylaşılmaz",
      "Öncelikli işleme",
    ],
    cta: "Fotoğraflarımı Al",
    guarantee: "Eğitim fotoğraflarınız özel kalır ve güvenle saklanır",
    payoff:
      "Tek bir fotoğraf size tek bir ekstra harika randevu getirirse, zaten kendini amorti etmiştir",
  },

  faq: {
    title: "Sorular, cevaplandı",
    items: [
      {
        q: "Fotoğraflar gerçekten bana benzeyecek mi?",
        a: "Evet. Yapay zeka yüklediğiniz selfielerden gerçek yüzünüz üzerinde eğitilir ve gerçek yaşam estetiğinize uyar. Tuhaf vadi yok, plastik cilt yok. Bir fotoğraf gerçek gibi görünmüyorsa yeniden oluşturun veya dahil yapay zeka düzenlemesiyle düzeltin",
      },
      {
        q: "Bu profesyonel fotoğraf çekiminden nasıl daha iyi?",
        a: "{photographerPrice} fotoğraf çekimi size bir kıyafet, bir mekan ve belirgin şekilde pozlu fotoğraflar verir. Doğal görünümlerin tüm kataloğunu alırsınız, en iyi hayatınızı yaşarken, düzinelerce sahnede, yapay zeka düzenlemeleriyle, fiyatın küçük bir kısmına, evden çıkmadan",
      },
      {
        q: "Kadın bakışı / erkek bakışı optimize ne demek?",
        a: "Stil referanslarımız, çekmek istediğiniz kişilerin gerçekten neye tepki verdiğine göre elle seçildi, doğal kadraj, doğal ortamlar, sıcak ışık, size etkileyici görünene göre değil. Bu yüzden 10 kat daha iyi performans gösteriyorlar",
      },
      {
        q: "Fotoğraflarımı ne kadar hızlı alırım?",
        a: "Özel yapay zeka karakterinizin eğitimi yaklaşık 20 ila 45 dakika sürer. Sonrasında her fotoğraf dakikalar içinde oluşturulur. Çoğu kullanıcı aynı gün tam yeni bir profile sahip olur",
      },
      {
        q: "Dövmeleri, kıyafetleri veya arka planları düzenleyebilir miyim?",
        a: "Evet, her plan yapay zeka düzenlemeleri içerir. Dövme ekleyin veya kaldırın, kıyafet değiştirin, nesneleri kaldırın veya bir cümle yazarak arka planları temizleyin",
      },
      {
        q: "Verilerim özel mi?",
        a: "Yüklemeleriniz ve oluşturulan fotoğraflarınız hesabınıza özeldir. Yüzünüzü asla paylaşmaz, yayınlamaz veya genel modeller üzerinde eğitmeyiz; istediğiniz zaman silme talep edebilirsiniz",
      },
    ],
  },

  finalCta: {
    title: "Kaydırmayı durduran profil olun",
    body: "%80 görmezden gelinir. %20 daha iyi fotoğraf aldı. Bu gece hangisi olmak istiyorsunuz?",
    cta: "Başla",
  },

  footer: {
    tagline: "Dikkat çekmek için tasarlanmış yapay zeka flört fotoğrafları",
    support: "Sorular?",
    rights: "Tüm hakları saklıdır",
  },
};
