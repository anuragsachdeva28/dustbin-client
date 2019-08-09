import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Main from "./components/Main/Main";
import Sidebar from "./components/Sidebar/Sidebar";
import SignIn from "./components/SignIn/SignIn";
import Profile from "./components/Profile/Profile";
import Admin from "./components/Main/Admin";
import Page404 from "./404Page";
import Employee from "./components/Main/Employee";
import ResetPass from "./components/SignIn/ResetPass";
import AddEmp from "./components/Main/AddEmp";
// import AddEmp from "./components/Main/AddEmp";

class App extends Component {
    componentDidMount() {
        // To set unique user id in your system when it is available
        window.fcWidget.setExternalId(localStorage.getItem("uid"));

        // To set user name
        window.fcWidget.user.setFirstName(localStorage.getItem("name"));

        // To set user email
        window.fcWidget.user.setEmail(localStorage.getItem("email"));

        // console.log(localStorage.getItem("name"),"aaaaaaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    }
  render() {
    return (
      <Router>
        <div className="App">
            <Switch>

                <Route exact path="/" render={() => (<Redirect to="/signin" />)} />
                <Route path="/projects/" component={Sidebar} />


                <Route path="/signin/" component={SignIn} />
                <Route path="/profile/" component={Profile} />
                <Route path="/admin/" component={Admin} />

                <Route path="/employees/" exact component={Employee} />
                <Route path="/employees/add" component={AddEmp} />
                <Route path="/reset" component={ResetPass} />
                <Route component={Page404} />
            </Switch>
            <Route path="/projects/" component={Main} />





        </div>
      </Router>
    );
  }
}

export default App;
