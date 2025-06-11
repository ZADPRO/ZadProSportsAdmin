import React, { useState, type ReactNode } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { FaUserFriends } from "react-icons/fa";
import { History, ReceiptIndianRupee } from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import {
  Bolt,
  Home,
  LogOut,
  Menu,
  SquareCheckBig,
  Users,
  Volleyball,
} from "lucide-react";

import "./Header.css";
import { useUser } from "../../context/UserContext";

interface HeaderProps {
  children: ReactNode;
}

const employeeRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <Home />,
    allowedRoles: ["owner"],
  },
  {
    path: "/ground",
    name: "Ground",
    icon: <Volleyball />,
    allowedRoles: ["admin", "owner"],
  },
  {
    path: "/Userlist",
    name: "User List",
    icon: <Users />,
    allowedRoles: ["admin"],
  },
  {
    path: "/booking",
    name: "Booking",
    icon: <SquareCheckBig />,
    allowedRoles: ["admin", "owner"],
  },
  {
    path: "/owner",
    name: "Owner",
    icon: <FaUserFriends />,
    allowedRoles: ["admin"],
  },
  {
    path: "/finance",
    name: "Finance",
    icon: <ReceiptIndianRupee />,
    allowedRoles: ["admin"],
  },
  {
    path: "/audit",
    name: "Audit",
    icon: <History />,
    allowedRoles: ["admin"],
  },

  {
    path: "/settings",
    name: "Settings",
    icon: <Bolt />,
    allowedRoles: ["admin", "owner"],
  },
  {
    path: "/login",
    name: "Logout",
    icon: <LogOut />,
    allowedRoles: ["admin", "owner"],
    logout: true,
  },
];

const Header: React.FC<HeaderProps> = ({ children }) => {
  // HANDLE NAVIATION FUNCTION
  const navigate = useNavigate();

  const { user } = useUser();

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

    localStorage.clear();

    navigate("/login");
  };

  console.log(user);
  //   HANDLE TOGGLE BUTTON TO OPEN AND CLOSE THE NAVBAR
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className="main_container">
        <motion.div
          animate={{
            minWidth: isOpen ? "17vw" : "4vw",
            transition: {
              duration: 0.2,
              type: "spring",
              damping: 20,
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
            {employeeRoutes
              .filter((route) => {
                if (
                  user.role !== null &&
                  route.allowedRoles.includes(user.role)
                ) {
                  return true;
                }
              })
              .map((route) => (
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
        <main style={{ minWidth: isOpen ? "81vw" : "94vw" }}>{children}</main>
      </div>{" "}
    </div>
  );
};

export default Header;
