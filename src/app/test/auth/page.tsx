"use client";

import { auth } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";


export default function AuthTestPage() {

  const [loggedIn, setLoggedIn] = useState<any>(false);
  const [onLogin, setOnLogin] = useState<any>(false);
  const [onPasswordReset, setOnPasswordReset] = useState<any>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const providerGoogle = new GoogleAuthProvider();

  
  const register = () => {

    console.log("REGISTER")


    if(auth){

      createUserWithEmailAndPassword(auth,email,password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("USER",user)
        setLoggedIn(true)
      })
      .catch((error) => {
        console.log("ERROR",error)
      })
    }
  }



  const signIn = () => {

    console.log("SIGN IN")

    if (!auth) {
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("USER",userCredential)
        setLoggedIn(true)
      })
      .catch((error) => {
        
        console.log("ERROR",error)
      });
  };

  

  const resetPassword = () => {

    console.log("RESET PASSWORD")


    if (auth) {
     
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setEmail("");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("ERROR",errorCode)
      });

    }
  };

  const googleSignIn = () => {

    console.log("GOOGLE SIGN IN")


    if (!auth) {
      return;
    }

    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        const user = result.user;
        console.log("USER",user)
        setLoggedIn(true)
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("ERROR",error)
      });
  };

  const logOut = async () => {
    if (!auth) return;
    await signOut(auth);
    setLoggedIn(false);
  }
  
    
  return (
    <div className="flex flex-col items-center gap-12" >
      
      <span>AUTH PAGE</span>

      {!loggedIn && <div className="flex flex-col items-center gap-8" >
    
          <div className="flex flex-col items-center gap-4" >
              <span className="text-xl">{onPasswordReset?"Reset Password":onLogin?"Login":"Register"}</span>

              <Input
                className="auth-input responsive-auth-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />


              {!onPasswordReset && !onLogin && (
                <Input
                  className="auth-input responsive-auth-input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              

              <Button onClick={onPasswordReset?resetPassword:onLogin?signIn:register}>{onPasswordReset?"Reset Password":onLogin?"Login":"Register"}</Button>

              <div className="flex flex-row justify-between items-center gap-8" >
                {!onPasswordReset && <span className="text-xs text-gray-500" onClick={()=>setOnLogin(!onLogin)}>Go to {onLogin?"Register":"Login"}</span>}
                {onLogin && <span className="text-xs text-gray-500" onClick={()=>setOnPasswordReset(!onPasswordReset)}>{onPasswordReset?"Back to Login":"Forgot Password"}</span>}
              </div>
          </div>

          {!onPasswordReset && <Button variant="secondary" onClick={googleSignIn}>Sign in With Google</Button>}
      </div>}

      {loggedIn && <Button onClick={logOut}>Sign out</Button>}

    </div>
  );
}
