import React, { Component, Fragment } from "react";
import { Route, Redirect } from "react-router-dom";
import SignInForm from "./SignInForm";
import { connect } from "react-redux";

import "./sign.css";

class SignIn extends Component {
  state = {
    uid: "",
    client: true,
    clear: false
  };
  myfunc = () => {
    console.log("trnfvndjkcnj");
    let x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function() {
      x.className = x.className.replace("show", "");
    }, 5000);
  };
  componentDidMount() {
    console.log(this.props.auth.uid)
    if(this.props.auth.uid) {
      window.location.href = "/projects/"
    }
    console.log("checked")
  }
  componentWillReceiveProps(nextProps) {
    console.log("this is next props", nextProps);
    this.setState({
      client: true
    });
    console.log("https://us-central1-dexpert-admin.cloudfunctions.net/api/employees/" + nextProps.auth.uid);
    if (nextProps.auth.uid) {
      fetch(
        "https://us-central1-dexpert-admin.cloudfunctions.net/api/employees/" + nextProps.auth.uid,
        {
          headers: {
            Authorization:
              "Bearer " + nextProps.auth.stsTokenManager.accessToken
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          const dataItem = (data);
          console.log(dataItem.res,"cdcdscsdvs")
          const clientId = dataItem.res.client.id;
          localStorage.setItem("clientId",clientId);
          let role = (data.res.role.admin) ? "admin" : (data.res.role.manager) ? "manager" : (data.res.role.editor) ? "editor" : "viewer";
          localStorage.setItem("role", role);
          this.setState({
            client: true
          });
          if (data.error) {
            console.log("calling my functon",data.error);
            this.myfunc();
            this.setState({
              client: false
            });
          } else {
            console.log("no error")
            window.location.href = "/projects/";
          }
        })

        .catch(err => console.log(err));
    }
  }

  render() {
    const { auth } = this.props;
    // if (auth.uid && this.state.client) return <Redirect to={"/profile/"} />;
    return (
      <Fragment>
        <div className="App">
          <div className="App__Aside">
            <h3>WELCOME TO DEXPERT</h3>
            <p className="Para">
              One Stop Station for your Project Express.
            </p>
          </div>
          <div className="App__Form">
            <SignInForm client={this.state.client} clear={this.state.clear} />
          </div>
        </div>
        <div id="snackbar">
          Not a Client ! ! !<br />
          Please contact support or login with an admin id
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  // console.log("my name is state",state);
  return {
    auth: state.firebase.auth
  };
};
export default connect(mapStateToProps)(SignIn);
