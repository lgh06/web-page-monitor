import { atom } from 'jotai'

let createEraserDetail = {
  // used on create
  alias: (Math.floor(Date.now())).toString(36).toUpperCase(),
  extra: {
  },
  // used on list
  eraserList: [],
}

export const createEraserDetailAtom = atom(createEraserDetail);
