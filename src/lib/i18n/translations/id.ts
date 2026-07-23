import type { Dictionary } from "./en";

export const id = {
  nav: {
    results: "Hasil",
    pricing: "Harga",
    faq: "FAQ",
    signIn: "Masuk",
    getStarted: "Mulai",
  },

  stickyCta: {
    label: "Mulai",
    sub: "Bayar sekali · {photoCount} foto",
  },

  hero: {
    badge: "80% profil kencan diabaikan. Jadilah 20% sisanya",
    titleLine1: "Foto kencan dirancang",
    titleAccent: "untuk matanya",
    titleAccentAlt: "untuk matanya",
    titleLine2: "bukan untuk egomu",
    subtitle:
      "AI proprietary kami mempelajari apa yang benar-benar menghentikan swipe, lalu membangun ulang profilmu dengan foto candid berkualitas majalah yang cocok dengan estetika kehidupan nyatamu. Tanpa look AI plastik. Tanpa artefak yang terlihat",
    cta: "Transformasi Profil Saya",
    ctaSecondary: "Lihat hasil nyata",
    ratingLabel: "dinilai oleh para lajang yang berhenti diabaikan",
  },

  trustBar: {
    label: "Dipercaya oleh lajang yang menang di",
  },

  proof: {
    kicker: "Angkanya kejam",
    title: "Kamu punya satu swipe untuk membuatnya berhenti",
    titleAlt: "Kamu punya satu swipe untuk membuatnya berhenti",
    body: "80% profil kencan diabaikan, bukan karena orangnya, tapi karena fotonya. Saran #1 dari setiap dating coach sama: perbaiki fotomu dulu. Kami melatih sistem AI proprietary kami agar dinilai menarik sambil tetap mempertahankan look candid",
    stats: [
      {
        value: "75%",
        label: "profil dilewati dalam kurang dari satu detik",
      },
      {
        value: "10x",
        label: "kualitas match meningkat",
      },
      {
        value: "100+",
        label:
          "menit dihemat setiap minggu dari yang menghilang dan membatalkan",
      },
    ],
  },

  beforeAfter: {
    kicker: "Estetika nyata. Nol artefak",
    title: "Wajah sama. Kesan pertama benar-benar berbeda",
    body: "Setiap referensi di katalog kami dipilih manual karena performa 10x lebih baik di app kencan. AI proprietary kami memetakannya ke estetika kehidupan nyatamu, jadi fotonya terlihat seperti kamu di hari terbaikmu, bukan render",
    toggleForHim: "Untuk dia (pria)",
    toggleForHer: "Untuk dia (wanita)",
    toggleHint: "Foto dioptimalkan untuk orang yang ingin kamu tarik",
    beforeLabel: "Sebelum",
    afterLabel: "Sesudah",
    meterLabel: "Dayanya swipe",
    meterBeforeCaption: "Dilewati",
    meterAfterCaption: "Dichat duluan, kencan lebih baik, match lebih banyak",
    disclaimer: "Transformasi dari klien yang pernah kami bantu",
    examples: {
      him: [
        { beforeCaption: "Mengabaikan yang melelahkan mental" },
        {
          beforeCaption: "Ngobrol tapi sering dibatalin",
          afterCaption: "Bisa memilih siapa yang dia abaikan",
        },
      ],
      her: [
        {
          beforeCaption: "Kencan setengah hati",
          afterCaption: "Dapat pria impiannya",
        },
        {
          beforeCaption: "Cuma dapat kencan tanpa komitmen",
          afterCaption: "Menemukan belahan jiwa",
        },
      ],
    },
  },

  gaze: {
    kicker: "Keunggulan tidak adil",
    titleHim: "Dibuat untuk pandangan wanita",
    titleHer: "Dibuat untuk pandangan pria",
    body: "Pria foto yang menurut pria lain keren. Wanita pilih foto yang disukai teman-temannya. Keduanya salah. Kami reverse-engineer apa yang benar-benar ditanggapi orang yang ingin kamu tarik, framing candid, cahaya natural, lingkungan nyata, dan melatih sistem kami padanya",
    toggleForHim: "Pria",
    toggleForHer: "Wanita",
    points: [
      {
        title: "Candid, bukan diatur",
        body: "Foto yang terlihat seperti teman berbakat menangkap momenmu. Itu yang membangun kepercayaan dan balasan",
      },
      {
        title: "Referensi pilihan manual",
        body: "Setiap referensi gaya dipilih karena secara statistik outperform di app kencan. Tanpa filler, tanpa potret AI generik",
      },
      {
        title: "Estetika nyatamu",
        body: "Tanpa kulit lilin, tanpa tangan cacat, tanpa uncanny valley. Kalau tidak lolos sebagai foto nyata, tidak pernah masuk galerimu",
      },
    ],
  },

  profileBadge: {
    line1: "Generator foto profil",
    line2: "kencan #1",
  },

  photoshoot: {
    kicker: "Hitung sendiri",
    title: "Jauh lebih unggul dari photoshoot {photographerPrice}",
    body: "Fotografer kasih satu sore, satu outfit, dan foto yang teriak \u201cSaya sewa fotografer untuk profil kencan.\u201d Kami kasih seluruh katalog look candid, hidup terbaikmu, seharga sebagian kecil",
    themLabel: "Photoshoot tradisional",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ untuk satu sesi",
        us: "Satu pembayaran {price}, selesai",
      },
      {
        them: "10-20 foto usable kalau beruntung",
        us: "{photoCount} foto di berbagai gaya terbukti",
      },
      {
        them: "Satu outfit, satu lokasi, satu vibe",
        us: "Puluhan outfit, adegan, dan mood",
      },
      { them: "Jelas posed dan diatur", us: "Candid, native ke estetika feed" },
      {
        them: "Minggu-minggu jadwal dan nunggu",
        us: "Siap dalam jam, dari sofa rumah",
      },
      { them: "Shoot ulang? Bayar lagi.", us: "100 edit AI included" },
    ],
    punchline:
      "Cinta dipertaruhkan. Jangan serahkan ke orang yang sudah dibayar",
  },

  match: {
    kicker: "Akhir dari semua ini",
    title: "Percakapan berkualitas lebih tinggi dimulai dari foto yang lebih baik",
    body: "Lebih banyak match cuma permulaan. Saat fotomu akhirnya menunjukkan betapa menarik dan percaya dirimu, kencan jarang batal, obrolan dibuka lebih kuat, dan \u201ckamu persis seperti fotomu\u201d jadi pujian, bukan lega",
    imageAlt: "Layar match Tinder menampilkan It's a Match",
  },

  manifesto: {
    text: "Foto lebih baik berarti match lebih baik. Sesederhana itu. Saran #1 dari setiap guru kencan adalah dapatkan headshot kencan yang lebih baik. Manusia memang makhluk visual. Kami pakai AI mutakhir agar prosesnya super terjangkau dan semudah 1 2 3",
    attribution: "Mengapa kami membangun {appName}",
  },

  steps: {
    kicker: "Semudah 1 2 3",
    title: "Glow up-mu, otomatis",
    items: [
      {
        title: "Upload selfie-mu",
        body: "10+ foto sehari-hari. AI kami belajar wajahmu dari setiap sudut",
      },
      {
        title: "AI membangun karaktermu",
        body: "Model privat dirimu, dilatih sekali, dipakai ulang di setiap gaya",
      },
      {
        title: "Download {photoCount} foto",
        body: "Gaya pilihan manual, tanpa watermark, ukuran siap semua app kencan",
      },
    ],
  },

  pricing: {
    kicker: "Bayar sekali. Tanpa langganan",
    title: "Lebih murah dari satu kencan pertama yang buruk",
    body: "Kamu akan habiskan lebih banyak untuk kencan dengan match berkualitas rendah. Perbaiki fotonya sekali dan pengalaman app kencanmu berubah selamanya",
    planName: "Foto Profil",
    features: [
      "{photoCount} foto kencan hasil AI",
      "100 edit AI, ganti outfit, sesuaikan latar, atau senyum lebih baik",
      "Lebih dari 200+ gaya dan adegan pilihan manual, performa tinggi",
      "Dioptimalkan untuk orang yang ingin kamu tarik",
      "Download tanpa watermark, siap app",
      "Privat: fotomu tidak pernah dibagikan",
      "Pemrosesan prioritas",
    ],
    cta: "Dapatkan Fotoku",
    guarantee: "Foto latihanmu tetap privat dan disimpan dengan aman",
    payoff:
      "Kalau satu foto dapatkan satu kencan hebat ekstra, sudah balik modal",
  },

  faq: {
    title: "Pertanyaan, dijawab",
    items: [
      {
        q: "Apakah fotonya benar-benar mirip saya?",
        a: "Ya. AI dilatih dari wajah asli selfie yang kamu upload dan cocok dengan estetika kehidupan nyatamu. Tanpa uncanny valley, tanpa kulit plastik. Kalau foto tidak lolos sebagai nyata, generate ulang atau perbaiki dengan edit AI yang included",
      },
      {
        q: "Kenapa lebih baik dari photoshoot profesional?",
        a: "Photoshoot {photographerPrice} beli satu outfit, satu lokasi, dan foto yang jelas posed. Kamu dapat seluruh katalog look candid, hidup terbaikmu, di puluhan adegan, plus edit AI, seharga sebagian kecil, tanpa keluar rumah",
      },
      {
        q: "Apa maksud dioptimalkan pandangan wanita / pria?",
        a: "Referensi gaya kami dipilih manual berdasarkan apa yang benar-benar ditanggapi orang yang ingin kamu tarik, framing candid, setting natural, cahaya hangat, bukan yang terlihat keren buatmu. Itu sebabnya performa 10x lebih baik",
      },
      {
        q: "Seberapa cepat saya dapat fotonya?",
        a: "Melatih karakter AI privatmu butuh sekitar 20-45 menit. Setelah itu, setiap foto di-generate dalam menit. Kebanyakan user punya profil baru di hari yang sama",
      },
      {
        q: "Bisa edit tato, outfit, atau background?",
        a: "Ya, setiap paket include edit AI. Tambah atau hapus tato, ganti pakaian, hapus objek, atau bersihkan background dengan mengetik kalimat",
      },
      {
        q: "Apakah data saya privat?",
        a: "Upload dan foto yang di-generate privat untuk akunmu. Kami tidak pernah posting, sharing, atau melatih model publik dengan wajahmu, dan kamu bisa minta penghapusan kapan saja",
      },
      {
        q: "Berapa lama foto disimpan dan berapa lama kredit berlaku?",
        a: "Foto yang dibuat tetap di galeri 1–2 bulan. Kredit berlaku satu tahun penuh sejak pembelian, cukup waktu untuk membuat, mengedit, dan mengunduh",
      },
    ],
  },

  finalCta: {
    title: "Jadilah profil yang menghentikan scroll",
    body: "80% diabaikan. 20% dapat foto lebih baik. Malam ini kamu mau jadi yang mana?",
    cta: "Mulai",
  },

  footer: {
    tagline: "Foto kencan AI dirancang agar kamu diperhatikan",
    support: "Ada pertanyaan?",
    rights: "Hak cipta dilindungi",
  },
  feedbackPrompt: {
    question: "Apakah ada informasi yang kurang untuk menggunakan layanan kami?",
    placeholder: "Beri tahu kami apa yang kurang atau tidak jelas...",
    submit: "Kirim",
    closeLabel: "Tutup",
    thanks: "Terima kasih atas masukan Anda!",
  },
} satisfies Dictionary;
