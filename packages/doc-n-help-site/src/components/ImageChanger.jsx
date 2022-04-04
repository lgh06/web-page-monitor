import React, { useEffect, useRef, useState } from "react";
import config from '../../docusaurus.config';
function ImageChanger(props){
  const { src, title, alt } = props;
  console.log('src', src);
  const [url, setUrl] = useState(null);
  let prefixArr = [
    'https://cdn.jsdelivr.net/gh/lgh06/web-page-monitor@main/packages/doc-n-help-site/static',
    'https://lgh06.github.io/web-page-monitor/packages/doc-n-help-site/static',
    'https://wpmt.cdn.bcebos.com/webpagemonitor_doc_site',
    'https://a-1251786267.file.myqcloud.com/webpagemonitor_doc_site', 
  ];
  const [prefixIndex, setPrefixIndex] = useState(0);
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
            console.log('inside onload', e);
            setIsSuccess(true);
          }
          imgRef.current.onerror = function(e){
            // we cannot get updated React state here, so we use a ref
            setIsSuccess(false);
            let prevSrc = imgRef.current.src;
            console.log('inside onerror', imgRef.current.src)
            // Modify below if you have more CDN servers
            if(String(prevSrc).includes(prefixArr[0])){
              imgRef.current.src = null;
              setPrefixIndex(1);
              setUrl(prefixArr[1] + src);
            }else if(String(prevSrc).includes(prefixArr[1])){
              imgRef.current.src = null;
              setPrefixIndex(2);
              setUrl(prefixArr[2] + src);
            }else if(String(prevSrc).includes(prefixArr[2])){
              imgRef.current.src = null;
              setPrefixIndex(3);
              setUrl(prefixArr[3] + src);
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
    loading="lazy"
  ></img>

}

export { ImageChanger, ImageChanger as default };