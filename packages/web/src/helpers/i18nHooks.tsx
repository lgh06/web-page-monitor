import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'
import Head from 'next/head';

export function useI18n(){
  const { t: originT, i18n } = useTranslation();
  const router = useRouter();
  let { locale, isReady } = router;
  if(!locale && process.env.NEXT_PUBLIC_export_lang){
    locale = Cookies.get('NEXT_LOCALE') || process.env.NEXT_PUBLIC_export_lang;
  }
  if(i18n.language !== locale){
    i18n.changeLanguage(locale);
  }
  let hostName = "";
  if(typeof window !== 'undefined' && window.location && window.location.hostname){
    hostName = window.location.hostname;
  }
  const t = (...args: any[]) => {
    let firstString = args[0];
    // lower case for the english key when translated to Chinese
    if(locale === 'zh' && i18n.language === 'zh'){
      firstString = String(firstString).toLowerCase();
    }
    return originT(firstString, ...args.slice(1));
  }
  
  return { t, i18n, router, locale, isReady, hostName }
}

export function useHeadTitle(titleName = ""){
  const { t, router, locale } = useI18n();
  return (
    <Head>
    <title>{ t(titleName) + ' - ' + t(`Web Site Page Changes Monitor`)}</title>
    </Head>
  )
}