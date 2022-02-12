import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Welcome to Here": "Welcome to Web-Page-Monitor",
      "please input a url start with https:// or http://":"please input a url start with https:// or http://",
    }
  },
  zh: {
    translation: {
      "Welcome to Here": "欢迎使用网页监控系统",
      "please input a url start with https:// or http://":"请输入以https://或http://开头的网址",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    nsSeparator: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export { i18n , i18n as default};