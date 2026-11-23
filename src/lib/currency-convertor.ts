

export const localeToCurrency: Record<string, string> = {
    'en-US': 'USD',
    'en-CA': 'CAD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'en-NZ': 'NZD',
    'de-DE': 'EUR',
    'fr-FR': 'EUR',
    'es-ES': 'EUR',
    'it-IT': 'EUR',
    'nl-NL': 'EUR',
    'pt-PT': 'EUR',
    'ja-JP': 'JPY',
    'ko-KR': 'KRW',
    'zh-CN': 'CNY',
    'zh-TW': 'TWD',
    'zh-HK': 'HKD',
    'hi-IN': 'INR',
    'en-IN': 'INR',
    'ru-RU': 'RUB',
    'pt-BR': 'BRL',
    'es-MX': 'MXN',
    'tr-TR': 'TRY',
    'th-TH': 'THB',
    'vi-VN': 'VND',
    'id-ID': 'IDR',
    'ms-MY': 'MYR',
    'tl-PH': 'PHP',
    'sv-SE': 'SEK',
    'da-DK': 'DKK',
    'no-NO': 'NOK',
    'pl-PL': 'PLN',
    'cs-CZ': 'CZK',
    'hu-HU': 'HUF',
    'ro-RO': 'RON',
    'bg-BG': 'BGN',
    'hr-HR': 'HRK',
    'sk-SK': 'EUR',
    'sl-SI': 'EUR',
    'et-EE': 'EUR',
    'lv-LV': 'EUR',
    'lt-LT': 'EUR',
    'fi-FI': 'EUR',
    'mt-MT': 'EUR',
    'cy-GB': 'GBP',
    'ga-IE': 'EUR',
    'he-IL': 'ILS',
    'ar-SA': 'SAR',
    'ar-AE': 'AED',
    'ar-EG': 'EGP',
    'fa-IR': 'IRR',
    'ur-PK': 'PKR',
    'bn-BD': 'BDT',
    'ne-NP': 'NPR',
    'si-LK': 'LKR',
    'my-MM': 'MMK',
    'km-KH': 'KHR',
    'lo-LA': 'LAK',
    'ka-GE': 'GEL',
    'hy-AM': 'AMD',
    'az-AZ': 'AZN',
    'kk-KZ': 'KZT',
    'ky-KG': 'KGS',
    'tg-TJ': 'TJS',
    'tk-TM': 'TMT',
    'uz-UZ': 'UZS',
    'mn-MN': 'MNT',
    'bo-CN': 'CNY',
    'ug-CN': 'CNY',
    'sw-KE': 'KES',
    'sw-TZ': 'TZS',
    'am-ET': 'ETB',
    'om-ET': 'ETB',
    'so-SO': 'SOS',
    'ar-MA': 'MAD',
    'ar-DZ': 'DZD',
    'ar-TN': 'TND',
    'ar-LY': 'LYD',
    'ar-SD': 'SDG',
    'ha-NG': 'NGN',
    'yo-NG': 'NGN',
    'ig-NG': 'NGN',
    'zu-ZA': 'ZAR',
    'xh-ZA': 'ZAR',
    'af-ZA': 'ZAR'
};

export function CurrencyConvertor(value: number)
{
    try
    {
        const locale = navigator.language
        const currency = localeToCurrency[locale] ?? "INR"
        const formatter = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            currencyDisplay: 'symbol'
        });

        const formattedCurrency = formatter.format(value);
        return formattedCurrency
    } catch (error)
    {
        return "-"
    }
}