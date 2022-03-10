import { NextPage } from "next/types";
import { ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { useResetAtom } from 'jotai/utils'
import { monacoEditorAtom, redeemInfoAtom, userInfoAtom } from '../../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';
import { fetchAPI, useI18n, innerHTML, verifyJwt, genClassNameAndString } from "../../helpers/index";
import Link from "next/link";
import { ScriptList } from "../../components/scriptList";
import { useRouter } from "next/router";
import styles from "../../styles/modules/redeem.module.scss";

const [cn,cs] = genClassNameAndString(styles);

const MemberRedeemPage: NextPage = () => {
  const [redeemInfo, setRedeemInfo] = useImmerAtom(redeemInfoAtom);
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);
  const { t, router, locale } = useI18n();
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
    let btnElement = ev.target as HTMLButtonElement;
    let btnIndex = btnElement.dataset.btnIndex;
    console.log(btnIndex)

    setRedeemInfo(v =>{
      v.submitting = true;
    });
    setTimeout(() =>{
      setRedeemInfo(v =>{
        v.submitting = false;
      });    
    }, 1000 * 10)

    // return;
    if(btnIndex === '1'){
      let resp;
      try {
        resp = await fetchAPI('/member/checkWxMiniPay', {
          emailOrComment: userInfo.email,
        });
        console.log(resp)
        if(resp.success && resp.points && resp.email){
          alert(t(`Added points: `) + resp.points + ' ' + t(`for account: `) + resp.email);
        }else{
          alert(t(resp.err))
        }
      } catch (error) {
        alert(t(`Error: `) + error.message)
      }

    }else if(btnIndex === '3'){
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

  }
  function btnDisabled(btnIndex){
    if(redeemInfo.submitting){
      return true;
    }
    if(btnIndex === '3'){
      return redeemInfo.coupon === ''
    }
  }
  return (
    <main {...cn('redeem')}>
      <details open={locale === 'zh'? true : null}>
        <summary>{t(`Add points through WeChat`)}</summary>
        <div>
          {t(`This payment method is recommended for people in mainland China`)} , &nbsp;
          {t(`and who use a mobile phone`)}  ({t(`also suitable for PC users`)}) <br/>
          10 RMB = 1000 points <br/>
        </div>
        <div>
          1. {t(`Scan below QR code, will open a wechat mini app , then click right bottom circle red button.`)} 
        </div>
        <div {...cn('bold')} style={{margin: '1rem auto'}}>
          2. !!!! {t(`At the bottom comment box, type in your email address:`)} {userInfo.email}  !!!!
        </div>
        <div>
          3. {t(`Fill in a whatever address, and whatever mobile number , in mainland China.`)} <br/>
          &nbsp; &nbsp; {t(`This address and mobile number is required by WeChat, you can fill anything, it doesn't matter.`)}
        </div>
        <div>
          4. {t(`Pay that order`)}
        </div>
        <div {...cn('bold')}>
          5. !!!!{t(`Back to current page, Click this button after payment:`)}!!!!  &nbsp;
          <button data-btn-index="1" onClick={handleBtnClick} disabled={btnDisabled(1)}>{t(`Check Payment Status`)}</button>  
        </div>
        <div>
          <img {...cn('qr')} src="/images/wxmini.jpg" alt="minishop qr code" title="minishop qr code" />
        </div>
      </details>
      <details open={locale === 'en'? true : null}>
        <summary>{t(`Add points through PayPal`)}</summary>
        <div>
          {t(`This payment method is recommended for people outside mainland China.`)} <br/>
          1 US dollar = 600 points <br/>
        </div>
        <div>
          {t(`You can get a coupon code by sending cash to `)}
          <a href="https://www.paypal.com/paypalme/lgh06" target="_blank" rel="noopener noreferrer">PayPal</a><br/>
          {t(`You should comment your email address while send payments or email us to hnnk@qq.com after paid, then we send coupon code to your email , manually.`)} <br/>
        </div>
      </details>
      <details>
        <summary>{t(`Add points through a coupon code`)}</summary>
        <div>
          {t(`This payment method is recommended for people outside mainland China.`)} <br/>
          1 US dollar = 600 points <br/>

        </div>
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
          <button data-btn-index="3" onClick={handleBtnClick} disabled={btnDisabled(3)}>{t('Redeem Now')}</button>
        </div>
        <div>
        </div>
      </details>
    </main>
  )
}

export default MemberRedeemPage