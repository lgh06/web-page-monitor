import { atomWithReset } from 'jotai/utils'

let redeemInfo = {
  coupon: "",
  couponMsg: "Please input a coupon code",
  submitting: false,
}

export const redeemInfoAtom = atomWithReset(redeemInfo);
