type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'it';
type CountryCode = 'us' | 'es' | 'fr' | 'de' | 'it';
type CultureCode = `${LanguageCode}-${Uppercase<CountryCode>}`;
