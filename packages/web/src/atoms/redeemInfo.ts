import { atomWithReset } from 'jotai/utils'

let redeemInfo = {
  coupon: "",
  couponMsg: "Please input a coupon code",
}

export const redeemInfoAtom = atomWithReset(redeemInfo);
