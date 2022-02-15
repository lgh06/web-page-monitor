import { atom } from 'jotai'

let createEraserDetail = {
  alias: (Math.floor(Date.now())).toString(36).toUpperCase(),
  extra: {
  },
}

export const createEraserDetailAtom = atom(createEraserDetail);
