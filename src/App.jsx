import React from "react";
import{BrowserRouter as Router,Routes,Route,Navigate,} from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUP from "./pages/auth/SignUP";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/income";
import Expense from "./pages/Dashboard/Expense";


const App = () =>{
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />}/>
          <Route path="/login" exact element={<Login/>}/>
          <Route path="/signUp" exact element={<SignUP/>}/>
          <Route path="/dashboard" exact element={<Home/>}/>
          <Route path="/income" exact element={<Income/>}/>
          <Route path="/expense" exact element={<Expense/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App

const Root = () => {
  //check if the token exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");
  //Redirect to dashboard if authenticated , otherwise login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};