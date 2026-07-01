import { NextRequest, NextResponse } from "next/server";
import { getClientCountry } from "@/lib/client-country";
import {
  BASE_PRICE_USD,
  getLocalizedPrice,
  isCheckoutBlocked,
  TIER_PRICES_USD,
} from "@/lib/stripe-pricing";

export async function GET(request: NextRequest) {
  const country = getClientCountry(request);
  const blocked = isCheckoutBlocked(country);
  const pricing = getLocalizedPrice(country);

  return NextResponse.json({
    country,
    blocked,
    basePriceUsd: BASE_PRICE_USD,
    tierPricesUsd: TIER_PRICES_USD,
    ...pricing,
  });
}
