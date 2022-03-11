import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { transResources } from "@webest/web-page-monitor-helper";

let initOptions = {
  // next export
  // lng: 'zh',
  resources: transResources,
  fallbackLng: 'en',
  debug: false,
  nsSeparator: false,
  keySeparator: false,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
}
if(process.env.NEXT_PUBLIC_export_lang){
  initOptions.lng = process.env.NEXT_PUBLIC_export_lang;
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(initOptions);

  // console.dir('LGHI18n', i18n)

  export { i18n , i18n as default};