import "./style.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import WorkerPage from "./pages/WorkerPage";
import { isSignedIn } from "./utils/auth";

// Only admin see the dashboard
const RequireAuth = ({ children }) => {
  return isSignedIn() ? children : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/admin"

        element={
          <RequireAuth>
            <WorkerPage />
          </RequireAuth>
        } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

  );
}

export default App;
