// import { ReactNode, useLayoutEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuthState } from "../../../state/client-middleware";

// interface AuthLayoutProps {
//   children: ReactNode;
// }

// export function AuthLayout({ children }: AuthLayoutProps) {
//   const navigate = useNavigate();
//   const { isMounted, isAuthenticated } = useAuthState();

//   useLayoutEffect(() => {
//     if (isAuthenticated) {
//       navigate("/");
//     }
//   }, [isAuthenticated, navigate]);

//   if (!isMounted) return null;

//   return (
//     <div className="flex h-screen">
//       <div className="flex-1 flex justify-center items-center px-4">
//         <div className="w-full max-w-[400px]">{children}</div>
//       </div>
//       <div className="hidden md:block flex-1 relative">
//         <img 
//           src="../../../assets/bg-auth.png"
//           alt="bg-auth" 
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-primary opacity-70" />
//       </div>
//     </div>
//   );
// }

import { useLayoutEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuthState } from "../../../state/client-middleware";

export function AuthLayout() {
  const navigate = useNavigate();
  const { isMounted, isAuthenticated } = useAuthState();

  useLayoutEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isMounted) return null;

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex justify-center items-center px-4">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
      <div className="hidden md:block flex-1 relative">
        <img 
          src="../../../assets/bg-auth.png"
          alt="bg-auth" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary opacity-70" />
      </div>
    </div>
  );
}