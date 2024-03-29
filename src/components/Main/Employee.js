import React, {Component, Fragment} from "react";
import "./Employee.css";
import { Link } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom";
import NO_EMPLOYEE from "../../no_emp.png";
import {Button, Form, Modal} from "react-bootstrap";

const backdropStyle = {
    position: 'fixed',
    zIndex: 1040,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    opacity: 0.5
};

const modalStyle2 = function () {
    // we use some psuedo random coords so nested modals
    // don't sit right on top of each other.
    let top = 50;
    let left = 50;

    return {
        position: 'fixed',
        width: 650,
        height: 325,
        zIndex: 1040,
        top: top + '%',
        left: left + '%',
        border: '1px solid #e5e5e5',
        backgroundColor: 'white',
        boxShadow: '0 5px 15px rgba(0,0,0,.5)',
        padding: 0,
        overflow: 'hidden',
        transform: 'translate(-50%, -50%)'
    };
};


class Employee extends Component {
    state = {
        name:"",
        description:"",
        showModal2: false,
        showModal3: false,
        editLoading: false,
        deleteLoader: false,
        aT: (this.props.auth.stsTokenManager)?this.props.auth.stsTokenManager.accessToken:""
    }
    close2 = () => {

        this.setState({ showModal2: false });
    };
    close3 = () => {

        this.setState({ showModal3: false });
    };

    open2 = (id) => {
        console.log(id,"ye hain id")
        this.setState({
            showModal2: true,
            empName:id.editName,
            editId:id.editId,
            empNumber:id.editNum,
            empMail:id.editEmail,
            empRole:(id.editRole.admin)? "Admin" : (id.editRole.manager)? "Manager" : (id.editRole.editor)? "Editor" : "Viewer"
        });
    }
    open3 = (id) => {
        console.log(id,"ye hain id")
        this.setState({
            showModal3: true,

            editId:id
        });
    }
    renderBackdrop(props) {

        return <div {...props} style={backdropStyle} />;
    }

