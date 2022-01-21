import { NextRouter } from "next/router";
import { MouseEventHandler } from "react";

export function clickGoBack(router:NextRouter){
  return (e:MouseEvent)=> {
    e.preventDefault();
    router.back();
  }
}