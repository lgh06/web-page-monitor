import React, { useEffect, useRef, useState } from "react";
import config from '../../docusaurus.config';
function ImageChanger(props){
  const { src, title, alt } = props;
  console.log('src', src);
  const [url, setUrl] = useState(null);
  let prefixArr = [
    'https://cdn.jsdelivr.net/gh/lgh06/web-page-monitor@main/packages/doc-n-help-site/static',
    'https://wpmt.cdn.bcebos.com/webpagemonitor_doc_site',
    'https://a-1251786267.file.myqcloud.com/webpagemonitor_doc_site', 
  ];
  const [prefixIndex, setPrefixIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(undefined);
  const imgRef = useRef(null);
  useEffect(()=>{
    console.log(config)
    if(typeof window !== 'undefined'){
      let isLocal = window.location.href.indexOf('localhost') > -1;
      if(isLocal){
        let innerUrl = src;
        if(config.baseUrl){
          if(config.baseUrl.length >=2 && config.baseUrl[config.baseUrl.length - 1] === '/'){
            innerUrl = config.baseUrl.substring(0, config.baseUrl.length - 1) + src;
          }else{
          }
        }else{
        }
        setUrl(innerUrl);
        console.log('url', innerUrl)
      }else{
        if(imgRef.current){
          imgRef.current.onload = function(e){
            setIsSuccess(true);
          }
          imgRef.current.onerror = function(e){
            setIsSuccess(false);
            console.log('inside onerror', imgRef.current.src, url)
            if(String(imgRef.current.src).includes(prefixArr[0]) || String(url).includes(prefixArr[0]) || prefixIndex === 0){
              setPrefixIndex(1);
              setUrl(prefixArr[1] + src);
            }else if(String(imgRef.current.src).includes(prefixArr[1]) || String(url).includes(prefixArr[1]) || prefixIndex === 1){
              setPrefixIndex(2);
              setUrl(prefixArr[2] + src);
            }else{
              // when prefixArr have more elements, we can add more else if here
            }
          };
        }
        if(String(imgRef.current && imgRef.current.src).includes('https://')){
          return;
        }
        let innerUrl = prefixArr[prefixIndex] + src;
        setUrl(innerUrl);
      }
      return () =>{
        if(imgRef.current){
          imgRef.current.onerror = null;
        }
      }
    }

  },[url]);

  useEffect(()=>{
    setIsSuccess(undefined);
    setTimeout(function(){if(isSuccess === undefined)imgRef.current.src=''},3000);
  }, url);

  return <img 
    ref={imgRef}
    src={url}
    title={title}
    alt={alt}
    loading="lazy"
  ></img>

}

export { ImageChanger, ImageChanger as default };