import i18n from "i18next";
import { initReactI18next } from "react-i18next";

let trans = {
  "Welcome to Here": "欢迎使用网页监控系统",
  "please input a url start with https:// or http://": "请输入以https://或http://开头的网址",
  "URL check passed. ": "URL检查通过",
}

let enTrans = {};
let zhTrans = {};
Object.keys(trans).forEach(v => {
  enTrans[v] = v;
  zhTrans[v] = trans[v];
})

const resources = {
  en: {
    translation: enTrans
  },
  zh: {
    translation: zhTrans
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