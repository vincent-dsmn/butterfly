// src/App.js (1-29)
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { UserProvider } from "./contexts/user.context";
import Home from "./pages/Home.page";
import PrivateRoute from "./pages/PrivateRoute.page";

function App() {
  return (
    <HashRouter>
      {/* We are wrapping our whole app with UserProvider so that */}
      {/* our user is accessible through out the app from any page*/}
      <UserProvider>
        <Routes>
          {/* We are protecting our Home Page from unauthenticated */}
          {/* users by wrapping it with PrivateRoute here. */}
            <Route exact path="/" element={<Home />} />
        </Routes>
      </UserProvider>
    </HashRouter>
  );
}

export default App;