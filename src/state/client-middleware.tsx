"use client";

import { useLocation, useNavigate } from 'react-router-dom';
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { useAuthStore } from "./store/auth";

export const publicRoutes = ["/signin", "/activate", "/activate-success"];

export const useAuthState = () => {
  const { isAuthenticated } = useAuthStore();
  const [isAuth, setIsAuth] = useState({
    isMounted: false,
    isAuthenticated: false,
  });

  useEffect(() => {
    setIsAuth({
      isMounted: true,
      isAuthenticated: isAuthenticated,
    });
  }, [isAuthenticated]);

  return { ...isAuth };
};

export const ClientMiddleware = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isMounted, isAuthenticated } = useAuthState();
  const isPublicRoute = publicRoutes.includes(currentPath);

  useLayoutEffect(() => {
    if (isMounted && !isAuthenticated && !isPublicRoute) navigate("/signin");
  }, [isAuthenticated, isMounted, isPublicRoute, navigate]);

  if (!isMounted) return null;
  if (isPublicRoute) return children;
  return children;
};
