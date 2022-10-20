import { NextPage } from "next/types";
import { ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';
import { useImmerAtom } from 'jotai/immer';
import { useResetAtom } from 'jotai/utils'
import { monacoEditorAtom, redeemInfoAtom, userInfoAtom } from '../../atoms';
import { CronTime } from '@webest/web-page-monitor-helper';
import { fetchAPI, useI18n, innerHTML, verifyJwt, genClassNameAndString, useHeadTitle } from "../../helpers/index";
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
  let headTitle = useHeadTitle('Redeem');

  let copyMail = (mode) => {
    let p;
    if(userInfo.email && typeof window !== 'undefined'){
      p = navigator.clipboard.writeText(userInfo.email)
    }
    if(mode === 1){
      p.then(() => {
        alert(t('Copy email success'));
      }, () => {alert(t('Copy email failed, please select and copy manually.'))})
    }
  }

  useEffect(()=>{
    resetRedeemInfo()
    try {
      if(userInfo.email && typeof window !== 'undefined'){
        window.navigator.clipboard.writeText(userInfo.email)
      }
    } catch (error) {
      console.error(error);
    }
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
    if(redeemInfo.submitting) return;
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
      // wechat minishop pay
      let resp;
      try {
        resp = await fetchAPI('/member/checkWxMiniPay', {
          emailOrComment: userInfo.email,
        });
        console.log(resp)
        if(resp.success && resp.points && resp.email){
          alert(t(`Added points: `) + resp.points + ' ' + t(`for account: `) + resp.email);
        }else{
          if(String(resp.err).toLowerCase().includes("unexpected")){
            alert(t('Please try again 30 seconds later'))
          }else{
            alert(t(resp.err))
          }
        }
      } catch (error) {
        alert(t(`Error: `) + error.message)
      }

    }else if(btnIndex.startsWith('2')){
      let amountStr = btnIndex.substring(1)
      let amountYuan = Number(amountStr);
      // wechat pay
      let resp1;
      resp1 = await fetchAPI('/member/genWxPayQr', {
        email: userInfo.email,
        amountYuan,
      });
      console.log(resp1)
      let { jsonResult } = resp1;
      if(jsonResult && jsonResult.status && jsonResult.status === 'ok'){
        if(jsonResult.info && jsonResult.info.qr){
          if(typeof window !== 'undefined' && window.navigator && window.navigator.userAgent){
            if(String(window.navigator.userAgent).includes('MicroMessenger')){
              window.location.href = jsonResult.info.qr;
            }
          }
          setRedeemInfo(v =>{
            v.wxPayQrUrl = 'https://xorpay.com/qr?data=' + jsonResult.info.qr;
          });
        }
      }

    }else if(btnIndex === '3'){
      // verify coupon code
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
      // coupon code
      return redeemInfo.coupon === ''
    }

    if(btnIndex === '2'){
      // wechat pay
      // TODO
    }
  }
  return (
    <main {...cn('redeem')}>
      {headTitle}
      {
        locale === 'en' && (<div>
          You can find more details of free quota, price and limits at  &nbsp;
          <a href="https://docs.webpagemonitor.net/FAQ/free_quota_and_price/" target="_blank" rel="noopener noreferrer">here</a><br/><br/>
        </div>)
      }
      {
        locale === 'zh' && (<div>
          关于免费点数、价格与使用限制， 参见：&nbsp;
          <a href="https://a-1251786267.file.myqcloud.com/webpagemonitor_doc_site/zh/FAQ/free_quota_and_price/" target="_blank" rel="noopener noreferrer">这里</a><br/><br/>
        </div>)
      }
      <details open={locale === 'zh'? true : null}>
        <summary>{t(`Add points through WeChat Mini Shop`)}</summary>
        <div>
          {t(`This payment method is recommended for people in mainland China`)} , &nbsp;
          10 RMB = 1000 points <br/>
        </div>
        <div>
          1. {t(`Scan below QR code, will open a wechat mini app , then click right bottom circle red button.`)} 
        </div>
        <div {...cn('bold no-select')} style={{margin: '1rem auto'}}>
          2. !!!! {t(`At the bottom comment box, type in your email address:`)} 
          <span {...cn('can-select')} onClick={copyMail}>{userInfo.email}</span>  !!!! &nbsp; &nbsp;
          <button {...cn('copy-mail')} onClick={() => copyMail(1)}>{t(`Copy`)}</button>
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
          <img {...cn('qr')} src="/images/wxmini.jpg" loading="lazy" alt="minishop qr code" title="minishop qr code" />
        </div>
        <div>
          {t(`Notice: `)} <br/>
          {t(`If you paid an order however forgot to comment your email address, or forget step 5 (click check button), we won't deliver your order and please wait a refund, about 7 days. `)} <br/>
          {t(`Contact us though email hnnk@qq.com . ( or phone number: +86-17729721992. (Shanghai Timezone, 10:00 - 18:00 only) )`)} <br/>
          {t(`Please provide email account / pay method / pay time / pay amount / your timezone if you contact us, that will help our checking sooner.`)} <br/>
        </div>
      </details>
      <details open={locale === 'zh'? true : null}>
        <summary>{t(`Add points through WeChat Pay`)}</summary>
        <div>
          {t(`This payment method is recommended for people in mainland China`)} , &nbsp;
          1 RMB = 100 points <br/>
        </div>
        <div>
          <button data-btn-index="22" onClick={handleBtnClick} disabled={btnDisabled(2)}>{t(`Click Here`)} {t(`to pay 2 RMB Yuan`)} </button> &nbsp; &nbsp;
          <button data-btn-index="25" onClick={handleBtnClick} disabled={btnDisabled(2)}>{t(`Click Here`)} {t(`to pay 5 RMB Yuan`)} </button> &nbsp; &nbsp;
          <button data-btn-index="210" onClick={handleBtnClick} disabled={btnDisabled(2)}>{t(`Click Here`)} {t(`to pay 10 RMB Yuan`)} </button> &nbsp; &nbsp;
        </div>
        <div>
          {
            redeemInfo.wxPayQrUrl && <>
              <img {...cn('qr')} src={redeemInfo.wxPayQrUrl} alt="minishop qr code" title="minishop qr code" />
            </>
          }
        </div>
        <div>
          {t(`Notice: `)} <br/>
          {t(`After pay success, please wait 1 minute (avg.) , then go to User Center check if points added.`)} <br/>
          {t(`If your points not added, after payment, more than 1 hour, please let us know.`)} <br/>
          {t(`Contact us though email hnnk@qq.com . ( or phone number: +86-17729721992. (Shanghai Timezone, 10:00 - 18:00 only) )`)} <br/>
          {t(`Please provide email account / pay method / pay time / pay amount / your timezone if you contact us, that will help our checking sooner.`)} <br/>
        </div>
      </details>
      <details open={locale === 'en'? true : null}>
        <summary>{t(`Buy a coupon code through PayPal`)}</summary>
        <div>
          {t(`This payment method is recommended for people outside mainland China.`)} <br/>
          1 US dollar = 500 points <br/>
        </div>
        <div>
          {t(`You can get a coupon code by sending cash to `)}
          <a href="https://www.paypal.com/paypalme/lgh06" target="_blank" rel="noopener noreferrer nofollow">PayPal</a><br/>
          {t(`You should comment your email address while send payments or email us to hnnk@qq.com after paid, then we can send a coupon code to your email, manually.`)} <br/>
        </div>
      </details>
      <details open={locale === 'en'? true : null}>
        <summary>{t(`Add points through a coupon code`)}</summary>
        <div>
          {t(redeemInfo.couponMsg)}:<br/>
          <input
            data-input-index="0"
            value={redeemInfo.coupon}
            onChange={handleInputChange}
          >
          </input>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Link prefetch={false} href="/faq#WhatIsACoupon"><a>{t(`Coupon Code Help in FAQ`)}</a></Link>
        </div>
        <div>
          <button data-btn-index="3" onClick={handleBtnClick} disabled={btnDisabled(3)}>{t('Redeem Now')}</button>
        </div>
        {t(`Contact us though email hnnk@qq.com . ( or phone number: +86-17729721992. (Shanghai Timezone, 10:00 - 18:00 only) )`)} <br/>
        {t(`Please provide email account / pay method / pay time / pay amount / your timezone if you contact us, that will help our checking sooner.`)} <br/>
        <div>
        </div>
      </details>
    </main>
  )
}

export default MemberRedeemPage