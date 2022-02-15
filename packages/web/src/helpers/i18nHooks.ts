import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export function useI18n(){
  const { t: originT, i18n } = useTranslation();
  const router = useRouter();
  const { locale, isReady } = router;
  if(i18n.language !== locale){
    i18n.changeLanguage(locale);
  }
  const t = (...args: any[]) => {
    let firstString = args[0];
    // lower case for the english key when translated to Chinese
    if(locale === 'zh' && i18n.language === 'zh'){
      firstString = String(firstString).toLowerCase();
    }
    return originT(firstString, ...args.slice(1));
  }
  
  return { t, i18n, router, locale, isReady }
}