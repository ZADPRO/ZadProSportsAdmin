import React, { useEffect, useState, type ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { NavLink, useNavigate } from "react-router-dom";
import {
  Bolt,
  LayoutGrid,
  LogOut,
  Menu,
  SquareCheckBig,
  Users,
  Volleyball,
} from "lucide-react";

import "./Header.css";

interface HeaderProps {
  children: ReactNode;
}

const employeeRoutes = [
  {
    path: "/",
    name: "Dashboard",
    icon: <LayoutGrid />,
  },
  {
    path: "/ground",
    name: "Ground",
    icon: <Volleyball />,
  },
  {
    path: "/Userlist",
    name: "User List",
    icon: <Users />,
  },
  {
    path: "/booking",
    name: "Booking",
    icon: <SquareCheckBig />,
  },
  {
    path: "/settings",
    name: "Settings",
    icon: <Bolt />,
  },
  {
    path: "/login",
    name: "Logout",
    icon: <LogOut />,
    logout: true,
  },
];

const Header: React.FC<HeaderProps> = ({ children }) => {
  // HANDLE NAVIATION FUNCTION
  const navigate = useNavigate();

  // USE STATES TO HANDLE THE NAVBAR - TO CHECK WEATHER IT IS OPEN OR NOT
  const [isOpen, setIsOpen] = useState(false);
  //   const [selectedRoutes, setSelectedRoutes] = useState(employeeRoutes);

  //   ANIMATION HANDLING - USING THE FRAMER MOTION LIBRARY
  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "auto",
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  //   LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("loginStatus");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userDetails");

    navigate("/login");
  };

  //   HANDLE TOGGLE BUTTON TO OPEN AND CLOSE THE NAVBAR
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="main_container">
        <motion.div
          animate={{
            minWidth: isOpen ? "250px" : "60px",
            transition: {
              duration: 0.2,
              type: "spring",
              damping: 10,
            },
          }}
          className="sidebar"
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  className="logo"
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  Admin Panel
                </motion.h1>
              )}
            </AnimatePresence>
            <div className="bars">
              <Menu onClick={toggle} />
            </div>
          </div>

          <section className="routes">
            {employeeRoutes.map((route) => (
              <NavLink
                to={route.path}
                key={route.name}
                className="link"
                onClick={route.logout ? handleLogout : undefined}
              >
                <div className="icon">{route.icon}</div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className="link_text"
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      {route.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            ))}
          </section>
        </motion.div>
        <main style={{ minWidth: isOpen ? "82vw" : "95vw" }}>{children}</main>
      </div>{" "}
    </div>
  );
};

export default Header;
