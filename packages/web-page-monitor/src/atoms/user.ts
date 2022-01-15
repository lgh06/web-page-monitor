import { Atom, atom, PrimitiveAtom, WritableAtom } from 'jotai'
import { focusAtom } from 'jotai/optics'
import { atomWithStorage } from 'jotai/utils'

const userInfo = {
  email: null,
  emailState: '', // like confirmed, unverified, ... 
  code: '',
  provider: '',
  logged: false,
}

const userInfoA = atomWithStorage('userInfo',userInfo);

// function genFocusAtom(anAtom: WritableAtom<any, never, void | Promise<void>>, propArr: Array<string>){
//   let resultObj: {[key: string]: Atom<any>} = {};
//   propArr.forEach((v: string) => {
//     resultObj[v + 'A'] = focusAtom(anAtom, (o) => o.prop(v))
//   }); 
//   return resultObj;
// }

const emailA = focusAtom(userInfoA, (o) => o.prop('email'))
const emailStateA = focusAtom(userInfoA, (o) => o.prop('emailState'))
const codeA = focusAtom(userInfoA, (o) => o.prop('code'))
const providerA = focusAtom(userInfoA, (o) => o.prop('provider'))
const loggedA = atom((get) => {
  if (get(userInfoA).email) {
    return true; // 只读，不可写，所以无法同步到localStorage内
  }else{
    return false;
  }
})

let userAtoms = {
  userInfoA, 
  emailA,
  emailStateA,
  codeA,
  providerA,
  loggedA,
}

export { userAtoms }
