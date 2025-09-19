import React, { useState } from 'react';
import useDeviceDetection from '../../hooks/useDeviceDetection';
import './DeviceDebugger.css';

/**
 * DeviceDebugger - Development tool to test and debug device detection
 * Shows current device info and allows manual override for testing
 * Only renders in development environment
 */
const DeviceDebugger = () => {
  const [isVisible, setIsVisible] = useState(false);
  const deviceInfo = useDeviceDetection();

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <button 
        className="device-debugger-toggle"
        onClick={toggleVisibility}
        title="Device Detection Debug Info"
      >
        📱
      </button>
      
      {isVisible && (
        <div className="device-debugger-panel">
          <div className="device-debugger-header">
            <h3>Device Detection Debug</h3>
            <button 
              className="device-debugger-close"
              onClick={toggleVisibility}
            >
              ×
            </button>
          </div>
          
          <div className="device-debugger-content">
            <div className="device-info-section">
              <h4>Current Detection:</h4>
              <ul>
                <li>
                  <strong>Breakpoint:</strong> 
                  <span className={`breakpoint-indicator ${deviceInfo.breakpoint}`}>
                    {deviceInfo.breakpoint}
                  </span>
                </li>
                <li><strong>Is Mobile:</strong> {deviceInfo.isMobile ? '✅' : '❌'}</li>
                <li><strong>Is Tablet:</strong> {deviceInfo.isTablet ? '✅' : '❌'}</li>
                <li><strong>Is Desktop:</strong> {deviceInfo.isDesktop ? '✅' : '❌'}</li>
                <li><strong>Screen Width:</strong> {deviceInfo.screenWidth}px</li>
                <li><strong>Screen Height:</strong> {deviceInfo.screenHeight}px</li>
              </ul>
            </div>
            
            <div className="user-agent-section">
              <h4>User Agent:</h4>
              <div className="user-agent-text">
                {deviceInfo.userAgent}
              </div>
            </div>
            
            <div className="breakpoints-section">
              <h4>Breakpoints:</h4>
              <ul>
                <li><strong>Mobile:</strong> ≤ 768px</li>
                <li><strong>Tablet:</strong> 769px - 1024px</li>
                <li><strong>Desktop:</strong> > 1024px</li>
              </ul>
            </div>
            
            <div className="testing-section">
              <h4>Testing Tips:</h4>
              <ul>
                <li>Use browser dev tools to simulate different devices</li>
                <li>Test orientation changes on mobile devices</li>
                <li>Firefox has a responsive design mode toggle</li>
                <li>Chrome allows custom device dimensions</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceDebugger;
