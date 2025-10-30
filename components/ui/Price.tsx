"use client";

import { useCurrency } from "../../contexts/CurrencyContext";

interface PriceProps {
  amount: number;
  fromCurrency?: string;
  className?: string;
  showCurrency?: boolean;
}

/**
 * Price Component - Automatically converts and formats prices
 *
 * Amazon-style price display:
 * - Stores all prices in USD (base currency)
 * - Converts on-the-fly based on user's selected currency
 * - Updates automatically when currency changes
 * - Zero re-render overhead with memoized context
 *
 * @param amount - Price in base currency (USD by default)
 * @param fromCurrency - Source currency if not USD (default: 'USD')
 * @param className - Additional CSS classes
 * @param showCurrency - Show currency code (default: false)
 *
 * @example
 * <Price amount={99.99} /> // Shows "S$134.99" if SGD selected
 * <Price amount={99.99} className="text-2xl font-bold" />
 * <Price amount={8312} fromCurrency="INR" /> // Convert from INR to selected currency
 */
export default function Price({
  amount,
  fromCurrency = "USD",
  className = "",
  showCurrency = false,
}: PriceProps) {
  const { formatPrice, currency } = useCurrency();

  const formattedPrice = formatPrice(amount, fromCurrency);

  return (
    <span className={className}>
      {formattedPrice}
      {showCurrency && (
        <span className="ml-1 text-xs opacity-70">{currency}</span>
      )}
    </span>
  );
}

/**
 * PriceRange Component - Display price range with automatic conversion
 *
 * @example
 * <PriceRange min={19.99} max={99.99} />
 */
interface PriceRangeProps {
  min: number;
  max: number;
  fromCurrency?: string;
  className?: string;
}

export function PriceRange({
  min,
  max,
  fromCurrency = "USD",
  className = "",
}: PriceRangeProps) {
  const { formatPrice } = useCurrency();

  return (
    <span className={className}>
      {formatPrice(min, fromCurrency)} - {formatPrice(max, fromCurrency)}
    </span>
  );
}

/**
 * OriginalPrice Component - Strikethrough original price
 * Used for showing discounts
 *
 * @example
 * <OriginalPrice amount={129.99} />
 * <Price amount={99.99} />
 */
interface OriginalPriceProps {
  amount: number;
  fromCurrency?: string;
  className?: string;
}

export function OriginalPrice({
  amount,
  fromCurrency = "USD",
  className = "",
}: OriginalPriceProps) {
  const { formatPrice } = useCurrency();

  return (
    <span className={`line-through opacity-60 ${className}`}>
      {formatPrice(amount, fromCurrency)}
    </span>
  );
}

/**
 * Discount Component - Show discount percentage
 *
 * @example
 * <Discount original={129.99} current={99.99} />
 */
interface DiscountProps {
  original: number;
  current: number;
  className?: string;
}

export function Discount({ original, current, className = "" }: DiscountProps) {
  const discountPercent = Math.round(((original - current) / original) * 100);

  return (
    <span
      className={`bg-red-500 text-white px-2 py-1 rounded text-xs font-bold ${className}`}
    >
      -{discountPercent}%
    </span>
  );
}