    deleteEmp = () => {
        this.setState({
            deleteLoader:true
        })
        // console.log(id);
        const url_emp_id = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/employees/" + this.state.editId;
        console.log(url_emp_id);


        fetch(url_emp_id, {
            headers: {
                Authorization: "Bearer " + this.props.auth.stsTokenManager.accessToken,
                "Content-Type": "application/json"
            },
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => {

                console.log("anurag", data);
                if(data.error){
                    console.log(data.error,"this is the error coming while editing task")
                    this.setState({
                        deleteLoader:false
                    })
                }
                else {
                    window.location.reload(false);

                }

            })
            .catch(err => console.log(err));
    }

    handleEmpChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,

        })
    }

    handleEdit = (e) => {
        e.preventDefault();
        this.setState({
            editLoading:true
        })
        const url_emp_id = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/employees/" + this.state.editId;
        console.log(url_emp_id);

        // console.log("myname is value", value)
        let role = {};
        if (this.state.empRole === "Viewer") {
            role = {
                admin: false,
                manager: false,
                editor: false,
                viewer: true
            };
        }
        else if (this.state.empRole === "Editor") {
            role = {
                admin: false,
                manager: false,
                editor: true,
                viewer: true
            };
        }
        else if (this.state.empRole === "Manager") {
            role = {
                admin: false,
                manager: true,
                editor: true,
                viewer: true
            };
        }
        else if (this.state.empRole === "Admin") {
            role = {
                admin: true,
                manager: true,
                editor: true,
                viewer: true
            };
        }
        let name = this.state.empName;

        const dataObj = {
            "update": {
                role,
                "name":name
            }
        }

        console.log(dataObj, "sending this data");

        fetch(url_emp_id, {
            headers: {
                Authorization: "Bearer " + this.props.auth.stsTokenManager.accessToken,
                "Content-Type": "application/json"
            },
            method: 'PUT',
            body: JSON.stringify(dataObj)
        })
            .then(res => res.json())
            .then(data => {

                console.log("anurag", data);
                if(data.error){
                    console.log(data.error,"this is the error coming while editing task")
                    this.setState({
                        editLoading:false
                    })
                }
                else {
                    window.location.reload(false);

                }

            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        const url_emp= "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/"+localStorage.getItem('clientId')+"/employees/";
        // console.log(url,"cddscsdCds",this.props);
        fetch(url_emp,{
            headers: {
                Authorization: "Bearer "+this.state.aT
            }
        })
            .then(res => res.json())
            .then(data => {

                console.log("emp list this ",data);
                const arr = data.res;
                this.setState({ employees: arr })
                if(!data.res) {
                    this.setState({
                        employees: []
                    })
                }



            })

            .catch(err => console.log(err))

        const url_client= "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/"+localStorage.getItem('clientId');
        // console.log(url,"cddscsdCds",this.props);
        fetch(url_client,{
            headers: {
                Authorization: "Bearer "+this.state.aT
            }
        })
            .then(res => res.json())
            .then(data => {

                console.log("clientttttttt",data);
                const name = data.res.client.name;
                const description = (data.res.client.description) ? data.res.description : " ";
                this.setState({ name, description })



            })

            .catch(err => console.log(err))
    }


    render() {
        console.log("dcdcDDSFVFDVDF");
        const { auth } = this.props;
        if(!auth.uid) return <Redirect to={"/signin/"} />
        let role = localStorage.getItem("role");
    return (
        <Fragment>
            <Sidebar/>
            <div className="empAside">
                <div className="userHeader">
                    {(role==="admin"||role==="manager") && <Link to="/employees/add">
                        <button className="add_user" type="button">
                            {" "}
                            <span>+</span> Add User{" "}
                        </button>
                    </Link>}
                </div>

                <div className="userBody">
                    <h4 className="table-heading">{ (this.state.name) ? this.state.name : <lines className="shine proj_name"></lines> }</h4>
                    <p>
                        { (this.state.description ? this.state.description : <lines className="shine proj_desc"></lines>) }
                    </p>
                    <br />

                    {this.state.employees && this.state.employees.length!==0 && <div className="client-tableHeader">
                        <div className="num"></div>
                        <div className="username light">User Name</div>
                        <div className="email">Email Address</div>
                        <div className="role">Role</div>
                        {(role==="admin"||role==="manager") && <div className="icons"></div>}
                        {(role==="admin"||role==="manager") && <div className="num"></div>}
                    </div>}

                    {!this.state.employees && <div className="client-tableHeader">
                        <div className="num"><lines className="shine task_holder_num"></lines></div>
                        <div className="username light"><lines className="shine task_holder_name"></lines></div>
                        <div className="email"><lines className="shine task_holder"></lines></div>
                        <div className="role"><lines className="shine task_holder"></lines></div>
                    </div>}

                    {this.state.employees && this.state.employees.length===0 && <div className={"emp-div"}><img className="no_emp" src={NO_EMPLOYEE} alt="logo" /></div> }
                    { this.state.employees && this.state.employees.length===0 && <div className={"no_emp-div"}><p className={"no_projemp"}>No Employees added!!!</p></div>}


                    <div className="tableContainer">

                        {
                            this.state.employees && this.state.employees.map( (employee,index) => {
                                let editName = employee.name;
                                let editId = employee.id;
                                let editNum = employee.number;
                                let editEmail = employee.email;
                                let editRole = employee.role;
                                let empRole = (employee.role.admin)? "Admin" : (employee.role.manager)? "Manager" : (employee.role.editor)? "Editor" : "Viewer";

                                    return <div className="client-tableBody" key={index}>
                                    <div className="num">{index+1}</div>
                                    <div className="username">{ employee.name }</div>
                                    <div className="email">{ employee.email }</div>
                                    <div className="role">{ (employee.role.admin)? "Admin" : (employee.role.manager)? "Manager" : (employee.role.editor)? "Editor" : "Viewer" }</div>
                                    {(role==="admin" || ((role==="manager") && !((empRole === "Admin") || (empRole === "Manager")))) && <div className="icons" onClick={() => this.open2({editName, editId, editNum, editEmail, editRole})}><i className="fa fa-pencil-square-o" title="Edit" aria-hidden="true"></i></div>}
                                    {(role==="admin" || ((role==="manager") && !((empRole === "Admin") || (empRole === "Manager")))) && <div className="icons" onClick={() => this.open3(employee.id)}> <i className="fa fa-trash" title="Delete" aria-hidden="true"></i></div>}
                                </div>
                            }

                            )
                        }

                    </div>
                    <Modal
                        onHide={this.close2}
                        style={modalStyle2()}
                        aria-labelledby="modal-label"
                        show={this.state.showModal2}
                        renderBackdrop={this.renderBackdrop}
                    >
                        <div className="modalMain">
                            <h2 id="modal-label">EDIT TASK</h2>
                        </div>
                        <Form onSubmit={this.handleEdit}>

                            <Form.Group>
                                <Form.Label className="taskLabel">NAME</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Write here...."
                                    className="nameField"
                                    id="empName"
                                    value={this.state.empName}
                                    onChange={this.handleEmpChange}
                                />
                            </Form.Group>


                            <Form.Group>
                                <Form.Label className="taskLabel">ROLE</Form.Label>
                                <Form.Control id="empRole" value={this.state.empRole} as="select" onChange={this.handleEmpChange}>
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Editor</option>
                                    <option>Viewer</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="createBt">
                                <Button type="submit" variant="secondary" size="sm" className="taskCreate" >
                                    {this.state.editLoading ? <i className={"fa fa-refresh fa-spin"}></i> : "SAVE"}
                                </Button>
                            </Form.Group>
                        </Form>

                    </Modal>
                    <Modal
                        onHide={this.close3}
                        className={"delete-model"}
                        aria-labelledby="modal-label"
                        show={this.state.showModal3}
                        renderBackdrop={this.renderBackdrop}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Employee</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Are you sure you want to delete ?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            { this.state.deleteLoader ? "" : <Button variant="secondary" onClick={this.close3}>Cancel</Button>}
                            <Button variant="danger" onClick={this.deleteEmp}>
                                {this.state.deleteLoader ? <i className={"fa fa-refresh fa-spin"}></i> : "Confirm"}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </Fragment>

    );
  }
}

const mapStateToProps = (state) => {
    console.log("my name is state1",state);
    return {
        auth: state.firebase.auth
    }
}
export default connect(mapStateToProps)(Employee);

