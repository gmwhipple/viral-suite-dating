#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const translationsDir = join(__dirname, "../src/lib/i18n/translations");

const MATCH_TITLES = {
  en: "Higher quality conversations start with better photos",
  es: "Las conversaciones de mayor calidad empiezan con mejores fotos",
  fr: "Des conversations de meilleure qualité commencent avec de meilleures photos",
  de: "Hochwertigere Gespräche beginnen mit besseren Fotos",
  it: "Conversazioni di qualità superiore iniziano con foto migliori",
  pt: "Conversas de maior qualidade começam com melhores fotos",
  nl: "Gesprekken van hogere kwaliteit beginnen met betere foto's",
  pl: "Lepszej jakości rozmowy zaczynają się od lepszych zdjęć",
  ru: "Более качественные разговоры начинаются с лучших фото",
  ja: "質の高い会話は、より良い写真から始まる",
  ko: "더 나은 대화는 더 나은 사진에서 시작됩니다",
  zh: "更高质量的对话从更好的照片开始",
  "zh-TW": "更高品質的對話從更好的照片開始",
  ar: "محادثات أعلى جودة تبدأ بصور أفضل",
  hi: "बेहतर क्वालिटी की बातचीत बेहतर फ़ोटो से शुरू होती है",
  tr: "Daha kaliteli sohbetler daha iyi fotoğraflarla başlar",
  vi: "Cuộc trò chuyện chất lượng hơn bắt đầu từ ảnh đẹp hơn",
  th: "บทสนทนาคุณภาพสูงเริ่มจากรูปที่ดีกว่า",
  id: "Percakapan berkualitas lebih tinggi dimulai dari foto yang lebih baik",
  sv: "Högkvalitativa samtal börjar med bättre bilder",
  da: "Bedre samtaler starter med bedre billeder",
  nb: "Bedre samtaler starter med bedre bilder",
  fi: "Laadukkaammat keskustelut alkavat paremmista kuvista",
  cs: "Kvalitnější konverzace začínají lepšími fotkami",
  hu: "Jobb minőségű beszélgetések jobb fotókkal kezdődnek",
  ro: "Conversații de calitate superioară încep cu fotografii mai bune",
  el: "Συζητήσεις υψηλότερης ποιότητας ξεκινούν με καλύτερες φωτογραφίες",
  he: "שיחות באיכות גבוהה יותר מתחילות בתמונות טובות יותר",
  uk: "Якісніші розмови починаються з кращих фото",
  ms: "Perbualan berkualiti tinggi bermula dengan foto yang lebih baik",
  fil: "Mas de-kalidad na usapan ang nagsisimula sa mas magagandang larawan",
  bn: "উচ্চমানের কথোপকথন ভালো ছবি দিয়ে শুরু হয়",
  ur: "بہتر کوالٹی کی بات چیت بہتر تصاویر سے شروع ہوتی ہے",
  fa: "گفتگوهای باکیفیت‌تر با عکس‌های بهتر شروع می‌شوند",
  af: "Gesprekke van hoër kwaliteit begin met beter foto's",
  ca: "Converses de millor qualitat comencen amb millors fotos",
  sk: "Kvalitnejšie rozhovory začínajú lepšími fotkami",
  hr: "Kvalitetniji razgovori počinju boljim fotografijama",
  bg: "По-качествените разговори започват с по-добри снимки",
  sr: "Kvalitetniji razgovori počinju boljim fotografijama",
  sl: "Kakovostnejši pogovori se začnejo z boljšimi fotografijami",
  lt: "Kokybiškesni pokalbiai prasideda nuo geresnių nuotraukų",
  lv: "Kvalitatīvākas sarunas sākas ar labākām fotogrāfijām",
  et: "Kvaliteetsemad vestlused algavad parematest fotodest",
  sw: "Mazungumzo bora zaidi huanza na picha bora zaidi",
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

for (const file of readdirSync(translationsDir)) {
  if (!file.endsWith(".ts")) continue;
  const locale = FILE_TO_LOCALE[file];
  const title = MATCH_TITLES[locale];
  if (!title) {
    console.warn(`skip ${file}`);
    continue;
  }

  const path = join(translationsDir, file);
  let content = readFileSync(path, "utf8");

  const replaced = content.replace(
    /(match:\s*\{[\s\S]*?\n\s*title:\s*)".*?"(,\s*\n)/,
    `$1"${escapeForTs(title)}"$2`
  );

  if (replaced === content) {
    console.error(`no match.title found in ${file}`);
    process.exitCode = 1;
    continue;
  }

  writeFileSync(path, replaced);
  console.log(`updated ${file}`);
}

console.log("done");
