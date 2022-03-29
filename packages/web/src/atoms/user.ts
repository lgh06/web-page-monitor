import { atom } from 'jotai'
import { focusAtom } from 'jotai/optics'
import { atomWithStorage } from 'jotai/utils'

let userInfo = {
  _id: '',
  email: undefined,
  // different provider have different emailState
  emailState: '', // like confirmed, unverified, ... 
  code: '',
  oauthProvider: '',
  logged: false,
  jwtToken: '',
  // only used in frontend
  points: 80,
  nextAddPointsTime: Date.now() + 3600 * 1000 * 24 * 31,
  // only used in frontend firebase oauth
  // processingOauth: false,
}

export const userInfoAtom = atomWithStorage('userInfo',userInfo);
