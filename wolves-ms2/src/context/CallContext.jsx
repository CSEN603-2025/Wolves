import React, { createContext, useContext, useState } from 'react';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const [activeCall, setActiveCall] = useState(null);

  const startCall = (appointmentId) => {
    setActiveCall(appointmentId);
  };

  const endCall = () => {
    setActiveCall(null);
  };

  return (
    <CallContext.Provider value={{ activeCall, startCall, endCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}; 