#!/usr/bin/env node
/**
 * One-off script: insert storage/credits FAQ item before the privacy FAQ in every locale file.
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const translationsDir = join(__dirname, "../src/lib/i18n/translations");

const STORAGE_FAQ = {
  en: {
    q: "How long are my photos stored, and how long do credits last?",
    a: "Generated photos stay available in your gallery for 1 to 2 months. Credits are valid for a full year from purchase, so you have plenty of time to generate, edit, and download everything you need",
  },
  es: {
    q: "¿Cuánto tiempo se guardan mis fotos y cuánto duran los créditos?",
    a: "Las fotos generadas permanecen disponibles en tu galería de 1 a 2 meses. Los créditos son válidos durante un año completo desde la compra, así que tienes tiempo de sobra para generar, editar y descargar todo lo que necesites",
  },
  fr: {
    q: "Combien de temps mes photos sont-elles conservées et combien de temps durent les crédits ?",
    a: "Les photos générées restent disponibles dans votre galerie pendant 1 à 2 mois. Les crédits sont valables un an à compter de l'achat, vous laissant amplement le temps de générer, modifier et télécharger tout ce dont vous avez besoin",
  },
  de: {
    q: "Wie lange werden meine Fotos gespeichert und wie lange sind Credits gültig?",
    a: "Generierte Fotos bleiben 1 bis 2 Monate in deiner Galerie verfügbar. Credits sind ab dem Kauf ein volles Jahr gültig, sodass du genügend Zeit hast, alles zu generieren, zu bearbeiten und herunterzuladen",
  },
  it: {
    q: "Per quanto tempo vengono conservate le mie foto e quanto durano i crediti?",
    a: "Le foto generate restano disponibili nella tua galleria per 1-2 mesi. I crediti sono validi per un anno intero dall'acquisto, così hai tutto il tempo per generare, modificare e scaricare ciò che ti serve",
  },
  pt: {
    q: "Por quanto tempo as minhas fotos ficam guardadas e quanto tempo duram os créditos?",
    a: "As fotos geradas ficam disponíveis na sua galeria durante 1 a 2 meses. Os créditos são válidos durante um ano completo a partir da compra, para ter tempo de gerar, editar e descarregar tudo o que precisar",
  },
  nl: {
    q: "Hoe lang worden mijn foto's bewaard en hoe lang blijven credits geldig?",
    a: "Gegenereerde foto's blijven 1 tot 2 maanden beschikbaar in je galerij. Credits zijn een volledig jaar geldig vanaf aankoop, zodat je ruim de tijd hebt om alles te genereren, bewerken en downloaden",
  },
  pl: {
    q: "Jak długo przechowywane są moje zdjęcia i jak długo ważne są kredyty?",
    a: "Wygenerowane zdjęcia pozostają w galerii przez 1–2 miesiące. Kredyty są ważne przez pełny rok od zakupu, więc masz dużo czasu na generowanie, edycję i pobieranie",
  },
  ru: {
    q: "Как долго хранятся мои фото и как долго действуют кредиты?",
    a: "Сгенерированные фото остаются в галерее 1–2 месяца. Кредиты действуют целый год с момента покупки — достаточно времени, чтобы создать, отредактировать и скачать всё необходимое",
  },
  ja: {
    q: "写真はどのくらい保存され、クレジットの有効期限は？",
    a: "生成された写真はギャラリーで1〜2ヶ月間利用できます。クレジットは購入から1年間有効なので、生成・編集・ダウンロードに十分な時間があります",
  },
  ko: {
    q: "사진은 얼마나 보관되며, 크레딧은 얼마나 유효한가요?",
    a: "생성된 사진은 갤러리에서 1~2개월 동안 이용할 수 있습니다. 크레딧은 구매 후 1년간 유효하므로 생성, 편집, 다운로드할 충분한 시간이 있습니다",
  },
  zh: {
    q: "照片保存多久？积分有效期多久？",
    a: "生成的照片在图库中保留1至2个月。积分自购买起一整年内有效，您有充足时间生成、编辑和下载所需内容",
  },
  "zh-TW": {
    q: "照片保存多久？點數有效期限多久？",
    a: "生成的照片在相簿中保留1至2個月。點數自購買起一整年內有效，您有充足時間生成、編輯和下載所需內容",
  },
  ar: {
    q: "كم تُحفظ صوري وكم تدوم الرصيد؟",
    a: "تبقى الصور المُنشأة في معرضك من شهر إلى شهرين. الرصيد صالح لمدة سنة كاملة من الشراء، لذا لديك وقت كافٍ للإنشاء والتعديل والتنزيل",
  },
  hi: {
    q: "मेरी तस्वीरें कितने समय तक रहती हैं और क्रेडिट कितने समय तक चलते हैं?",
    a: "जनरेट की गई तस्वीरें 1–2 महीने तक गैलरी में रहती हैं। क्रेडिट खरीद के एक पूरे साल तक मान्य हैं, इसलिए आपके पास जनरेट, एडिट और डाउनलोड का पर्याप्त समय है",
  },
  tr: {
    q: "Fotoğraflarım ne kadar saklanır, krediler ne kadar geçerlidir?",
    a: "Oluşturulan fotoğraflar galerinizde 1–2 ay kalır. Krediler satın almadan itibaren tam bir yıl geçerlidir; üretmek, düzenlemek ve indirmek için bolca zamanınız olur",
  },
  vi: {
    q: "Ảnh được lưu bao lâu và tín dụng có hiệu lực bao lâu?",
    a: "Ảnh tạo ra còn trong thư viện 1–2 tháng. Tín dụng có hiệu lực trọn một năm kể từ khi mua, đủ thời gian để tạo, chỉnh sửa và tải xuống",
  },
  th: {
    q: "รูปภาพเก็บไว้นานแค่ไหน และเครดิตใช้ได้นานแค่ไหน?",
    a: "รูปที่สร้างจะอยู่ในแกลเลอรี 1–2 เดือน เครดิตใช้ได้เต็ม 1 ปีนับจากซื้อ มีเวลาสร้าง แก้ไข และดาวน์โหลดได้เพียงพอ",
  },
  id: {
    q: "Berapa lama foto disimpan dan berapa lama kredit berlaku?",
    a: "Foto yang dibuat tetap di galeri 1–2 bulan. Kredit berlaku satu tahun penuh sejak pembelian, cukup waktu untuk membuat, mengedit, dan mengunduh",
  },
  sv: {
    q: "Hur länge sparas mina bilder och hur länge gäller krediter?",
    a: "Genererade bilder finns i galleriet i 1–2 månader. Krediter gäller ett helt år från köp, så du har gott om tid att generera, redigera och ladda ner",
  },
  da: {
    q: "Hvor længe gemmes mine billeder, og hvor længe varer credits?",
    a: "Genererede billeder er tilgængelige i galleriet i 1–2 måneder. Credits er gyldige et helt år fra køb, så du har god tid til at generere, redigere og downloade",
  },
  nb: {
    q: "Hvor lenge lagres bildene mine, og hvor lenge varer kreditter?",
    a: "Genererte bilder er tilgjengelige i galleriet i 1–2 måneder. Kreditter er gyldige et helt år fra kjøp, så du har god tid til å generere, redigere og laste ned",
  },
  fi: {
    q: "Kuinka kauan kuviani säilytetään ja kuinka kauan krediitit ovat voimassa?",
    a: "Luodut kuvat ovat galleriassa 1–2 kuukautta. Krediitit ovat voimassa täyden vuoden oston jälkeen, joten sinulla on aikaa luoda, muokata ja ladata",
  },
  cs: {
    q: "Jak dlouho se ukládají mé fotky a jak dlouho platí kredity?",
    a: "Vygenerované fotky zůstávají v galerii 1–2 měsíce. Kredity platí celý rok od nákupu, takže máte dost času na generování, úpravy a stažení",
  },
  hu: {
    q: "Meddig tárolódnak a képeim és meddig érvényesek a kreditek?",
    a: "A generált fotók 1–2 hónapig érhetők el a galériában. A kreditek a vásárlástól számított egy teljes évig érvényesek",
  },
  ro: {
    q: "Cât timp sunt stocate fotografiile și cât durează creditele?",
    a: "Fotografiile generate rămân în galerie 1–2 luni. Creditele sunt valabile un an întreg de la cumpărare, pentru generare, editare și descărcare",
  },
  el: {
    q: "Πόσο διατηρούνται οι φωτογραφίες μου και πόσο διαρκούν τα credits;",
    a: "Οι φωτογραφίες παραμένουν στη γκαλερί 1–2 μήνες. Τα credits ισχύουν έναν ολόκληρο χρόνο από την αγορά, ώστε να έχετε χρόνο για δημιουργία, επεξεργασία και λήψη",
  },
  he: {
    q: "כמה זמן התמונות נשמרות וכמה זמן הקרדיטים בתוקף?",
    a: "התמונות שנוצרו נשארות בגלריה 1–2 חודשים. הקרדיטים בתוקף לשנה שלמה מרגע הרכישה, כך שיש לך זמן ליצור, לערוך ולהוריד",
  },
  uk: {
    q: "Як довго зберігаються фото та скільки діють кредити?",
    a: "Згенеровані фото залишаються в галереї 1–2 місяці. Кредити дійсні цілий рік з моменту покупки",
  },
  ms: {
    q: "Berapa lama foto disimpan dan berapa lama kredit sah?",
    a: "Foto yang dijana kekal dalam galeri 1–2 bulan. Kredit sah satu tahun penuh dari pembelian",
  },
  fil: {
    q: "Gaano katagal naka-store ang mga larawan at gaano katagal ang credits?",
    a: "Ang mga nabuong larawan ay nasa gallery ng 1–2 buwan. Ang credits ay may bisa ng isang buong taon mula sa pagbili",
  },
  bn: {
    q: "ছবি কতদিন সংরক্ষিত থাকে এবং ক্রেডিট কতদিন থাকে?",
    a: "তৈরি ছবি ১–২ মাস গ্যালারিতে থাকে। ক্রেডিট কেনার পর এক বছর পর্যন্ত বৈধ",
  },
  ur: {
    q: "تصاویر کتنے عرصے تک محفوظ رہتی ہیں اور کریڈٹس کتنے عرصے تک چلتے ہیں؟",
    a: "تیار شدہ تصاویر 1–2 ماہ تک گیلری میں رہتی ہیں۔ کریڈٹس خریداری کے بعد پورے ایک سال تک درست ہیں",
  },
  fa: {
    q: "عکس‌ها چند مدت نگهداری می‌شوند و اعتبار چقدر است؟",
    a: "عکس‌های تولیدشده ۱ تا ۲ ماه در گالری می‌مانند. اعتبار از زمان خرید یک سال کامل معتبر است",
  },
  af: {
    q: "Hoe lank word my foto's gestoor en hoe lank geld krediete?",
    a: "Gegenereerde foto's bly 1–2 maande in jou galery. Krediete is 'n volle jaar geldig vanaf aankoop",
  },
  ca: {
    q: "Quant de temps es guarden les meves fotos i quant duren els crèdits?",
    a: "Les fotos generades romanen a la galeria d'1 a 2 mesos. Els crèdits són vàlids un any sencer des de la compra",
  },
  sk: {
    q: "Ako dlho sa ukladajú moje fotky a ako dlho platia kredity?",
    a: "Vygenerované fotky zostávajú v galérii 1–2 mesiace. Kredity platia celý rok od nákupu",
  },
  hr: {
    q: "Koliko dugo se čuvaju moje fotografije i koliko traju krediti?",
    a: "Generirane fotografije ostaju u galeriji 1–2 mjeseca. Krediti vrijede punu godinu od kupnje",
  },
  bg: {
    q: "Колко дълго се съхраняват снимките и колко валидни са кредитите?",
    a: "Генерираните снимки остават в галерията 1–2 месеца. Кредитите са валидни цяла година от покупката",
  },
  sr: {
    q: "Koliko dugo se čuvaju moje fotografije i koliko traju krediti?",
    a: "Generisane fotografije ostaju u galeriji 1–2 meseca. Krediti važe celu godinu od kupovine",
  },
  sl: {
    q: "Kako dolgo so shranjene moje fotografije in kako dolgo veljajo krediti?",
    a: "Ustvarjene fotografije ostanejo v galeriji 1–2 meseca. Krediti veljajo celo leto od nakupa",
  },
  lt: {
    q: "Kiek laiko saugomos mano nuotraukos ir kiek galioja kreditai?",
    a: "Sugeneruotos nuotraukos lieka galerijoje 1–2 mėnesius. Kreditai galioja visus metus nuo pirkimo",
  },
  lv: {
    q: "Cik ilgi tiek glabātas manas fotogrāfijas un cik ilgi der kredīti?",
    a: "Ģenerētās fotogrāfijas paliek galerijā 1–2 mēnešus. Kredīti ir derīgi visu gadu no pirkuma",
  },
  et: {
    q: "Kui kaua mu fotosid hoitakse ja kui kaua kehtivad krediidid?",
    a: "Genereeritud fotod jäävad galeriisse 1–2 kuuks. Krediidid kehtivad terve aasta ostust alates",
  },
  sw: {
    q: "Picha zinahifadhiwa kwa muda gani na mikopo inadumu kwa muda gani?",
    a: "Picha zilizotengenezwa zinabaki kwenye gallery kwa mwezi 1–2. Mikopo inatumika mwaka mzima tangu ununuzi",
  },
};

const FILE_TO_LOCALE = {
  "en.ts": "en",
  "es.ts": "es",
  "fr.ts": "fr",
  "de.ts": "de",
  "it.ts": "it",
  "pt.ts": "pt",
  "nl.ts": "nl",
  "pl.ts": "pl",
  "ru.ts": "ru",
  "ja.ts": "ja",
  "ko.ts": "ko",
  "zh.ts": "zh",
  "zh-TW.ts": "zh-TW",
  "ar.ts": "ar",
  "hi.ts": "hi",
  "tr.ts": "tr",
  "vi.ts": "vi",
  "th.ts": "th",
  "id.ts": "id",
  "sv.ts": "sv",
  "da.ts": "da",
  "nb.ts": "nb",
  "fi.ts": "fi",
  "cs.ts": "cs",
  "hu.ts": "hu",
  "ro.ts": "ro",
  "el.ts": "el",
  "he.ts": "he",
  "uk.ts": "uk",
  "ms.ts": "ms",
  "fil.ts": "fil",
  "bn.ts": "bn",
  "ur.ts": "ur",
  "fa.ts": "fa",
  "af.ts": "af",
  "ca.ts": "ca",
  "sk.ts": "sk",
  "hr.ts": "hr",
  "bg.ts": "bg",
  "sr.ts": "sr",
  "sl.ts": "sl",
  "lt.ts": "lt",
  "lv.ts": "lv",
  "et.ts": "et",
  "sw.ts": "sw",
};

function escapeForTs(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function formatFaqItem({ q, a }) {
  return `      {
        q: "${escapeForTs(q)}",
        a: "${escapeForTs(a)}",
      },`;
}

const alreadyAdded = /How long are my photos stored|Cuánto tiempo se guardan|写真はどのくらい保存され/;

for (const file of readdirSync(translationsDir)) {
  if (!file.endsWith(".ts") || file === "en.ts") continue;
  const locale = FILE_TO_LOCALE[file];
  if (!locale || !STORAGE_FAQ[locale]) {
    console.warn(`skip ${file}`);
    continue;
  }

  const path = join(translationsDir, file);
  let content = readFileSync(path, "utf8");
  if (alreadyAdded.test(content)) {
    console.log(`already patched ${file}`);
    continue;
  }

  const item = formatFaqItem(STORAGE_FAQ[locale]);
  const faqClose = content.lastIndexOf("    ],\n  },\n\n  finalCta:");
  if (faqClose === -1) {
    console.error(`could not find faq block in ${file}`);
    continue;
  }

  content =
    content.slice(0, faqClose) +
    item +
    "\n" +
    content.slice(faqClose);
  writeFileSync(path, content);
  console.log(`patched ${file}`);
}

console.log("done");
