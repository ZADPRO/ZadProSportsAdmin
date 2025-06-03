import "./App.css";
import { UserProvider } from "./context/UserContext";
import MainRoutes from "./routes/MainRoutes";

function App() {
  return (
    <UserProvider>
      <MainRoutes />
    </UserProvider>
  );
}

export default App;
