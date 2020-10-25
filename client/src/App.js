import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import {useRoutes} from "./routes";
import  "materialize-css";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/navbar";

function App() {
    const {token, login, logout, userId} = useAuth();
    const isAuthenticated = Boolean(token);
    const routes = useRoutes(isAuthenticated);
  return (
      <AuthContext.Provider value={
          {token, login, logout, userId, isAuthenticated}
          }>
          <Router>
              { isAuthenticated && <Navbar />}
              <div className="container">
                  {routes}
              </div>
          </Router>
      </AuthContext.Provider>
  );
}

export default App;
