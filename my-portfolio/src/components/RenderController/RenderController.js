import React from 'react';
import useDeviceDetection from '../../hooks/useDeviceDetection';

/**
 * RenderController - Controls which version of components to render
 * based on device type detection. Provides clean separation between
 * mobile and desktop code for better maintainability.
 */
const RenderController = ({ 
  desktopComponent: DesktopComponent, 
  mobileComponent: MobileComponent,
  tabletComponent: TabletComponent = null,
  ...props 
}) => {
  const { isMobile, isTablet, isDesktop, breakpoint } = useDeviceDetection();

  // Log device detection for debugging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`RenderController: Detected ${breakpoint} device`);
  }

  // Render tablet component if provided and device is tablet
  if (isTablet && TabletComponent) {
    return <TabletComponent {...props} deviceInfo={{ isMobile, isTablet, isDesktop, breakpoint }} />;
  }
  
  // Render mobile component for mobile devices
  if (isMobile && MobileComponent) {
    return <MobileComponent {...props} deviceInfo={{ isMobile, isTablet, isDesktop, breakpoint }} />;
  }
  
  // Default to desktop component
  if (DesktopComponent) {
    return <DesktopComponent {...props} deviceInfo={{ isMobile, isTablet, isDesktop, breakpoint }} />;
  }

  // Fallback if no components provided
  return <div>No component provided for current device type</div>;
};

export default RenderController;
