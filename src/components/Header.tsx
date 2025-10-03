"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { useEffect, useState } from "react";
import { auth } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const Header = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setLoggedIn(!!user);
      });
      return () => unsubscribe();
    }
  }, [auth]);

  const homeClicked = () => {
    openLink("https://www.hotelandsparesorts.com");
  }

  const loginClicked = () => {
    setShowMobileMenu(false);
    router.push(`/login`);
  }

  const registerClicked = () => {
    router.push(`/login?register=true`);
  }

  const myAccountClicked = () => {
    setShowMobileMenu(false);
    router.push(`/user/my-bookings`);
  }

  const logoutClicked = () => {
    if (auth) {
      signOut(auth);
    }
  }

  const openLink = (url: string) => {
    window.open(url, "_self");
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  }

  return (
    <header className="w-full bg-white font-normal relative">
      {/* Desktop Header */}
      <div className="hidden lg:block w-full">
        {/* Top Bar */}
        <div className="w-full bg-light">
          <div className="max-w-[1688px] mx-auto px-4">
            <div className="flex justify-between items-center py-4 text-sm border-b border-gray-300">
              {/* Left side - Partner Links */}
              <div className="flex items-center gap-2">
                  <button 
                    className="hover:text-accent cursor-pointer transition-colors text-[11px] text-[#333333]"
                    onClick={() => openLink("https://www.hotelandsparesorts.com/partner/login")}
                  >
                    PARTNER SIGN IN
                  </button>
                <span className="text-gray-900 font-thin">|</span>
                <button 
                  className="hover:text-accent cursor-pointer transition-colors text-[11px] text-[#333333]"
                  onClick={() => openLink("https://www.hotelandsparesorts.com/become-partner")}
                >
                  BECOME A PARTNER
                </button>
              </div>

              {/* Right side - Account */}
              <div className="flex items-center gap-4">
                <button 
                  className="flex items-center gap-2 hover:text-accent transition-colors cursor-pointer text-[11px] text-[#333333]" 
                  onClick={loggedIn ? myAccountClicked : loginClicked}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 14.8 15.9"
                    className="h-4 w-4 fill-gray-700"
                  >
                    <circle cx="7.06" cy="3.53" r="3.53" />
                    <path d="M14.12,13.24v.88c0,.49-.4.88-.88.88H.88c-.49,0-.88-.4-.88-.88v-.88c0-2.92,2.37-5.29,5.29-5.29h3.53c2.92,0,5.29,2.37,5.29,5.29Z"/>
                  </svg>
                  <span className="">MY ACCOUNT</span>
                </button>

                {loggedIn && (
                  <button 
                    className="hover:text-accent cursor-pointer transition-colors text-[11px] text-base"
                    onClick={logoutClicked}
                  >
                    LOGOUT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="w-full">
          <div className="max-w-[1688px] mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <img 
                className="h-22.5 cursor-pointer" 
                src='/assets/logo.svg' 
                alt="Hotel & Spa Resorts"
                onClick={homeClicked}
              />
              
              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-5 font-medium">
                <button 
                  className="hover:text-accent cursor-pointer transition-colors text-sm md:text-md lg:text-[17px] text-[#333333]"
                  onClick={() => openLink("/")}
                >
                  BOOK A HOTEL STAY
                </button>
                <div className="h-4 w-px bg-gray-700"/>
                <button 
                  className="hover:text-accent cursor-pointer transition-colors text-sm md:text-md lg:text-[17px] text-[#333333]"
                  onClick={() => openLink("https://www.hotelandsparesorts.com/packages")}
                >
                  BOOK A PACKAGE
                </button>
                <div className="h-4 w-px bg-gray-700"/>
                <button 
                  className="hover:text-accent cursor-pointer transition-colors text-sm md:text-md lg:text-[17px] text-[#333333]"
                  onClick={() => openLink("https://www.hotelandsparesorts.com/how-it-works")}
                >
                  HOW IT WORKS
                </button>
                <div className="h-4 w-px bg-gray-700"/>
                <button 
                  className="hover:text-accent cursor-pointer transition-colors text-sm md:text-md lg:text-[17px] text-[#333333]"
                  onClick={() => openLink("https://www.hotelandsparesorts.com/corporate-gift")}
                >
                  CORPORATE GIFTING
                </button>

                {/* CTA Button */}
                <button
                    className="bg-accent hover:bg-accentDark text-white px-5 py-3 rounded-md transition-colors duration-200 font-medium text-sm md:text-md lg:text-[16px] whitespace-nowrap cursor-pointer"
                    onClick={() => openLink("https://hotelandsparesorts.com/shop-gift-voucher")}
                >
                    BUY A GIFT VOUCHER
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Divider for non-home pages */}
        {pathname !== '/' && (
          <div className="max-w-[1688px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-px w-full bg-primary/20"/>
          </div>
        )}
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden w-full">
        <div className="flex justify-between items-center h-20 pl-4 relative bg-white">
          {/* Mobile Logo */}
          <img 
            className="h-14 cursor-pointer" 
            src='/assets/hotelLogo.png' 
            alt="Hotel & Spa Resorts"
            onClick={homeClicked}
          />
          
          {/* Mobile Menu Button */}
          <button 
            className="w-20 h-full bg-[#774d46] flex justify-center items-center hover:bg-[#6a423c] transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6 fill-white transition-transform duration-300"
              style={{ transform: showMobileMenu ? 'rotate(90deg)' : 'rotate(0deg)' }}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 25.42 18.38"
            >
              <rect fill="white" x=".1" width="25.32" height="2.57"/>
              <rect fill="white" y="7.59" width="25.32" height="2.57"/>
              <rect fill="white" x=".1" y="15.41" width="25.32" height="2.57"/>
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          <div className={`absolute top-full left-0 right-0 bg-[#774d46] z-50 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
            showMobileMenu ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="flex flex-col">
              {/* CTA Button */}
              <button
                className="bg-accent hover:bg-accent/90 text-white font-bold text-lg py-4 mx-4 mt-4 rounded-lg transition-colors"
                onClick={() => {
                  openLink("https://hotelandsparesorts.com/shop-gift-voucher");
                  setShowMobileMenu(false);
                }}
              >
                BUY A GIFT VOUCHER
              </button>
              
              {/* Navigation Links */}
              {[
                { text: 'BOOK A HOTEL STAY', url: '/' },
                { text: 'BOOK A PACKAGE', url: 'https://www.hotelandsparesorts.com/packages' },
                { text: 'HOW IT WORKS', url: 'https://www.hotelandsparesorts.com/how-it-works' },
                { text: 'CORPORATE GIFTING', url: 'https://www.hotelandsparesorts.com/corporate-gift' }
              ].map((item, index) => (
                <div key={index}>
                  <button 
                    className="w-full text-left text-white font-medium text-lg py-4 px-4 hover:bg-accent/20 transition-colors" 
                    onClick={() => {
                      openLink(item.url);
                      setShowMobileMenu(false);
                    }}
                  >
                    {item.text}
                  </button>
                  {index < 3 && <div className="mx-4 h-px bg-accent/30"/>}
                </div>
              ))}
              
              {/* Account Section */}
              <div className="mx-4 h-px bg-accent/30"/>
              <button 
                className="text-left text-white font-medium text-lg py-4 px-4 hover:bg-accent/20 transition-colors" 
                onClick={loggedIn ? myAccountClicked : loginClicked}
              >
                MY ACCOUNT
              </button>
              
              {loggedIn && (
                <>
                  <div className="mx-4 h-px bg-accent/30"/>
                  <button 
                    className="text-left text-white font-medium text-lg py-4 px-4 hover:bg-accent/20 transition-colors" 
                    onClick={() => {
                      logoutClicked();
                      setShowMobileMenu(false);
                    }}
                  >
                    LOG OUT
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}