import React from 'react';

type styles = {
  [key: string]: string;
}

function genClassString(styles:styles) {
  return (classStr: string) => {
    let arr = String(classStr).trim().split(' ');
    let result = '';
    arr.forEach((v: string) => {
      // if cn('@x'), use original 'xx' as classname.
      if (v.indexOf('@')===0) {
        result += v.substr(1);
      } else {
        // @ts-ignore
        result += styles[v] || '';
      }
      result += ' ';
    });
    return result;
  };
}

function genClassName(styles: styles){
  const cn = genClassString(styles);
  return (classStr: string) => {
    return {
      className: cn(classStr)
    }
  }
}

function genClassNameAndString(styles: styles){
  return [genClassName(styles), genClassString(styles)]
}

const innerHTML = (html: string) => {
  return {
    dangerouslySetInnerHTML: {
      __html: html,
    },
  };
};


export {  innerHTML, genClassString, genClassName, genClassNameAndString };