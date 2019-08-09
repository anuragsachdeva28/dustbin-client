import React, { Component, Fragment } from "react";
import { connect } from "react-redux";

import "./sign.css";
import {reset} from "../../actions/authActions";

class ResetPass extends Component {

    state = {
        loading:false,
        email:""
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]:e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        if(this.state.email){
            await this.props.reset(this.state.email);
            window.alert("Reset Link sent to your mail.");
            window.location.href = "/signin"
        }

    }


    render() {
        const { loading } = this.state;
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
                        <div className="FormCenter">
                            <form

                                onSubmit={this.handleSubmit}
                                className="FormFields"
                                id="form-id"
                            >
                                <label className="login">Please enter the email to continue.</label>
                                <div className="FormField">
                                    <input
                                        type="email"
                                        id="email"
                                        className="FormField__Input"
                                        placeholder="email"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <br/>
                                <br/>


                                <div className="FormField btn-submit">

                                    {/*<button type="submit" className="FormField__Button mr-20"><a href="./clients/">Sign In</a></button>*/}
                                    <button disabled={loading} type="submit" className="FormField__Button mr-20">
                                        { loading && <i className={"fa fa-refresh fa-spin"}></i>}
                                        { loading ? "      Loading..." : "Send"}

                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
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

const mapDispatchToProps = (dispatch) => {
    return {
        reset: (mail) => dispatch(reset(mail))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ResetPass);
