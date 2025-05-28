import axios from "axios";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React, { useState } from "react";
import decrypt from "../../common/helper";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();

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
        if (data.success) {
          console.log("data", data);
          localStorage.setItem("JWTtoken", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("roleId", data.roleId);
          navigate("/ground");
        }
      });
  };

  return (
    <div className="m-3 flex justify-center items-center h-screen">
      <div className="card">
        <Card title="Admin Login" style={{ textAlign: "center" }}>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              placeholder="Username"
              className="w-full"
              value={userName}
              onChange={(a) => {
                console.log("e", a.target.value);
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
