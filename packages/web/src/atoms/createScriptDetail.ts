import { atomWithReset } from 'jotai/utils'

let createScriptDetail = {
  // used on create
  alias: (Math.floor(Date.now())).toString(36).toUpperCase(),
  extra: {
  },
  // used on list
  scriptList: [],
  // used on edit
  _id: null,
  // used when readonly
  readonly: false,
}

export const createScriptDetailAtom = atomWithReset(createScriptDetail);
