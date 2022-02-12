import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export function useI18n(){
  const { t, i18n } = useTranslation();
  const { locale, isReady } = useRouter();
  i18n.changeLanguage(locale);
  
  return { t, i18n, locale, isReady }
}