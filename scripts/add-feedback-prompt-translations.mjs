#!/usr/bin/env node
/**
 * Injects feedbackPrompt translations into all locale files.
 * Run: node scripts/add-feedback-prompt-translations.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const TRANSLATIONS_DIR = path.join(process.cwd(), "src/lib/i18n/translations");

const FEEDBACK_PROMPT = {
  en: {
    question: "Is there any info you are missing in order to use our service?",
    placeholder: "Tell us what's missing or unclear...",
    submit: "Submit",
    closeLabel: "Close",
    thanks: "Thank you for your feedback!",
  },
  es: {
    question: "¿Hay alguna información que te falte para usar nuestro servicio?",
    placeholder: "Cuéntanos qué te falta o no está claro...",
    submit: "Enviar",
    closeLabel: "Cerrar",
    thanks: "¡Gracias por tu comentario!",
  },
  fr: {
    question: "Manque-t-il des informations pour utiliser notre service ?",
    placeholder: "Dites-nous ce qui manque ou n'est pas clair...",
    submit: "Envoyer",
    closeLabel: "Fermer",
    thanks: "Merci pour votre retour !",
  },
  de: {
    question: "Fehlt Ihnen Informationen, um unseren Service zu nutzen?",
    placeholder: "Sagen Sie uns, was fehlt oder unklar ist...",
    submit: "Absenden",
    closeLabel: "Schließen",
    thanks: "Danke für Ihr Feedback!",
  },
  it: {
    question: "Ti manca qualche informazione per usare il nostro servizio?",
    placeholder: "Dicci cosa manca o non è chiaro...",
    submit: "Invia",
    closeLabel: "Chiudi",
    thanks: "Grazie per il feedback!",
  },
  pt: {
    question: "Falta alguma informação para usar o nosso serviço?",
    placeholder: "Diga-nos o que falta ou não está claro...",
    submit: "Enviar",
    closeLabel: "Fechar",
    thanks: "Obrigado pelo seu feedback!",
  },
  nl: {
    question: "Mis je informatie om onze dienst te gebruiken?",
    placeholder: "Vertel ons wat ontbreekt of onduidelijk is...",
    submit: "Versturen",
    closeLabel: "Sluiten",
    thanks: "Bedankt voor je feedback!",
  },
  pl: {
    question: "Czy brakuje Ci informacji, aby korzystać z naszej usługi?",
    placeholder: "Powiedz nam, czego brakuje lub co jest niejasne...",
    submit: "Wyślij",
    closeLabel: "Zamknij",
    thanks: "Dziękujemy za opinię!",
  },
  ru: {
    question: "Не хватает ли вам информации, чтобы пользоваться нашим сервисом?",
    placeholder: "Расскажите, чего не хватает или что непонятно...",
    submit: "Отправить",
    closeLabel: "Закрыть",
    thanks: "Спасибо за отзыв!",
  },
  ja: {
    question: "サービスを利用するのに不足している情報はありますか？",
    placeholder: "不足している点や不明な点を教えてください...",
    submit: "送信",
    closeLabel: "閉じる",
    thanks: "フィードバックありがとうございます！",
  },
  ko: {
    question: "서비스를 이용하는 데 필요한 정보가 부족한가요?",
    placeholder: "부족하거나 불분명한 점을 알려주세요...",
    submit: "제출",
    closeLabel: "닫기",
    thanks: "피드백 감사합니다!",
  },
  zh: {
    question: "您是否缺少使用我们服务所需的信息？",
    placeholder: "告诉我们缺少什么或哪里不清楚...",
    submit: "提交",
    closeLabel: "关闭",
    thanks: "感谢您的反馈！",
  },
  "zh-TW": {
    question: "您是否缺少使用我們服務所需的資訊？",
    placeholder: "告訴我們缺少什麼或哪裡不清楚...",
    submit: "提交",
    closeLabel: "關閉",
    thanks: "感謝您的回饋！",
  },
  ar: {
    question: "هل ينقصك أي معلومات لاستخدام خدمتنا؟",
    placeholder: "أخبرنا بما ينقص أو ما هو غير واضح...",
    submit: "إرسال",
    closeLabel: "إغلاق",
    thanks: "شكرًا على ملاحظاتك!",
  },
  hi: {
    question: "क्या हमारी सेवा का उपयोग करने के लिए आपके पास कोई जानकारी नहीं है?",
    placeholder: "बताएं क्या कमी है या क्या स्पष्ट नहीं है...",
    submit: "भेजें",
    closeLabel: "बंद करें",
    thanks: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
  },
  tr: {
    question: "Hizmetimizi kullanmak için eksik bilginiz var mı?",
    placeholder: "Eksik veya belirsiz olan şeyi bize söyleyin...",
    submit: "Gönder",
    closeLabel: "Kapat",
    thanks: "Geri bildiriminiz için teşekkürler!",
  },
  vi: {
    question: "Bạn có thiếu thông tin nào để sử dụng dịch vụ của chúng tôi không?",
    placeholder: "Cho chúng tôi biết điều gì còn thiếu hoặc chưa rõ...",
    submit: "Gửi",
    closeLabel: "Đóng",
    thanks: "Cảm ơn phản hồi của bạn!",
  },
  th: {
    question: "มีข้อมูลใดที่คุณยังขาดอยู่เพื่อใช้บริการของเราหรือไม่?",
    placeholder: "บอกเราว่าขาดอะไรหรือส่วนไหนไม่ชัดเจน...",
    submit: "ส่ง",
    closeLabel: "ปิด",
    thanks: "ขอบคุณสำหรับความคิดเห็น!",
  },
  id: {
    question: "Apakah ada informasi yang kurang untuk menggunakan layanan kami?",
    placeholder: "Beri tahu kami apa yang kurang atau tidak jelas...",
    submit: "Kirim",
    closeLabel: "Tutup",
    thanks: "Terima kasih atas masukan Anda!",
  },
  sv: {
    question: "Saknar du information för att använda vår tjänst?",
    placeholder: "Berätta vad som saknas eller är otydligt...",
    submit: "Skicka",
    closeLabel: "Stäng",
    thanks: "Tack för din feedback!",
  },
  da: {
    question: "Mangler du information for at bruge vores service?",
    placeholder: "Fortæl os, hvad der mangler eller er uklart...",
    submit: "Send",
    closeLabel: "Luk",
    thanks: "Tak for din feedback!",
  },
  nb: {
    question: "Mangler du informasjon for å bruke tjenesten vår?",
    placeholder: "Fortell oss hva som mangler eller er uklart...",
    submit: "Send",
    closeLabel: "Lukk",
    thanks: "Takk for tilbakemeldingen!",
  },
  fi: {
    question: "Puuttuuko sinulta tietoa palvelumme käyttämiseen?",
    placeholder: "Kerro, mitä puuttuu tai mikä on epäselvää...",
    submit: "Lähetä",
    closeLabel: "Sulje",
    thanks: "Kiitos palautteestasi!",
  },
  cs: {
    question: "Chybí vám nějaké informace pro používání naší služby?",
    placeholder: "Řekněte nám, co chybí nebo není jasné...",
    submit: "Odeslat",
    closeLabel: "Zavřít",
    thanks: "Děkujeme za zpětnou vazbu!",
  },
  hu: {
    question: "Hiányzik valamilyen információ a szolgáltatásunk használatához?",
    placeholder: "Mondja el, mi hiányzik vagy mi nem egyértelmű...",
    submit: "Küldés",
    closeLabel: "Bezárás",
    thanks: "Köszönjük a visszajelzést!",
  },
  ro: {
    question: "Îți lipsește vreo informație pentru a folosi serviciul nostru?",
    placeholder: "Spune-ne ce lipsește sau ce nu este clar...",
    submit: "Trimite",
    closeLabel: "Închide",
    thanks: "Mulțumim pentru feedback!",
  },
  el: {
    question: "Σας λείπει κάποια πληροφορία για να χρησιμοποιήσετε την υπηρεσία μας;",
    placeholder: "Πείτε μας τι λείπει ή δεν είναι σαφές...",
    submit: "Υποβολή",
    closeLabel: "Κλείσιμο",
    thanks: "Ευχαριστούμε για τα σχόλιά σας!",
  },
  he: {
    question: "האם חסרה לך מידע כדי להשתמש בשירות שלנו?",
    placeholder: "ספר לנו מה חסר או מה לא ברור...",
    submit: "שליחה",
    closeLabel: "סגירה",
    thanks: "תודה על המשוב!",
  },
  uk: {
    question: "Чи бракує вам інформації, щоб користуватися нашим сервісом?",
    placeholder: "Розкажіть, чого не вистачає або що незрозуміло...",
    submit: "Надіслати",
    closeLabel: "Закрити",
    thanks: "Дякуємо за відгук!",
  },
  ms: {
    question: "Adakah maklumat yang anda perlukan untuk menggunakan perkhidmatan kami?",
    placeholder: "Beritahu kami apa yang kurang atau tidak jelas...",
    submit: "Hantar",
    closeLabel: "Tutup",
    thanks: "Terima kasih atas maklum balas anda!",
  },
  fil: {
    question: "May kulang bang impormasyon para magamit ang aming serbisyo?",
    placeholder: "Sabihin sa amin kung ano ang kulang o hindi malinaw...",
    submit: "Isumite",
    closeLabel: "Isara",
    thanks: "Salamat sa iyong feedback!",
  },
  bn: {
    question: "আমাদের সেবা ব্যবহার করতে আপনার কোনো তথ্যের অভাব আছে কি?",
    placeholder: "কী অনুপস্থিত বা অস্পষ্ট তা আমাদের জানান...",
    submit: "জমা দিন",
    closeLabel: "বন্ধ করুন",
    thanks: "আপনার মতামতের জন্য ধন্যবাদ!",
  },
  ur: {
    question: "کیا ہماری سروس استعمال کرنے کے لیے آپ کو کوئی معلومات نہیں مل رہی؟",
    placeholder: "بتائیں کیا کمی ہے یا کیا واضح نہیں...",
    submit: "جمع کرائیں",
    closeLabel: "بند کریں",
    thanks: "آپ کی رائے کا شکریہ!",
  },
  fa: {
    question: "آیا اطلاعاتی برای استفاده از سرویس ما کم دارید؟",
    placeholder: "بگویید چه چیزی کم است یا نامشخص است...",
    submit: "ارسال",
    closeLabel: "بستن",
    thanks: "از بازخورد شما متشکریم!",
  },
  af: {
    question: "Ontbreek daar inligting om ons diens te gebruik?",
    placeholder: "Sê vir ons wat ontbreek of onduidelik is...",
    submit: "Stuur",
    closeLabel: "Sluit",
    thanks: "Dankie vir jou terugvoer!",
  },
  ca: {
    question: "Us falta alguna informació per utilitzar el nostre servei?",
    placeholder: "Expliqueu-nos què falta o no queda clar...",
    submit: "Enviar",
    closeLabel: "Tancar",
    thanks: "Gràcies pels comentaris!",
  },
  sk: {
    question: "Chýbajú vám nejaké informácie na používanie našej služby?",
    placeholder: "Povedzte nám, čo chýba alebo nie je jasné...",
    submit: "Odoslať",
    closeLabel: "Zavrieť",
    thanks: "Ďakujeme za spätnú väzbu!",
  },
  hr: {
    question: "Nedostaje li vam informacija za korištenje naše usluge?",
    placeholder: "Recite nam što nedostaje ili nije jasno...",
    submit: "Pošalji",
    closeLabel: "Zatvori",
    thanks: "Hvala na povratnim informacijama!",
  },
  bg: {
    question: "Липсва ли ви информация, за да използвате нашата услуга?",
    placeholder: "Кажете ни какво липсва или не е ясно...",
    submit: "Изпрати",
    closeLabel: "Затвори",
    thanks: "Благодарим за обратната връзка!",
  },
  sr: {
    question: "Да ли вам недостаје информација да бисте користили нашу услугу?",
    placeholder: "Реците нам шта недостаје или није јасно...",
    submit: "Пошаљи",
    closeLabel: "Затвори",
    thanks: "Хвала на повратној информацији!",
  },
  sl: {
    question: "Ali vam manjka kakšna informacija za uporabo naše storitve?",
    placeholder: "Povejte nam, kaj manjka ali ni jasno...",
    submit: "Pošlji",
    closeLabel: "Zapri",
    thanks: "Hvala za povratne informacije!",
  },
  lt: {
    question: "Ar jums trūksta informacijos, kad galėtumėte naudotis mūsų paslauga?",
    placeholder: "Pasakykite, ko trūksta ar kas neaišku...",
    submit: "Siųsti",
    closeLabel: "Uždaryti",
    thanks: "Ačiū už atsiliepimą!",
  },
  lv: {
    question: "Vai jums trūkst informācijas, lai izmantotu mūsu pakalpojumu?",
    placeholder: "Pastāstiet, kas trūkst vai nav skaidrs...",
    submit: "Iesniegt",
    closeLabel: "Aizvērt",
    thanks: "Paldies par atsauksmi!",
  },
  et: {
    question: "Kas teil puudub teave meie teenuse kasutamiseks?",
    placeholder: "Öelge, mis puudub või on ebaselge...",
    submit: "Saada",
    closeLabel: "Sulge",
    thanks: "Täname tagasiside eest!",
  },
  sw: {
    question: "Je, kuna taarifa unazokosa ili kutumia huduma yetu?",
    placeholder: "Tuambie kinachokosekana au hakiko wazi...",
    submit: "Tuma",
    closeLabel: "Funga",
    thanks: "Asante kwa maoni yako!",
  },
};

const FILE_LOCALE_MAP = {
  "zh-TW.ts": "zh-TW",
};

function localeForFile(filename) {
  if (FILE_LOCALE_MAP[filename]) return FILE_LOCALE_MAP[filename];
  return filename.replace(/\.ts$/, "");
}

function formatBlock(locale) {
  const t = FEEDBACK_PROMPT[locale] || FEEDBACK_PROMPT.en;
  return `
  feedbackPrompt: {
    question: ${JSON.stringify(t.question)},
    placeholder: ${JSON.stringify(t.placeholder)},
    submit: ${JSON.stringify(t.submit)},
    closeLabel: ${JSON.stringify(t.closeLabel)},
    thanks: ${JSON.stringify(t.thanks)},
  },`;
}

const files = readdirSync(TRANSLATIONS_DIR).filter((f) => f.endsWith(".ts") && f !== "en.ts");

for (const file of files) {
  const filePath = path.join(TRANSLATIONS_DIR, file);
  let content = readFileSync(filePath, "utf8");

  if (content.includes("feedbackPrompt:")) {
    console.log(`skip ${file} (already has feedbackPrompt)`);
    continue;
  }

  const locale = localeForFile(file);
  const block = formatBlock(locale);

  content = content.replace(
    /(\n  footer: \{[\s\S]*?\n  \},)\n(\} satisfies Dictionary;)/,
    `$1,${block}\n$2`
  );

  if (!content.includes("feedbackPrompt:")) {
    console.error(`failed to patch ${file}`);
    process.exitCode = 1;
    continue;
  }

  writeFileSync(filePath, content);
  console.log(`patched ${file}`);
}

console.log("done");
