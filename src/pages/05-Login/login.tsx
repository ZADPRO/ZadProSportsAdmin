import axios from "axios";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React, { useState } from "react";
import decrypt from "../../common/helper";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Zad Sports Logo-03.png"
import { useUser } from "../../context/UserContext";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const { setUser } = useUser();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/adminRoutes/userLogin`, {
        login: userName,
        password: password,
      })
      .then((response) => {
        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        );
        console.log("data", data);
        if (data.success) {
          
          if(data.roleId === 1) {
            setUser({
            isAuthenticated: true,
            role: "admin",
          });
          } else if(data.roleId === 3) {
            setUser({
              isAuthenticated: true,
              role: "owner",
            });
          }
          
          localStorage.setItem("JWTtoken", data.token);
          localStorage.setItem("userId", data.userId);
          navigate("/ground");
        }
      });
  };

  return (
    <div className="m-3 flex flex-col justify-center items-center h-screen">
      <div>
        <img src={logo} className="w-50 h-30"/>
      </div>
      <div className="card">
        <Card>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              placeholder="Username"
              className="w-full"
              value={userName}
              onChange={(a) => {
                // console.log("e", a.target.value);
                setUserName(a.target.value);
              }}
            />
          </div>

          <div className="p-inputgroup w-full flex-1 mt-3">
            <span className="p-inputgroup-addon">
              <i className="pi pi-eye"></i>
            </span>
            <Password
              className="w-[100%]"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              toggleMask
              feedback={false} // optional: hide password strength indicator
            />
          </div>
          <div className="card flex justify-content-center mt-3">
            <Button label="Login" onClick={handleLogin} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
