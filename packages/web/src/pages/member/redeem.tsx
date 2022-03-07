import { NextPage } from "next/types";
import { ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { useResetAtom } from 'jotai/utils'
import { monacoEditorAtom, redeemInfoAtom, userInfoAtom } from '../../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';
import { fetchAPI, useI18n, innerHTML, verifyJwt } from "../../helpers/index";
import Link from "next/link";
import { ScriptList } from "../../components/scriptList";
import { useRouter } from "next/router";


const MemberRedeemPage: NextPage = () => {
  const [redeemInfo, setRedeemInfo] = useImmerAtom(redeemInfoAtom);
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  const { t, router } = useI18n();
  const resetRedeemInfo = useResetAtom(redeemInfoAtom);

  useEffect(()=>{
    resetRedeemInfo()
  },[router]);

  function handleInputChange(ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    let inputElement = ev.target;
    let index = ev.target.dataset.inputIndex;
    if (index === '0') {
      setRedeemInfo(v => {
        v.coupon = inputElement.value;
      });
    }
  }

  async function handleBtnClick(ev: MouseEvent<HTMLButtonElement> ) {
    ev.preventDefault()
    console.log(redeemInfo.coupon)
    let jwtResult = await verifyJwt(redeemInfo.coupon);
    console.log(jwtResult.payload)
    if (jwtResult.verified && jwtResult.payload.expire >= Date.now()) {
      let resp;
      try {
        resp = await fetchAPI('/member/redeem', {
          redeemInfo: {
            coupon: redeemInfo.coupon
          }
        });
        if(resp && resp.addedPoints){
          alert(t('Points added: ') + resp.addedPoints)
        }else{
          alert(t('Error: ' + resp.err))
        }
      } catch (error) {
        alert(t('Error: ') + error)
      }
    }else{
      alert(t('Coupon invalid. Please try again or contact us.'))
    }
  }
  function btnDisabled(){
    return redeemInfo.coupon === ''
  }
  return (
    <main>
      <div>
        {t(redeemInfo.couponMsg)}:<br/>
        <input
          data-input-index="0"
          value={redeemInfo.coupon}
          onChange={handleInputChange}
        >
        </input>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Link href="/faq#WhatIsACoupon"><a>{t(`Coupon Code Help in FAQ`)}</a></Link>
      </div>
      <div>
        <button data-btn-index="0" onClick={handleBtnClick} disabled={btnDisabled()}>{t('Redeem Now')}</button>
      </div>
    </main>
  )
}

export default MemberRedeemPage