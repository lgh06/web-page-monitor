import type { NextPage } from 'next'
import React, { useEffect, } from 'react';
import { useRouter } from 'next/router'
import { useImmerAtom } from 'jotai/immer';


const LoginPage: NextPage = () => {
  
  const router = useRouter();
    return (
      <div>Welcome <br />
      </div>
    )

}

export default LoginPage