import React, { Component } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Autocomplete from "./Autocomplete";
import { Link } from "react-router-dom";
import {connect} from "react-redux";

class AddProject extends Component {
  state = {
    name:"",
    aT: (this.props.auth.stsTokenManager)?this.props.auth.stsTokenManager.accessToken:"",
    description:"",
    team:[],
    employees:[{

    }]
  }

  componentDidMount() {
    // console.log(this.props.auth.uid,"cdcdscdvfdgewdS")
    const url= "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/"+localStorage.getItem('clientId')+"/employees/";
    // console.log(url,"cddscsdCds",this.props);
    fetch(url,{
      headers: {
        Authorization: "Bearer "+this.state.aT
      }
    })
        .then(res => res.json())
        .then(data => {

          // console.log("cdcqqqqqqqqqqqqqqdsc",data);
          const arr = data.res;
          this.setState({ employees: arr })



        })

        .catch(err => console.log(err))
  }
  handleSubmit = (e) => {
    e.preventDefault();

    let name = this.state.name;
    let description = this.state.description;
    let team = this.state.team;
    let dataObj = {name, description, team};
    console.log(dataObj)

    const url= "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/"+localStorage.getItem('clientId')+"/projects/";
    console.log(url,"cddscsdCds",this.props);
    fetch(url,{
      headers: {
        Authorization: "Bearer "+this.state.aT
      },
      method: 'POST',
      body: JSON.stringify(dataObj)
    })
        .then(res => res.json())
        .then(data => {

          console.log("anurag",data);
          window.location.reload(false);
        })

        .catch(err => console.log(err))
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  setSelection = (val) => {
    // var joined = this.state.team.push(val);
      this.setState({

        team:[...this.state.team, val]
      })
  }

  render() {
    // console.log(this.state.employees);
    return (
      <div className="addTask">
        <div className="taskHeader">
          {/*<button className="add_task" type="button">*/}
          {/*{" "}*/}
          {/*<span>+</span> Add Task{" "}*/}
          {/*</button>*/}
        </div>

        <Form className="basic" onSubmit={this.handleSubmit}>
          <Form.Group>
            <Form.Label className="formLabel">PROJECT NAME</Form.Label>
            <Form.Control
              type="text"
              placeholder="Write here...."
              className="nameField"
              id="name"
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group className="formGroup">
            <Form.Label className="formLabel">PROJECT DESCRIPTION</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Write here...."
              className="desField"
              id="description"
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group className="formGroup">
            <Form.Label className="formLabel">Team</Form.Label>


            <Autocomplete
              options={this.state.employees}
              onSelection={this.setSelection}
            />
          </Form.Group>

          <div className={"selection_container"}>
            {
              this.state.team.map((member) => {
                return <div className="selected"><span>{member.name}</span></div>
              })
            }
          </div>




          <br />
          <br />
          <Form.Group as={Row}>
            <Col sm="3">
              <Link to="/projects/">
                <Button variant="secondary" size="sm" className={`cancel`}>
                  CANCEL
                </Button>
              </Link>
            </Col>
            <Col sm="3">

                <Button variant="secondary" size="sm" className={`create`} type={"submit"}>
                  CREATE
                </Button>

            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  console.log("my name is state1",state);
  return {
    auth: state.firebase.auth
  }
}
export default connect(mapStateToProps)(AddProject);
