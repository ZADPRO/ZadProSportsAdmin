import React, { type ReactNode } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import PropTypes from "prop-types";

// import Home from "../pages/00-Home/Home";
import Ground from "../pages/02-Ground/Ground";
import Settings from "../pages/01-Settings/Settings";
import Header from "../components/Header/Header";
import Userlist from "../pages/03-UserList/UserList";
import Booking from "../pages/04-Booking/Booking";
import Login from "../pages/05-Login/login";

const MainRoutes: React.FC = () => {
  return (
    <div>
      <Router>
        <ConditionalHeader>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ground" element={<Ground />} />
            <Route path="/Userlist" element={<Userlist />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </ConditionalHeader>
      </Router>
    </div>
  );
};
interface ConditionalHeaderProps {
  children: ReactNode;
}

function ConditionalHeader({ children }: ConditionalHeaderProps) {
  // TO CATCH THE PATH NAME FROM THE URL TAB
  const location = useLocation();

  // INITIALIZE THE LOGIN ROUTE THAT IT WAS PRESENT IN THE PATH NAME OR NOT
  const excludedRoutes = ["/login"];
  const isExcluded = excludedRoutes.includes(location.pathname);

  // IF THE PATH - LOGIN WAS FOUND IN PATHNAME, THEN IT DOESN'T RETURN THE HEADER, OTHERWISE IT WILL REUTRN THE HEADER AS A PARENT
  return isExcluded ? children : <Header>{children}</Header>;
}

export default MainRoutes;

ConditionalHeader.propTypes = {
  children: PropTypes.node,
};
