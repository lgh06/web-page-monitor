// Import the functions you need from the SDKs you need
import { NextPage } from "next/types";
import { useLayoutEffect } from "react";
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';
import { useRouter } from "next/router";
import { fetchAPI, useI18n } from "../helpers";

const LoginCloudBasePage: NextPage = () => {
  const router = useRouter();
  const { t } = useI18n();
  const [userInfo, setUserInfo] = useImmerAtom(userInfoAtom);

  async function saveUserToDB(emailFromFront, oauthProviderFromFront){

    try {
      let resp = await fetchAPI('/user/save',{
        email: emailFromFront,
        oauthProvider: oauthProviderFromFront
      });
      router.replace("/login")
      if(resp.err){
        alert(t(resp.err));
        return;
      }
      // TODO error catch and hint
      let { value: { _id, email, emailState, oauthProvider }, jwtToken } = resp;
      setUserInfo((v) => {
        v.email = email;
        v.emailState = emailState;
        v.logged = true;
        v.oauthProvider = oauthProvider;
        v._id = _id;
        v.jwtToken = jwtToken;
      });
    } catch (error) {
      alert(error)
    }
  }

  useLayoutEffect(()=>{
    (async function aa() {
      console.log('inside LoginCloudBasePage')
    })();
  }, []);
  return <>
  </>
}

export default LoginCloudBasePage