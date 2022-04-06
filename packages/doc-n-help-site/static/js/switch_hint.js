(function () {

  function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function bbb() {

    if (typeof window === 'undefined') return;

    var inChina = false;
    var speakChinese = false;

    // timeZone part
    var timeZoneName;
    try {
      timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
    }
    var timeZoneOffset = new Date().getTimezoneOffset();
    var timeZoneHourUTCOffset = timeZoneOffset / -60;
    if (timeZoneHourUTCOffset === 8 && (String(timeZoneName).match(/Shanghai|Macau|Hong_Kong|Urumqi|Beijing|Harbin|Chongqing|/i) || timeZoneName === undefined)) {
      // this user maybe in China
      inChina = true;
    }

    // language part, only for show hint text use, not for redirect
    var language;
    try {
      language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
    } catch (error) {
    }
    var languageList;
    try {
      languageList = navigator.languages;
    } catch (error) {
    }

    if (String(language).includes('zh-CN') || String(language).includes('zh')) {
      // speak chinese only, but maybe both simplified or traditional
      speakChinese = true;
    }
    if (languageList && languageList.length > 1 && String(languageList).includes('zh-CN') || String(languageList).includes('zh')) {
      // maybe a foreigner, but can speak chinese
      speakChinese = true;
    }

    var docSite = {
      cn: ['https://a-1251786267.file.myqcloud.com/webpagemonitor_doc_site/', 'https://wpmt.cdn.bcebos.com/webpagemonitor_doc_site/'],
      global: ['https://docs.webpagemonitor.net/', 'https://webpagemonitor.net/webpagemonitor_doc_site/'],
    }

    var webSite = {
      cn: ['http://monit.or.passby.me/', 'https://monit.or.yanqiankeji.com/',],
      global: ['https://www.webpagemonitor.net/', 'https://webpagemonitor.net/'],
    }

    var nowSite, nowSiteArea;
    if([...docSite.cn, ...docSite.global].find(v => String(window.location.href).includes(v))) {
      nowSite = docSite;
    }else if([...webSite.cn, ...webSite.global].find(v => String(window.location.href).includes(v))){
      nowSite = webSite;
    }
    if(!nowSite) return;

    if([...docSite.cn, ...webSite.cn].find(v => String(window.location.href).includes(v))){
      nowSiteArea = 'cn';
    }else if([...docSite.global, ...webSite.global].find(v => String(window.location.href).includes(v))){
      nowSiteArea = 'global';
    }
    // debug use
    // nowSite = docSite; nowSiteArea = 'cn';
    if (!nowSite || !nowSiteArea) return;

    // url redirect part
    var toUrl = '';
    if (inChina && nowSiteArea === 'global') {
      // this user is in China and visit a site for global, redirect to cn
      toUrl = nowSite.cn[0];
    } else if (!inChina && nowSiteArea === 'cn') {
      // this user is not in China and visit a site for cn, redirect to global
      toUrl = nowSite.global[0];
    }else{
      return;
    }
    var hintText = `<style>
@keyframes hint_animation {
  0%{background-position:10% 0%}
  50%{background-position:91% 100%}
  100%{background-position:10% 0%}
}</style>`;
    if (speakChinese) {
      // this user can speak chinese
      hintText += `您正在浏览的是${nowSiteArea === 'cn' ? '中国' : '全球'}站点，建议切换到
      <a href="${toUrl}" >${nowSiteArea === 'cn' ? '全球' : '中国'}站点</a>
      ，获得更好体验。
      `;
    } else {
      // this user can not speak chinese
      hintText += `You are visiting ${nowSiteArea === 'cn' ? 'China' : 'Global'} site, you can switch to 
      <a href="${toUrl}" >${nowSiteArea === 'cn' ? 'Global' : 'China'} site</a> 
      for better experience.`;
    }
    var hintTextElement = document.createElement('div');
    hintTextElement.className = 'wpmt-doc-global-analyze-hint-text';
    hintTextElement.innerHTML = hintText;
    hintTextElement.style.cssText = `text-align: center;padding: .5rem 0;
background-image: linear-gradient(140deg, #a9b7eb 0%, #fda2a2 50%, #d1f318 75%);
background-size: 200% 200%;
animation: hint_animation 5s ease infinite;`;
    // console.log(inChina, speakChinese, timeZoneName, timeZoneHourUTCOffset, language, languageList, nowSite, nowSiteArea, toUrl, hintText);
    let ele = document.querySelector('#__docusaurus') || document.querySelector('#__next');
    if (ele) {
      ele.insertAdjacentElement('beforebegin', hintTextElement);
    }

  }
  ready(bbb);
})();