"use client";

import { auth } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useRouter,useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  
  const bookingNumber = searchParams.get('bookingNumber') || "";


  useEffect(() => {
    if(auth){
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          router.push(`/`)
          if(bookingNumber!==""){claimBooking(bookingNumber)}
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

  useEffect(() => {
    if(searchParams.has('register')){setOnLogin(false)}
  }, [])
  
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

  const claimBooking = async (bookingNumber:string) => {
        
        const res = await fetch(`/api/bookings/${bookingNumber}/claim`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
              uid: auth?.currentUser?auth.currentUser.uid:'test-uid-123'
            }),
        });
  
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
 
  }
    
  return (
    <div className="flex flex-col items-center gap-12 bg-light pt-10 md:pt-0" >
      {!loggedIn && <div className="flex flex-col items-center gap-8 p-8" >
          <div className="flex flex-col items-center gap-4 " >
            <div className="flex flex-col items-center gap-4 mb-8" >
              <span className="text-7xl font-medium" style={{fontFamily:'Harlow'}}>{onPasswordReset?"Reset Password":onLogin?"Log In":"Create an Account"}</span>
              {onLogin && !onPasswordReset && <span className="max-w-[600px] text-[24px] md:text-2xl font-medium" style={{fontFamily:'Harlow'}}>Log in to your account to access exclusive member discounts and thousands of top hotels. Easily manage your bookings and check your Hotel & Spa Resorts Gift Voucher balance. Don't have an account? Register below.</span>}
              {!onLogin && <span className="max-w-[600px] text-[24px] md:text-2xl font-medium" style={{fontFamily:'Harlow'}}>Register for an account to access exclusive member discounts and thousands of top hotels. Easily manage your bookings and check your Hotel & Spa Resorts Gift Voucher balance.</span>}
            </div>
          <div className="flex flex-col items-center gap-4" >

              <Input
                  className="w-[350px] md:w-[500px] border border-accent rounded-xl text-xl"
                  placeholder="email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {!onPasswordReset && (
                <Input
                  className="w-[350px] md:w-[500px] border border-accent rounded-xl text-xl"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}

              {!onPasswordReset && !onLogin && (
                <Input
                  className="w-[350px] md:w-[500px] border border-accent rounded-xl text-xl"
                  type="password"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}

              <Button className="text-lg p-8 w-full bg-accent hover:bg-accent/90 text-xl" onClick={onPasswordReset?resetPassword:onLogin?signIn:register}>{onPasswordReset?"Reset Password":onLogin?"Sign in":"Register"}</Button>

              {errorMessage && <span className="text-[red] max-w-[300px]">{errorMessage}</span>}

              <div className="w-full flex flex-row justify-end items-center gap-8" >
                {/* {!onPasswordReset && <span className=" text-gray-500 cursor-pointer" onClick={()=>setOnLogin(!onLogin)}>Go to {onLogin?"Register":"Login"}</span>} */}
                {onLogin && <span className=" text-accent cursor-pointer font-medium text-lg" onClick={()=>setOnPasswordReset(!onPasswordReset)}>{onPasswordReset?"Back to Login":"Forgotten Password"}</span>}
              </div>

               {!onPasswordReset && <div className="w-full flex items-center gap-2">
                  <div className="w-full h-px bg-primary/50"/>
                  <span className="text-xl text-primary/50">or</span>
                  <div className="w-full h-px bg-primary/50"/>

              </div>}

              {!onPasswordReset && <Button className="w-full bg-primary hover:bg-primary/90 p-8 text-white text-lg" variant="secondary" onClick={googleSignIn}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" >
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
                {`Sign ${onLogin?"in":"up"} With Google`}</Button>}

          </div>
          </div>

        
          {!onPasswordReset && <div className="flex flex-col gap-3 items-center">
              <span className="text-xl font-medium">{onLogin?"Don't have an account?":"Already have an account?"}</span>
              <span className="text-2xl underline font-medium text-accent cursor-pointer" onClick={()=>setOnLogin(!onLogin)}>{onLogin?"Register":"Sign In"}</span>
          </div>}

      </div>}

      {/* {loggedIn && <Button onClick={logOut}>Sign out</Button>} */}

    </div>
  );
}
