"use client";

import { auth } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function LoginPage() {

  const [loggedIn, setLoggedIn] = useState<any>(false);
  const [onLogin, setOnLogin] = useState<any>(true);
  const [onPasswordReset, setOnPasswordReset] = useState<any>(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const providerGoogle = new GoogleAuthProvider();

  const router = useRouter();
  

  useEffect(() => {
    if(auth){
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.push(`/home`)
        }
        else {

        }
      })
      return () => unsubscribe();
    }
  }, [auth]);// eslint-disable-line react-hooks/exhaustive-deps

  
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
      

      {!loggedIn && <div className="flex flex-col items-center gap-8 p-8" >
    
          <div className="flex flex-col items-center gap-4" >
              <span className="text-3xl font-medium">{onPasswordReset?"Reset Password":onLogin?"Login":"Register"}</span>

              <Input
                  className="w-[300px]"
                  placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {!onPasswordReset && (
                <Input
                  className="w-[300px]"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
              <Button className="text-lg p-5" onClick={onPasswordReset?resetPassword:onLogin?signIn:register}>{onPasswordReset?"Reset Password":onLogin?"Login":"Register"}</Button>

              <div className="flex flex-row justify-between items-center gap-8" >
                {!onPasswordReset && <span className=" text-gray-500 cursor-pointer" onClick={()=>setOnLogin(!onLogin)}>Go to {onLogin?"Register":"Login"}</span>}
                {onLogin && <span className=" text-gray-500  cursor-pointer" onClick={()=>setOnPasswordReset(!onPasswordReset)}>{onPasswordReset?"Back to Login":"Forgot Password"}</span>}
              </div>
          </div>

          {!onPasswordReset && <Button className="bg-accent text-white text-lg" variant="secondary" onClick={googleSignIn}>Sign in With Google</Button>}
      </div>}

      {loggedIn && <Button onClick={logOut}>Sign out</Button>}

    </div>
  );
}
