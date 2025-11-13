"use client";

import Image from "next/image";

export const AwardSection = () => {
  return (
    <div className="w-full bg-white py-12 md:py-20">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-10 md:gap-12 lg:gap-50 px-5 lg:px-[11%] xl:px-[5.5%] 2xl:px-[7%]">
        {/* Left side - Card image */}
        <div className="flex-shrink-0">
          <div className="relative w-[280px] h-[180px] md:w-[320px] md:h-[200px] transform rotate-[-7deg] hover:rotate-0 transition-transform duration-300">
            <Image
              src="/assets/images/home_gift_section_image.png"
              alt="Hotel & Spa Resorts Card"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 280px, 320px"
            />
          </div>
        </div>

        {/* Right side - Text content */}
        <div className="flex-1 flex flex-col gap-8">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-normal text-primary leading-tight"
            style={{ fontFamily: "Harlow" }}
          >
            BEST NEW LUXURY TRAVEL PLATFORM – EUROPE 2025
          </h2>
          <p className="text-base md:text-lg text-primary leading-relaxed">
            Search above for any destination to unlock 10,000 luxury hotels worldwide. Winner of
            'Best New Luxury Travel Platform Europe 2025' at the Lux Life Travel Awards.
          </p>
        </div>
      </div>
    </div>
  );
};

