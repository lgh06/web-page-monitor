import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { CONFIG } from "../../CONFIG";
import { transResources } from "@webest/web-page-monitor-helper";


i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: transResources,
    fallbackLng: 'en',
    debug: !CONFIG.useProdConfig,
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export { i18n , i18n as default};