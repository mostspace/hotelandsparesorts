"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface City {
  name: string;
  image: string;
  link: string;
}

const cities: City[] = [
  { name: "Rome", image: "/assets/images/rome.png", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=Rome&lat=41.8967068&lng=12.4822025&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
  { name: "London", image: "/assets/images/london.jpg", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=London&lat=51.5072178&lng=-0.1275862&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
  { name: "New York", image: "/assets/images/new_york.jpg", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=New%20York&lat=40.7127753&lng=-74.0059728&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
  { name: "Paris", image: "/assets/images/paris.jpg", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=Paris&lat=48.8575475&lng=2.3513765&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
  { name: "Miami", image: "/assets/images/miami.jpg", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=Miami&lat=25.7616798&lng=-80.1917902&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
  { name: "Dublin", image: "/assets/images/dublin.jpg", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=Dublin&lat=53.3498053&lng=-6.2603097&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
  { name: "Sydney", image: "/assets/images/sydney.jpg", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=Sydney&lat=-33.8727409&lng=151.2057136&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
  { name: "Bodrum", image: "/assets/images/bodrum.jpg", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=Bodrum&lat=37.034407&lng=27.43054&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
  { name: "Porto", image: "/assets/images/porto.jpg", link: "https://booking.hotelandsparesorts.com/search?searchID=acbde&location=Porto&lat=41.1579438&lng=-8.629105299999999&rooms=[{%22adults%22:2,%22children%22:0,%22childrenAges%22:[]}]" },
];

export const PopularDestinations = () => {
  // Create duplicated array for seamless infinite scroll: [end, original, start]
  const duplicatedCities = [...cities, ...cities, ...cities];
  const startOffset = cities.length; // Start at the middle set (original cities)
  
  const [currentIndex, setCurrentIndex] = useState(startOffset);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [dragStartX, setDragStartX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [visibleCards, setVisibleCards] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate visible cards and card width based on screen size
  useEffect(() => {
    const updateLayout = () => {
      let cards = 3;
      if (window.innerWidth < 640) {
        cards = 1;
      } else if (window.innerWidth < 1024) {
        cards = 2;
      }
      setVisibleCards(cards);
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  // Update card width when container or visible cards change
  useEffect(() => {
    const updateCardWidth = () => {
      if (containerRef.current) {
        // Get the parent flex container (the right column)
        const rightColumn = containerRef.current.parentElement;
        if (rightColumn) {
          const isMobile = window.innerWidth < 640;
          const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
          
          // Use the full width of the right column for larger cards
          const columnWidth = rightColumn.offsetWidth;
          const gap = 16; // Reduced gap for larger cards
          const totalGaps = (visibleCards - 1) * gap;
          
          // On mobile, use full width without multiplier, on larger screens use multiplier
          let availableWidth = columnWidth;
          if (isMobile) {
            // On mobile, account for padding and use full available width
            availableWidth = columnWidth * 0.95;
          } else if (isTablet) {
            availableWidth = columnWidth * 0.96;
          } else {
            availableWidth = columnWidth * 0.98;
          }
          
          const baseWidth = (availableWidth - totalGaps) / visibleCards;
          
          // Only apply multiplier on larger screens
          const calculatedWidth = isMobile ? baseWidth : baseWidth * 1.2;
          setCardWidth(calculatedWidth);
          
          // Calculate container width for responsive sizing
          const calculatedContainerWidth = calculatedWidth * visibleCards + totalGaps;
          const maxContainerWidth = isMobile ? Math.min(calculatedContainerWidth, window.innerWidth - 40) : calculatedContainerWidth;
          setContainerWidth(maxContainerWidth);
        }
      }
    };

    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateCardWidth, 0);
    window.addEventListener("resize", updateCardWidth);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateCardWidth);
    };
  }, [visibleCards]);

  const maxIndex = duplicatedCities.length - visibleCards;
  const realMaxIndex = cities.length - visibleCards;

  // Handle seamless loop jump
  const handleSeamlessJump = (targetIndex: number) => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Wait for transition to complete, then jump seamlessly
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setCurrentIndex(targetIndex);
      // Re-enable transitions after a brief moment
      setTimeout(() => {
        setIsTransitioning(true);
      }, 10);
    }, 500); // Match transition duration (0.5s)
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev - 1;
      
      // If we're going before the start of the middle set, jump to the end of the last set
      if (newIndex < startOffset) {
        handleSeamlessJump(startOffset + realMaxIndex);
        return newIndex;
      }
      
      return newIndex;
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      const newIndex = prev + 1;
      const endOfMiddleSet = startOffset + realMaxIndex;
      
      // If we're going past the end of the middle set, jump to the start of the first set
      if (newIndex > endOfMiddleSet) {
        handleSeamlessJump(startOffset);
        return newIndex;
      }
      
      return newIndex;
    });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX);
    setDragStartX(e.pageX);
    setTranslateX(currentIndex * (cardWidth + 16));
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dragDistance = Math.abs(e.pageX - dragStartX);
    setIsDragging(false);
    
    // If drag distance is small, treat it as a click
    if (dragDistance < 5 && cardWidth > 0) {
      // Find which card was clicked
      const cardWithGap = cardWidth + 16;
      const clickX = e.pageX - (containerRef.current?.getBoundingClientRect().left || 0);
      const clickedIndex = Math.floor((clickX + translateX) / cardWithGap);
      
      // Get the actual city from the duplicated array
      if (clickedIndex >= 0 && clickedIndex < duplicatedCities.length) {
        const clickedCity = duplicatedCities[clickedIndex];
        if (clickedCity.link) {
          window.location.href = clickedCity.link;
          return;
        }
      }
    }
    
    // Snap to nearest card
    if (carouselRef.current && cardWidth > 0) {
      const currentTranslate = translateX;
      const cardWithGap = cardWidth + 16;
      let newIndex = Math.round(currentTranslate / cardWithGap);
      
      // Handle seamless looping for drag
      const endOfMiddleSet = startOffset + realMaxIndex;
      if (newIndex < startOffset) {
        newIndex = startOffset + realMaxIndex;
      } else if (newIndex > endOfMiddleSet) {
        newIndex = startOffset;
      }
      
      setCurrentIndex(newIndex);
      setTranslateX(newIndex * cardWithGap);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current || cardWidth === 0) return;
    e.preventDefault();
    const deltaX = e.pageX - startX;
    const gap = 16;
    const baseTranslate = currentIndex * (cardWidth + gap);
    const newTranslate = baseTranslate - deltaX;
    
    // Allow dragging beyond bounds for seamless feel
    setTranslateX(newTranslate);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current || cardWidth === 0) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setDragStartX(e.touches[0].pageX);
    const gap = 16;
    const currentTranslate = currentIndex * (cardWidth + gap);
    setTranslateX(currentTranslate);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current || cardWidth === 0) return;
    
    // Prevent default to avoid page scrolling
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.touches[0].pageX - startX;
    const gap = 16;
    const baseTranslate = currentIndex * (cardWidth + gap);
    const newTranslate = baseTranslate - deltaX;
    
    // Allow dragging beyond bounds for seamless feel
    setTranslateX(newTranslate);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touchEndX = e.changedTouches[0].pageX;
    const dragDistance = Math.abs(touchEndX - dragStartX);
    setIsDragging(false);
    
    // If drag distance is small, treat it as a tap/click
    if (dragDistance < 10 && cardWidth > 0 && containerRef.current) {
      // Find which card was tapped
      const gap = 16;
      const cardWithGap = cardWidth + gap;
      const containerRect = containerRef.current.getBoundingClientRect();
      const tapX = touchEndX - containerRect.left;
      const clickedIndex = Math.floor((tapX + translateX) / cardWithGap);
      
      // Get the actual city from the duplicated array
      if (clickedIndex >= 0 && clickedIndex < duplicatedCities.length) {
        const clickedCity = duplicatedCities[clickedIndex];
        if (clickedCity.link) {
          window.location.href = clickedCity.link;
          return;
        }
      }
    }
    
    // Snap to nearest card
    if (carouselRef.current && cardWidth > 0) {
      const gap = 16;
      const cardWithGap = cardWidth + gap;
      const currentTranslate = translateX;
      
      // Calculate velocity for better snap behavior
      const deltaX = touchEndX - startX;
      const velocity = Math.abs(deltaX);
      
      // Determine direction and calculate new index
      let newIndex: number;
      if (Math.abs(deltaX) > cardWidth * 0.3 || velocity > 50) {
        // Swipe threshold - move to next/previous card
        newIndex = deltaX > 0 ? currentIndex - 1 : currentIndex + 1;
      } else {
        // Small movement - snap to nearest
        newIndex = Math.round(currentTranslate / cardWithGap);
      }
      
      // Handle seamless looping
      const endOfMiddleSet = startOffset + realMaxIndex;
      if (newIndex < startOffset) {
        newIndex = startOffset + realMaxIndex;
      } else if (newIndex > endOfMiddleSet) {
        newIndex = startOffset;
      }
      
      setCurrentIndex(newIndex);
      setTranslateX(newIndex * cardWithGap);
    }
  };

  // Initialize translateX when cardWidth is first calculated
  useEffect(() => {
    if (cardWidth > 0 && translateX === 0 && currentIndex === startOffset) {
      const gap = 16;
      setTranslateX(startOffset * (cardWidth + gap));
    }
  }, [cardWidth, startOffset]);

  // Update translateX when currentIndex changes (button clicks)
  useEffect(() => {
    if (!isDragging && cardWidth > 0) {
      setTranslateX(currentIndex * (cardWidth + 16));
    }
  }, [currentIndex, cardWidth, isDragging]);

  return (
    <div className="w-full flex gap-10 bg-muted py-16 md:py-20 overflow-hidden">
      <div className="w-full flex flex-col md:flex-row pl-5 lg:pl-[11%] xl:pl-[5.5%] 2xl:pl-[7%] gap-8 md:gap-20">
        <div className="flex-1 md:max-w-[30%] place-self-center">
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-normal mb-6 text-primary leading-tight"
            style={{ fontFamily: "Harlow" }}
          >
            <span className="block">DISCOVER</span>
            <span className="block">LUXURY</span>
            <span className="block">DESTINATIONS</span>
          </h2>
          <p className="text-base md:text-lg text-primary leading-relaxed">
            From romantic spa retreats in Ireland to world-class resorts abroad, explore our amazing collection of luxury hotels and spas.
            Whether you dream of a countryside escape, a chic city break, or a far-flung getaway, your perfect stay awaits.
          </p>
        </div>

        <div className="flex-1 md:max-w-[70%] w-full">

          <div className="flex justify-end px-5 md:px-0 md:mr-28 pb-10">
            <div className="flex items-center gap-4 md:mt-0">
              <button
                onClick={goToPrevious}
                className="w-12 h-12 rounded-full border border-accent flex items-center justify-center transition-all duration-300 hover:opacity-70 cursor-pointer bg-transparent"
                aria-label="Previous destinations"
                style={{ borderWidth: '1px' }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-accent"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full border border-accent flex items-center justify-center transition-all duration-300 hover:opacity-70 cursor-pointer bg-transparent"
                aria-label="Next destinations"
                style={{ borderWidth: '1px' }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-accent"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div
            ref={containerRef}
            className="relative overflow-hidden w-full touch-pan-x"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
              WebkitUserSelect: "none",
              touchAction: "none",
              width: containerWidth > 0 ? `${containerWidth}px` : "100%",
              maxWidth: "100%",
            }}
          >
            <div
              ref={carouselRef}
              className="flex gap-4"
              style={{
                transform: `translateX(-${translateX}px)`,
                transition: isDragging || !isTransitioning ? "none" : "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {duplicatedCities.map((city, index) => (
                <div
                  key={`${city.name}-${index}`}
                  className="flex-shrink-0 relative group cursor-pointer"
                  style={{
                    width: cardWidth > 0 ? `${cardWidth}px` : "100%",
                  }}
                  onClick={(e) => {
                    // Only handle click if not dragging
                    if (!isDragging && city.link) {
                      window.location.href = city.link;
                    }
                  }}
                >
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3
                        className="text-3xl md:text-4xl font-normal text-light"
                        style={{ fontFamily: "Harlow" }}
                      >
                        {city.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};