import React, { Component } from 'react';
// import { Form, Row, Col, Button } from 'react-bootstrap';
import CardList from "./CardList";
import { Link, NavLink, Redirect } from "react-router-dom";
import { Card } from "react-bootstrap";
import { connect } from "react-redux";
import Pic from "../../no_proj.png";

class Projects extends Component {
    state = {
        aT: (this.props.auth.stsTokenManager) ? this.props.auth.stsTokenManager.accessToken : ""
    }
    componentDidMount() {
        // console.log(this.props.auth.uid,"cdcdscdvfdgewdS")
        const url = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/projects/";
        // console.log(url);
        // console.log(this.state.aT);
        fetch(url, {
            headers: {
                Authorization: "Bearer " + this.state.aT
            }
        })
            .then(res => res.json())
            .then(data => {

                const arr = data.res.projects;

                this.setState({ projects: arr })

            })

            .catch(err => console.log(err))


        fetch("https://us-central1-dexpert-admin.cloudfunctions.net/api/employees/" + this.props.auth.uid, {
            headers: {
                Authorization:
                    "Bearer " + this.state.aT
            }
        }
        )
            .then(res => res.json())
            .then(data => {

                console.log(data, "ye hain admin ka data")
                let role = (data.res.role.admin) ? "admin" : (data.res.role.manager) ? "manager" : (data.res.role.editor) ? "editor" : "viewer";
                localStorage.setItem("role", role);
                localStorage.setItem("name", data.res.name);
                localStorage.setItem("email", data.res.email);
                localStorage.setItem("uid", data.res.id);

            })

            .catch(err => console.log(err));
    }

    render() {
        // console.log(this.state.projects[0].name)
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to={"/signin/"} />
        return (

            <div className="projAside">
                <div className="projHeader">
                    <div className="projHeaderName">
                        <h5 className="projList"><b>MY DEXPERTS</b></h5>
                    </div>
                    {/*<div className="addIcon">*/}
                    {/*    <Link to="/projects/add" >*/}
                    {/*    <div className="addIconInside">*/}
                    {/*        <span>+</span>*/}
                    {/*    </div>*/}
                    {/*    </Link>*/}
                    {/*</div>*/}
                </div>

                <div className="projHeader_fake"></div>

                <div className="cards">


                    {
                        !this.state.projects && <Card className="cardLayout" >
                            <Card.Body>

                                <Card.Subtitle className="mb-2 text-muted cardSub">created on: <lines className="shine date"></lines> </Card.Subtitle>
                                <Card.Title className="cardTitle"><lines className="shine title"></lines></Card.Title>
                                <Card.Text className="cardText"><lines className="shine desc"></lines></Card.Text>
                                <lines className="shine tag_holder"></lines>
                            </Card.Body>
                        </Card>
                    }

                    {this.state.projects && this.state.projects.length === 0 && <div className={"no_proj-img"}><img src={Pic} alt="profile" /></div>}
                    {this.state.projects && this.state.projects.length === 0 && <div className={"no_proj-div"}><p className={"no_proj"}>No projects added !!!</p></div>}

                    {
                        this.state.projects && this.state.projects.map((project, key) =>
                            <NavLink to={"/projects/" + (project.id) + "/tasks"} key={key} activeClassName={"active"} >
                                {console.log(project)}
                                <CardList
                                    date={project.creationTime ? formatDate(project.creationTime) : "NA"}
                                    title={project.name}
                                    description={project.description}
                                    activeTask={project.taskActive}
                                />
                            </NavLink>
                        )
                    }


                </div>
            </div>
        )
    }
}

const formatDate = (date) => {
    date = new Date(date);

    let day = date.getDate();
    let monthIndex = date.getMonth() + 1;
    let year = date.getFullYear();

    monthIndex += "";
    if (monthIndex.length == 1)
        monthIndex = "0" + monthIndex;

    day += "";
    if (day.length == 1)
        day = "0" + day;

    return year + '-' + monthIndex + '-' + day;
}
const mapStateToProps = (state) => {
    console.log("my name is state1", state);
    return {
        auth: state.firebase.auth
    }
}
export default connect(mapStateToProps)(Projects);