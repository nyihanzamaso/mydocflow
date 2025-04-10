// src/components/auth/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Adjust this path if your context is elsewhere!
import { Loader, Center } from '@mantine/core';      // For loading indicator

const ProtectedRoute = ({ children }) => {
  // Get user state and loading status from your Authentication Context
  // Ensure your AuthContext provides 'user' (or similar) and 'isLoading'
  const { user, isLoading } = useAuth();
  const location = useLocation(); // Get the current location

  // 1. Handle Loading State:
  // If authentication status is still being determined, show a loading indicator.
  // This prevents briefly showing the login page if the user is actually logged in.
  if (isLoading) {
    return (
      <Center style={{ height: '100vh', width: '100%' }}>
        <Loader color="teal" />
      </Center>
    );
  }

  // 2. Handle Not Authenticated State:
  // If loading is finished and there's no user, redirect to the login page.
  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in the state. This allows us to send them back after login.
    // 'replace' prevents adding the protected route to the history stack.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Handle Authenticated State:
  // If loading is finished and the user exists, render the child component (the actual protected page).
  return children;
};

export default ProtectedRoute;