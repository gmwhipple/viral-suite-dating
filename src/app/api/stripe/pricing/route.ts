import { NextRequest, NextResponse } from "next/server";
import { getClientCountry } from "@/lib/client-country";
import { detectServerLocale, normalizeLocaleTag } from "@/lib/i18n/locale-detection";
import {
  BASE_PRICE_USD,
  getLocalizedPhotographerPrice,
  getLocalizedPrice,
  isCheckoutBlocked,
  TIER_PRICES_USD,
} from "@/lib/stripe-pricing";

export async function GET(request: NextRequest) {
  const geoCountry = getClientCountry(request);
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale =
    (localeParam ? normalizeLocaleTag(localeParam) : null) ??
    detectServerLocale(request.headers.get("accept-language"));

  const preferLocale = Boolean(localeParam);
  const blocked = isCheckoutBlocked(geoCountry);
  const pricing = getLocalizedPrice(geoCountry, locale, { preferLocale });
  const photographer = getLocalizedPhotographerPrice(geoCountry, locale, { preferLocale });

  return NextResponse.json({
    country: geoCountry,
    locale,
    blocked,
    basePriceUsd: BASE_PRICE_USD,
    tierPricesUsd: TIER_PRICES_USD,
    photographerAmount: photographer.amount,
    photographerLabel: photographer.label,
    photographerUsd: photographer.amountUsd,
    ...pricing,
  });
}
