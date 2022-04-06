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
    if (timeZoneHourUTCOffset === 8 && (String(timeZoneName).match(/Shanghai|Chongqing|Beijing|Urumqi|Harbin|Wulumuqi|/i) || timeZoneName === undefined)) {
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
      global: ['https://www.webpagemonitor.net/'],
    }

    var nowSite, nowSiteArea;
    // if(JSON.stringify(docSite).includes(window.location.hostname)){
    //   nowSite = docSite;
    // }else if(JSON.stringify(webSite).includes(window.location.hostname)){
    //   nowSite = webSite;
    // }
    // if(!nowSite) return;

    // if(String([...docSite.cn, ...webSite.cn]).includes(window.location.hostname)){
    //   nowSiteArea = 'cn';
    // }else if(String([...docSite.global, ...webSite.global]).includes(window.location.hostname)){
    //   nowSiteArea = 'global';
    // }
    nowSite = docSite; nowSiteArea = 'global';
    if (!nowSite || !nowSiteArea) return;

    // url redirect part
    var toUrl = '';
    if (inChina && nowSiteArea === 'global') {
      // this user is in China and visit a site for global, redirect to cn
      toUrl = nowSite.cn[0];
    } else if (!inChina && nowSiteArea === 'cn') {
      // this user is not in China and visit a site for cn, redirect to global
      toUrl = nowSite.global[0];
    }


    var hintText = '';
    if (speakChinese) {
      // this user can speak chinese
      hintText = `您正在浏览的是${nowSiteArea === 'cn' ? '中国' : '全球'}站点，建议切换到
    <a href="${toUrl}" >${nowSiteArea === 'cn' ? '全球' : '中国'}站点</a>
    ，获得更好体验。`;
    } else {
      // this user can not speak chinese
      hintText = `You are visiting ${nowSiteArea === 'cn' ? 'China' : 'Global'} site, you can switch to ${nowSiteArea === 'cn' ? 'Global' : 'China'} site for better experience.`;
    }

    var hintTextElement = document.createElement('div');
    hintTextElement.className = 'wpmt-doc-global-analyze-hint-text';
    hintTextElement.innerHTML = hintText;
    hintTextElement.style.cssText = `text-align: center;`
    let ele = document.querySelector('#__docusaurus') || document.querySelector('#__next');
    if (ele) {
      ele.insertAdjacentElement('beforebegin', hintTextElement);
    }

  }

  ready(bbb);

})();