import { useState, useEffect } from 'react';

/**
 * Custom hook for detecting device type and screen size
 * Provides clean separation between mobile and desktop rendering logic
 */
const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1200,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    breakpoint: 'desktop' // 'mobile', 'tablet', 'desktop'
  });

  useEffect(() => {
    const determineDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Check for mobile devices via user agent
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileUA = mobileRegex.test(userAgent);
      
      // Check for tablet specific patterns
      const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;
      const isTabletUA = tabletRegex.test(userAgent);
      
      // Determine device type based on screen width and user agent
      let isMobile, isTablet, isDesktop, breakpoint;
      
      if (width <= 768) {
        isMobile = true;
        isTablet = false;
        isDesktop = false;
        breakpoint = 'mobile';
      } else if (width <= 1024 && (isTabletUA || (width <= 1024 && height <= 1366))) {
        isMobile = false;
        isTablet = true;
        isDesktop = false;
        breakpoint = 'tablet';
      } else {
        isMobile = false;
        isTablet = false;
        isDesktop = true;
        breakpoint = 'desktop';
      }
      
      // Override with user agent detection for mobile devices
      if (isMobileUA && !isTabletUA && width <= 768) {
        isMobile = true;
        isTablet = false;
        isDesktop = false;
        breakpoint = 'mobile';
      }

      return {
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        userAgent,
        breakpoint
      };
    };

    const handleResize = () => {
      setDeviceInfo(determineDevice());
    };

    // Set initial device info
    setDeviceInfo(determineDevice());

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Add orientation change listener for mobile devices
    window.addEventListener('orientationchange', () => {
      // Delay to allow orientation change to complete
      setTimeout(handleResize, 100);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetection;
