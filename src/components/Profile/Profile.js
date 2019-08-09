import React, {Component, Fragment} from 'react';
import './Profile.css';
import {Button} from "react-bootstrap";
import Sidebar from "../Sidebar/Sidebar";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from "../../actions/authActions";
// import { fetchEmp } from "../../actions/empActions";

import Pic from '../../images/avatar.svg';

class Profile extends Component {
    state = {
        name: "",
        email: "",
        clientName:"",
        projects:0,
        aT: (this.props.auth.stsTokenManager)?this.props.auth.stsTokenManager.accessToken:""
    }
    componentDidMount() {
        console.log(this.props.auth.uid,"cdcdscdvfdgewdS")
        const url= "https://us-central1-dexpert-admin.cloudfunctions.net/api/employees/"+this.props.auth.uid;
        console.log(url);
        fetch(url,{
            headers: {
                Authorization: "Bearer "+this.state.aT,
                "Content-Type":"application/json"
            }
        })
            .then(res => res.json())
            .then(data=> {
                const dataItem = (data);
                console.log(dataItem.res,"cdcdscsdvs")
                const clientId = dataItem.res.client.id;
                localStorage.setItem("clientId",clientId);
                localStorage.setItem("employeeId",this.props.auth.uid);
                localStorage.setItem("token",this.props.auth.stsTokenManager.accessToken);
                const { name, email, number } = dataItem.res;
                this.setState({name, email, number}  )
                this.setState({
                    clientName:dataItem.res.client.name
                })


                fetch("https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/"+clientId+"/projects",{
                    headers: {
                        Authorization: "Bearer "+this.state.aT
                    }
                })
                    .then( res => res.json())
                    .then( data => {
                        console.log(data.res.projects.length,"ye hain saare projects");
                        this.setState({
                            projects:data.res.projects.length
                        })
                        if(data.error){
                            console.log("kuch erroe aa rha")
                            // this.setState({
                            //     aT:this.props.auth.stsTokenManager;
                            // })

                        }
                    })
                    .catch( err => console.log(err))



            })

            .catch(err => console.log(err))
    }

    render() {
        const { auth } = this.props;
        console.log("ye hain prop", this.props);
        if(!auth.uid) return <Redirect to={"/signin/"} />
        return (
            <Fragment>
                <Sidebar/>
                <div className="profile-aside">
                    <div className="back"></div>
                    <div className="profileCard">
                        { !this.state.name && <Fragment>
                            <div className="profile-image">
                                <img src={Pic} alt="profile" />
                            </div>
                            <div className="profile-info">
                                <lines className="shine heading"></lines>
                                <br />

                                <lines className="shine num_space"></lines>
                                <br />
                                <br/>
                                <lines className="shine email_space"></lines>
                            </div>
                        </Fragment> }
                        { this.state.name && <Fragment>
                        <div className="profile-image">
                            <img src={Pic} alt="profile" />
                        </div>
                        <div className="profile-info">
                            <h1>{this.state.name}</h1>

                            <p className='numb'>{this.state.clientName.toUpperCase()}</p>
                            <br/>
                            <p className='emailid'>{this.state.email}</p>
                        </div>
                        </Fragment> }

                    </div>
                    <div className="minibox">
                        {/*<div className="box box1">*/}
                        {/*    <div className="extra-content">*/}
                        {/*        <div className="no">1</div>*/}
                        {/*        <div className="what">client</div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className="box box2">*/}
                        {/*    <div className="extra-content">*/}
                        {/*        <div className="no">{(this.state.projects!==0)?this.state.projects:"-"}</div>*/}
                        {/*        <div className="what">projects</div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className="box box3">*/}
                        {/*    <div className="extra-content">*/}
                        {/*        <div className="no">5</div>*/}
                        {/*        <div className="what">task active</div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                    <div className="log_out">
                        <a onClick={this.props.signOut} >
                            <Button variant="secondary" size="sm" type="submit" className={`cancel`}>
                                LOG OUT
                            </Button>
                        </a>
                    </div>
                </div>
            </Fragment>

        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut()),

    }
}
const mapStateToProps = (state) => {
    console.log("my name is state1",state);
    return {
        auth: state.firebase.auth
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);