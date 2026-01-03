import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

// Separate component for access denied to avoid render issues
const AccessDenied: React.FC<{ onRedirect: () => void }> = ({ onRedirect }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    console.log('Starting countdown for access denied redirect');
    
    let timeLeft = 3;
    const countdownInterval = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);
      console.log('Countdown:', timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        console.log('Redirecting to login...');
        onRedirect();
      }
    }, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [onRedirect]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <div className="bg-white rounded-lg p-4 border">
            <p className="text-sm text-gray-500 mb-2">
              Redirecting to login in:
            </p>
            <div className="text-2xl font-bold text-blue-600">
              {countdown}
            </div>
          </div>
          <button 
            onClick={onRedirect}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['super_admin', 'user_admin', 'content_admin'] 
}) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const handleRedirect = () => {
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    handleRedirect();
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return <AccessDenied onRedirect={handleRedirect} />;
  }

  return <>{children}</>;
};