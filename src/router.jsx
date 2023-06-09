import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/login";

import Signup from "./views/signup";
import NotFound from "./views/notfound";
import Visiondash from "./views/visiondash";

import GuestLayout from "./components/GuestLayout";

import Home from "./views/home";
import PaymentSuccess from "./views/paymentSuccess";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./views/admin/dashboard";
import Payments from "./components/Admin/Payments";
import Clients from "./components/Admin/Clients";
import ClientForm from "./components/Admin/ClientForm";
import Plans from "./views/Plans";
import Products from "./components/Admin/Products";
import Renders from "./components/Admin/Renders";
import PaymentFailed from "./views/paymentFailed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/design",
    element: <Visiondash />,
  },
  {
    path: "/pricing",
    element: <Plans />,
  },
  {
    path: "/checkout",
    element: <PaymentSuccess />,
  },
  {
    path: "/checkout",
    element: <PaymentFailed />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "/admin",
        element: <Navigate to="/admin/dashboard" />,
      },
      {
        path: "/admin/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/admin/payments",
        element: <Payments />,
      },
      {
        path: "/admin/users",
        element: <Clients />,
      },
      {
        path: "/admin/users/new",
        element: <ClientForm key="userCreate" />,
      },
      {
        path: "/admin/users/:id",
        element: <ClientForm key="userUpdate" />,
      },
      {
        path: "/admin/plans",
        element: <Products />,
      },
      {
        path: "/admin/renders",
        element: <Renders />,
      },
    ],
  },

  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
