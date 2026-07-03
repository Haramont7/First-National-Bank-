import type { RouteObject } from "react-router-dom";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/login/page";
import VerifyPhonePage from "@/pages/verify-phone/page";
import VerifyCardPage from "@/pages/verify-card/page";
import AccountVerifiedPage from "@/pages/account-verified/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/verify-phone",
    element: <VerifyPhonePage />,
  },
  {
    path: "/verify-card",
    element: <VerifyCardPage />,
  },
  {
    path: "/account-verified",
    element: <AccountVerifiedPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;