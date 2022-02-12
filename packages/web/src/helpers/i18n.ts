import i18n from "i18next";
import { initReactI18next } from "react-i18next";

let en = [
  "Welcome to Here",
  "please input a url start with https:// or http://",
  "URL check passed. ",
]

const resources = {
  en: {
    translation: {
      [en[0]]: en[0],
      [en[1]]: en[1],
      [en[2]]: en[2],
    }
  },
  zh: {
    translation: {
      [en[0]]: "欢迎使用网页监控系统",
      [en[1]]:"请输入以https://或http://开头的网址",
      [en[2]]:"URL检查通过",
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