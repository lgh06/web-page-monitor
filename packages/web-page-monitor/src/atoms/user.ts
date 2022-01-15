import { atom, useAtom } from 'jotai'
import { focusAtom } from 'jotai/optics'
import { useAtomDevtools } from 'jotai/devtools'


const userInfo = {
  email: null,
  confirmed: false,
  code: '',
  provider: '',
  logged: false,
}

const userInfoA = atom(userInfo);

const emailA = focusAtom(userInfoA, (o) => o.prop('email'))
const confirmedA = focusAtom(userInfoA, (o) => o.prop('confirmed'))
const codeA = focusAtom(userInfoA, (o) => o.prop('code'))
const providerA = focusAtom(userInfoA, (o) => o.prop('provider'))
const loggedA = atom((get) => {
  if (get(userInfoA).email) {
    return true
  }else{
    return false;
  }
})


let userAtoms = {
  userInfoA, 
  emailA,
  confirmedA,
  codeA,
  providerA,
  loggedA,
}

export { userAtoms }
