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
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

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

  useEffect(() => {
    setErrorMessage("")
  }, [onLogin,onPasswordReset])
  
  const register = () => {

    if(email === "" || !validateEmail(email)){
      setErrorMessage("Please fill in a valid email");
      return;
    }
    else if(password === ""){
      setErrorMessage("Please fill in a valid password");
      return;
    }
    else if(password.length<6){
      setErrorMessage("Password must be at least 6 characters long");
      return;
    }
    else if(confirmPassword !== password){
      setErrorMessage("Passwords don't match");
      return;
    }

    console.log("REGISTER")


    if(auth){

      setErrorMessage("")

      createUserWithEmailAndPassword(auth,email,password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("USER",user)
        setLoggedIn(true)
        createUserInDB(user.uid,user.email||"")
      })
      .catch((error) => {
        console.log("ERROR",error)
        if(error.message.includes('email-already-in-use')){setErrorMessage("There is already an account with this email address")}
        else{
          setErrorMessage(error.message)
        }
      })
    }
  }



  const signIn = () => {

    if(email === "" || !validateEmail(email)){
      setErrorMessage("Please fill in a valid email");
      return;
    }
    else if(password === ""){
      setErrorMessage("Please fill in a valid password");
      return;
    }
    
    console.log("SIGN IN")

    if (!auth) {
      return;
    }

    setErrorMessage("")

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("USER",userCredential)
        setLoggedIn(true)
      })
      .catch((error) => {
        
        console.log("ERROR",error)

        if(error.message.includes('invalid-credential')){setErrorMessage("These login details do not match any account")}
        else{
          setErrorMessage(error.message)
        }
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

  const validateEmail = (email:string) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
  }
  
  const createUserInDB = async (uid:string,email:string) => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID:uid,email:email }),
      });
  
      if (!res.ok) throw new Error(`Error: ${res.status}`);
  
      const data = await res.json();

    } catch (error) {
      console.error("API POST call failed:", error);
    }
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

              {!onPasswordReset && !onLogin && (
                <Input
                  className="w-[300px]"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}

              <Button className="text-lg p-5" onClick={onPasswordReset?resetPassword:onLogin?signIn:register}>{onPasswordReset?"Reset Password":onLogin?"Login":"Register"}</Button>

              <span className="text-[red] max-w-[300px]">{errorMessage}</span>

              <div className="flex flex-row justify-between items-center gap-8" >
                {!onPasswordReset && <span className=" text-gray-500 cursor-pointer" onClick={()=>setOnLogin(!onLogin)}>Go to {onLogin?"Register":"Login"}</span>}
                {onLogin && <span className=" text-gray-500  cursor-pointer" onClick={()=>setOnPasswordReset(!onPasswordReset)}>{onPasswordReset?"Back to Login":"Forgot Password"}</span>}
              </div>
          </div>

          {!onPasswordReset && <div className="w-full flex items-center gap-2">
              <div className="w-full h-px bg-primary/50"/>
              <span className="text-xl text-primary/50">or</span>
              <div className="w-full h-px bg-primary/50"/>

          </div>}

          {!onPasswordReset && <Button className="bg-accent text-white text-lg" variant="secondary" onClick={googleSignIn}>{`Sign ${onLogin?"in":"up"} With Google`}</Button>}

      </div>}

      {/* {loggedIn && <Button onClick={logOut}>Sign out</Button>} */}

    </div>
  );
}
