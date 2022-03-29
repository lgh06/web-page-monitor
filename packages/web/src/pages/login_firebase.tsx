// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, getRedirectResult, signInWithRedirect, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { NextPage } from "next/types";
import { useLayoutEffect } from "react";
import { useImmerAtom } from 'jotai/immer';
import { userInfoAtom } from '../atoms';
import { useRouter } from "next/router";
import { fetchAPI, useI18n } from "../helpers";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZ_2m2x3AGyp8M6he_-BdVHky277W2hLA",
  authDomain: "web-page-monitor-345603.firebaseapp.com",
  projectId: "web-page-monitor-345603",
  storageBucket: "web-page-monitor-345603.appspot.com",
  messagingSenderId: "271983568419",
  appId: "1:271983568419:web:5a61dfc524a41d73697396",
  // measurementId: "G-B77PHLPR5S"
};

const LoginFireBasePage: NextPage = () => {
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
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      // const analytics = getAnalytics(app);
  
      const auth = getAuth();
      if(userInfo.email){
  
      }else{
        if(router.query && router.query.provider === 'google'){
          const provider = new GoogleAuthProvider();
          provider.addScope('https://www.googleapis.com/auth/userinfo.email');
          signInWithPopup(auth, provider).then((result) => {
            console.log(result)
            // This gives you a Google Access Token. You can use it to access the Google API.
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
            if(user && user.email && user.emailVerified){
              console.log(user.email)
              saveUserToDB(user.email, 'google')
            }
          }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
          }).finally(()=>{

          });
          
        }
        if(router.query && router.query.provider === 'github'){
          const provider = new GithubAuthProvider();
          provider.addScope('user:email');

          signInWithPopup(auth, provider).then((result) => {
            console.log(result)
            const user = result.user;
            if(user && user.email){
              console.log(user.email)
              saveUserToDB(user.email, 'github')
            }
          }).catch((error) => {
            // Handle Errors here.
            console.error(error)
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
          }).finally(()=>{
            setUserInfo(v =>{
              // v.processingOauth = false;
            })
          });
        }
      }
    })();

  }, [router]);
  return <>
  </>
}

export default LoginFireBasePage