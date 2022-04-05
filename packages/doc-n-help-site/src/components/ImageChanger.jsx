import React, { useEffect, useRef, useState } from "react";
import useBaseUrl from '@docusaurus/useBaseUrl';
function ImageChanger(props){
  const { src, title, alt, style } = props;
  console.log('src', src);
  let baseUrl = useBaseUrl('/');
  console.log(baseUrl);
  const [url, setUrl] = useState(null);
  let prefixArr = [
    'https://cdn.jsdelivr.net/gh/lgh06/web-page-monitor@main/packages/doc-n-help-site/static',
    'https://lgh06.github.io/web-page-monitor/packages/doc-n-help-site/static',
    // cloudflare pages, static html build output, need npm script to update
    'https://docs.webpagemonitor.net',
    // baidu cloud storage, static html build output
    'https://wpmt.cdn.bcebos.com/webpagemonitor_doc_site',
    // tencent cloud storage , static html build output
    'https://a-1251786267.file.myqcloud.com/webpagemonitor_doc_site', 
  ];
  const [isSuccess, _setIsSuccess] = useState(undefined);
  const isSuccessRef = React.useRef(isSuccess);
  const setIsSuccess = (data) => {
    isSuccessRef.current = data;
    _setIsSuccess(data);
  };

  const imgRef = useRef(null);
  useEffect(()=>{
    if(typeof window !== 'undefined'){
      let isLocal = window.location.href.indexOf('localhost') > -1;
      let notChangePathDomainArr = [
        '.pages.dev',
      ];
      if( (isLocal || notChangePathDomainArr.find(v => window.location.href.indexOf(v) > -1)) ){
        let innerUrl = src;
        if(baseUrl){
          if(baseUrl.length >=2 && baseUrl[baseUrl.length - 1] === '/'){
            innerUrl = baseUrl.substring(0, baseUrl.length - 1) + src;
          }else{
          }
        }else{
        }
        setUrl(innerUrl);
        console.log('url', innerUrl)
      }else{
        if(imgRef.current){
          imgRef.current.onload = function(e){
            console.log('inside onload', e);
            setIsSuccess(true);
          }
          imgRef.current.onerror = function(e){
            // we cannot get updated React state here, so we use a ref
            setIsSuccess(false);
            let prevSrc = imgRef.current.src;
            console.log('inside onerror', imgRef.current.src)

            let alreadyMatched = false;
            prefixArr.forEach((v, i) => {
              if(alreadyMatched) return;
              if(i === prefixArr.length - 1){
                // no more src url
                return;
              }
              if( String(prevSrc).includes(new URL(v).hostname) ){
                alreadyMatched = true;
                imgRef.current.src = null;
                if(prefixArr[i + 1].includes('bcebos.com')){
                  setUrl(prefixArr[i + 1] + src + '?x-bce-process=style/st1');
                }else{
                  setUrl(prefixArr[i + 1] + src);
                }
              }
            });
          };
        }
        if(String(imgRef.current && imgRef.current.src).includes('https://')){
          return;
        }
        let innerUrl = prefixArr[0] + src;
        setUrl(innerUrl);
      }
      return () =>{
        if(imgRef.current){
          imgRef.current.onerror = null;
        }
      }
    }

  },[]);

  useEffect(()=>{
    console.log('url in a useEffect', url)
    if(url === '' || url === null) return false;
    if(typeof window !== 'undefined' 
        && imgRef && imgRef.current 
        && (imgRef.current.src === '' || imgRef.current.src === null  || imgRef.current.src === window.location.href)){
      return false;
    }
    setIsSuccess(undefined);
    setTimeout(function(){if(isSuccessRef.current === undefined)imgRef.current.onerror()},5000);
  }, [url]);

  return <img 
    ref={imgRef}
    src={url}
    title={title}
    alt={alt}
    style={{...style, display: 'block', maxWidth: '100%', maxHeight: '100%'}}
    // loading="lazy"
  ></img>

}

export { ImageChanger, ImageChanger as default };