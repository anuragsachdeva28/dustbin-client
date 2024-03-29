import React, { Component } from 'react';

import './Tasks.css';

import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import "react-datepicker/dist/react-datepicker.css";
import arrayMove from 'array-move';
import Infinite from 'react-infinite';
import { Accordion, Card, Button, Dropdown } from 'react-bootstrap';
import { Modal, Form } from 'react-bootstrap';
import { connect } from "react-redux";
import NO_Tasks from "../../no_task.png";
import AddMonitors from "./AddMonitors";
import Pic from "../../icon.png";
import Edit from "../../images/edit.svg"

let last;

const SortableItem = sortableElement((props) => {

    const handleClick = (e) => {
        console.log(document.getElementById(last))
        console.log(document.getElementById(props.sno))
        let last_element = document.getElementById(last);
        let present_element = document.getElementById(props.sno);

        if (present_element != last_element) {
            if (last_element != null && last_element.classList.contains("active")) { last_element.classList.remove("active") }
            present_element.classList.add("active")
        }
        if ((present_element == last_element) && (present_element.classList.contains("active"))) {
            present_element.classList.remove("active")
        }
        else
            present_element.classList.add("active")


        // console.log("sno",props.sno)
        // console.log(e)
        last = props.sno;
    }

    const handleEdit = () =>{
        props.toOpen(props.id);
    }


    let role = localStorage.getItem("role");



    // console.log(document.getElementById(props.sno))
    return <Card className="no-border" id={props.sno}>

        <div className="strip stripBorder"  >
            <div className="num" style={{ padding: '1%' }}>{props.sno}</div>
            <div className="taskname" style={{ padding: '1%' }}>{props.taskname}</div>
            <div className="created" style={{ padding: '1%' }}>{props.created.substring(0, props.created.indexOf('T'))}</div>
            <div className="estimate" style={{ padding: '1%' }}>{props.estimate ? props.estimate.substring(0, props.created.indexOf('T')) : "NA"}</div>
            <div className="status" style={{ padding: '1%' }}>{(props.status.completed) ? <div className={"completed"}>Completed</div> : (props.status.finishAndInReview) ? <div className={"review"}>Finished and in Review</div> : (props.status.inProgress) ? <div className={"in_progress"}> In progress</div> : <div className={"start"}> Not yet Started</div>}</div>
            {(role==="admin" || role==="manager") && <div className="delete" style={{ padding: '1%' }} onClick={handleEdit}><i className="fa fa-trash" title="Delete" aria-hidden="true"></i></div>}
            <Accordion.Toggle as={Card.Text} className="arrow" style={{ padding: '1%' }} eventKey={props.sno + " "} onClick={handleClick} ><i className="fa fa-chevron-down" aria-hidden="true"></i></Accordion.Toggle>

        </div>

        <Accordion.Collapse eventKey={props.sno + " "} className="collapsed">
            <Card.Body className="hidden">{props.body}</Card.Body>
        </Accordion.Collapse>
    </Card>
});

const SortableInfiniteList = sortableContainer(({ items, open, cid, pid, token, toOpen }) => {
    console.log(items, "this are items passed");
    return (
        <Infinite
            containerHeight={400}
            elementHeight={49}
            className="scrolling"
        >
            {items && items.map(({ priority, height, name, creationTime, estimatedDate, status, description, id }, index) => (
                <SortableItem
                    key={`item-${index}`}
                    index={index}
                    sno={index + 1}
                    height={height}
                    taskname={name}
                    created={creationTime}
                    estimate={estimatedDate}
                    status={status}
                    body={description}
                    open={open}
                    id={id}
                    cid={cid}
                    pid={pid}
                    token={token}
                    toOpen={toOpen}
                />
            ))}
        </Infinite>
    );
});





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

const modalStyle = function () {
    // we use some psuedo random coords so nested modals
    // don't sit right on top of each other.
    let top = 50;
    let left = 50;

    return {
        position: 'fixed',
        width: 650,
        height: 360,
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

const modalStyle4 = function () {
    // we use some psuedo random coords so nested modals
    // don't sit right on top of each other.
    let top = 50;
    let left = 50;

    return {
        position: 'fixed',
        width: 600,
        height: 500,
        zIndex: 1040,
        top: top + '%',
        left: left + '%',
        borderRadius: '8px',
        backgroundColor: 'black',
        boxShadow: '0 5px 15px rgba(0,0,0,.5)',
        padding: 0,
        overflow: 'hidden',
        transform: 'translate(-50%, -50%)'
    };
};







class Tasks extends Component {
    constructor(props) {
        super(props);
        console.log("ye hai props inside constructor", this.props);

        this.state = {
            pid: "",
            name: "",
            description: "",
            id: this.props,
            showModal: false,
            showModal2: false,
            showModal3: false,
            showModal4: false,
            showModal5: false,
            deleteMonitorConfirm:false,
            project: {
                name: "",
                description: ""
            },
            team: [],
            open: false,
            loading: false,
            editLoading: false,
            deleteLoader:false,
            startDate: new Date()
        };

        this.close = () => {
            this.setState({ showModal: false });
        };

        this.open = () => {
            this.setState({ showModal: true });
        };




    }
    close3 = () => {

        this.setState({ showModal3: false });
    };

    open3 = (id) => {
        console.log(id,"ye hain id")
        this.setState({
            showModal3: true,

            editId:id
        });
    }

    close4 = () => {

        this.setState({
            showModal4: false,
            deleteLoader:false
        });
    };
    open4 = () => {
        // console.log(id,"ye hain id")
        this.setState({
            showModal4: true,
            fetchEmpLoader:true
            // editId:id
        });
        const url_emp= "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/"+localStorage.getItem('clientId')+"/employees/";
        console.log(url_emp,"sending fetch emp request");
        fetch(url_emp,{
            headers: {
                Authorization: "Bearer "+this.props.auth.stsTokenManager.accessToken
            }
        })
            .then(res => res.json())
            .then(data => {

                // console.log("cdcqqqqqqqqqqqqqqdsc",data);
                const arr = data.res;
                this.setState({
                    monitors:arr,
                    fetchEmpLoader:false
                })


            })

            .catch(err => console.log(err))
    }

    close5 = () => {

        this.setState({
            showModal5: false,
            deleteLoader:false
        });
    };
    open5 = (id) => {
        console.log(id,"ye hain id")
        this.setState({
            showModal5: true,
            deleteLoader: true,
            deleteId:id
        });
    }

    addToState = (val) => {
        let array = [...this.state.team];
        let index=-1;
        for (let i=0;i<array.length;i++){
            if(val.id===array[i].id){
                index = i;
            }
        }
        if(index===-1){
            this.setState({
                team:[...this.state.team,val]
            })
        }

    }

    handleDeleteMonitor = () => {
        this.setState({
            deleteMonitorConfirm:true
        })

        const dataObj = {
            "update": {
                "team": [{"id":this.state.deleteId}]
            }
        }
        console.log(dataObj);
        const url= "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/"+localStorage.getItem('clientId')+"/projects/"+this.props.match.params.pid+"/employees/remove";
        console.log(url,"sending put project",this.props);
        fetch(url,{
            headers: {
                Authorization: "Bearer "+this.props.auth.stsTokenManager.accessToken,
                "Content-Type":"application/json"
            },
            method: 'PUT',
            body: JSON.stringify(dataObj)
        })
            .then(res => res.json())
            .then(data => {

                console.log("anurag",data);
                if(data.error){
                    console.log("errrrrrrrrrrror")

                    this.setState({
                        deleteMonitorConfirm:false
                    })
                }
                else {
                    // window.location.reload(false);
                    let array = [...this.state.team];
                    let index=null;
                    for(let i=0; i<array.length;i++)
                    {
                        if(array[i].id===this.state.deleteId) {
                            index=i;
                        }
                    }
                    if(index!==null){
                        array.splice(index,1);
                        this.setState({
                            team:array
                        })
                    }
                    this.close5();
                    this.setState({
                        deleteMonitorConfirm:false
                    })
                }
            })

            .catch(err => {
                console.log(err);
                this.setState({
                    deleteMonitorConfirm:false
                })

            })
    }

    deleteTask = () => {
        // console.log("ye hai id",id);

        this.setState({
            deleteLoader:true
        })
        const url_task_id = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/projects/" + this.props.match.params.pid + "/tasks/" + this.state.editId;
        console.log(url_task_id);


        fetch(url_task_id, {
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
                    console.log(data.error,"this is the error coming while deleting task")

                }
                else {
                    window.location.reload(false);

                }

            })
            .catch(err => console.log(err));
    }

    componentDidMount() {
        console.log("see props inside componentDidMount", this.props);
        const url_project = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/projects/" + this.props.match.params.pid;
        // console.log(url);
        fetch(url_project, {
            headers: {
                Authorization: "Bearer " + this.props.auth.stsTokenManager.accessToken
            }
        })
            .then(res => res.json())
            .then(data => {

                // console.log("cdcdsc",data);

                // console.log(data.res);
                const arr = data.res.project.team;
                this.setState({
                    project: {
                        name: data.res.project.name,
                        description: data.res.project.description
                    },
                    team: arr
                })

            })

            .catch(err => console.log(err));


        const url_task = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/projects/" + this.props.match.params.pid + "/tasks/";
        // console.log(url);
        fetch(url_task, {
            headers: {
                Authorization: "Bearer " + this.props.auth.stsTokenManager.accessToken
            }
        })
            .then(res => res.json())
            .then(data => {

                // console.log("cdcdsc",data);
                this.setState({
                    items: data.res
                })
                if (!data.res) {
                    this.setState({
                        items: []
                    })
                }

                // console.log(data.res);


            })
            .catch(err => console.log(err));
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(prevProps,"prevProps")
        // console.log(prevState,"prevState")
        // console.log(snapshot,"snapshot")
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            id: nextProps,
            project: {
                name:"",
                description:""
            },
            items:null,
            team:null
        })
        console.log(nextProps, "cdcdscdvfdgewdS")
        console.log(nextContext, "cdcdscdvfdgewdS")
        console.log(this.state, "cdcdscdvfdgewdS")
        const url_project = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/projects/" + nextProps.match.params.pid;
        console.log("this is nextProp", nextProps);
        // console.log(url);
        fetch(url_project, {
            headers: {
                Authorization: "Bearer " + this.props.auth.stsTokenManager.accessToken
            }
        })
            .then(res => res.json())
            .then(data => {

                // console.log("cdcdsc",data);

                // console.log(data.res);
                const arr = data.res.project.team;
                this.setState({
                    project: {
                        name: data.res.project.name,
                        description: data.res.project.description
                    },
                    team: arr
                })

            })

            .catch(err => console.log(err));


        const url_task = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/projects/" + nextProps.match.params.pid + "/tasks/";
        // console.log(url);
        fetch(url_task, {
            headers: {
                Authorization: "Bearer " + this.props.auth.stsTokenManager.accessToken
            }
        })
            .then(res => res.json())
            .then(data => {

                // console.log("cdcdsc",data);

                this.setState({
                    items: data.res
                })
                if (!data.res) {
                    this.setState({
                        items: []
                    })
                }

            })
            .catch(err => console.log(err));
    }


    renderBackdrop(props) {

        return <div {...props} style={backdropStyle} />;
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex && !this.state.items[oldIndex].status.completed && !this.state.items[newIndex].status.completed) {
            let priority = 0;
            this.setState(({ items }) => ({
                items: arrayMove(items, oldIndex, newIndex),
            }));
            // console.log("oldindex",this.state.items[oldIndex-1],this.state.items[oldIndex],this.state.items[oldIndex+1])
            let prevPriority = (this.state.items[newIndex - 1]) ? this.state.items[newIndex - 1].priority : 0;
            let nextPriority = (this.state.items[newIndex + 1]) ? this.state.items[newIndex + 1].priority : 0;
            if (prevPriority !== 0 && nextPriority !== 0) {
                priority = (prevPriority + nextPriority) / 2;
            }
            else if (prevPriority === 0) {
                priority = nextPriority - 20;
            }
            else if (nextPriority === 0) {
                priority = prevPriority + 20;
            }
            console.log("newindex", this.state.items[newIndex - 1], this.state.items[newIndex], this.state.items[newIndex + 1])

            console.log("priority", priority)
            this.setState(prevState => {
                const items = [...prevState.items];
                items[newIndex] = { ...items[newIndex], priority: priority }
                return { items }
            })

            const url_task_id = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/projects/" + this.props.match.params.pid + "/tasks/" + this.state.items[newIndex].id;
            // console.log(url);
            const dataObj = {
                "update": {
                    "priority": priority
                }
            }

            fetch(url_task_id, {
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

                })
                .catch(err => console.log(err));

        }
    };

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,

        })
    }



    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        })
        let name = this.state.name;
        let description = this.state.description;
        let status = {
            notYetStarted: true,
            inProgress: false,
            finishAndInReview: false,
            completed: false
        };
        let markAsUrgent = document.getElementById('checkbox').checked;
        // console.log(markAsUrgent);
        let numberOfHours = "";
        let dataObj = { name, description, status, markAsUrgent, numberOfHours };

        // console.log(dataObj);
        // console.log(this.state.id.match.params.pid);

        const url_task = "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/" + localStorage.getItem('clientId') + "/projects/" + this.state.id.match.params.pid + "/tasks/";
        // console.log(url_task,"cddscsdCds",this.props);
        fetch(url_task, {
            headers: {
                Authorization: "Bearer " + this.props.auth.stsTokenManager.accessToken,
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(dataObj)
        })
            .then(res => res.json())
            .then(data => {

                console.log("anurag", data);

                if (data.error) {
                    this.setState({
                        loading: false
                    })
                }
                else {
                    window.location.reload();
                }
            })

            .catch(err => {
                console.log(err)
                this.setState({
                    loading: false
                })
            })

    }



    getInitals(stringData) {
        console.log(stringData)
        let strings = stringData.split(" ");
        if (strings.length > 1)
            return strings[0].charAt(0).toUpperCase() + "" + strings[1].charAt(0).toUpperCase()
        else return stringData.charAt(0).toUpperCase();
    }


    render() {
        console.log("ye hai props inside render method", this.state);
        const { items, open } = this.state;
        // console.log("ye hai tasks",tasks)
        // console.log("ye hai items",items)
        let role = localStorage.getItem("role");

        return (
            <div className="tasks">
                <div className="headerTask">
                    <div className="sets">
                        {
                            this.state.team && this.state.team.map((employee, index) =>
                                // console.log(employee,"this is employee list")
                                <div className="set" key={index}>
                                    <div className="profileImg">
                                        <div className="profile" >{this.getInitals(employee.name)} </div>
                                    </div>

                                    <div className="name">
                                        <p>{employee.name.split(" ")[0]}</p>
                                    </div>

                                </div>
                            )
                        }
                        {(role==="admin" || role==="manager") && <div className="addMonitors">
                            <div className="editIconInside" onClick={this.open4}>
                                {/*<i className="fa fa-pencil" aria-hidden="true" title="Edit Monitors"></i>*/}
                                <img src={Edit} />
                            </div>
                        </div>}
                    </div>
                    {/*uncomment to add search bar*/}


                    {/*<div className="searchTask">*/}
                    {/*    <i className="fa fa-search fa-xs ic"></i>*/}
                    {/*    <input type="text" className="search" placeholder="Search task"/>*/}


                    {/*</div>*/}
                    <div className="addButton modal-example">
                        {(role==="admin" || role==="manager") && <button onClick={this.open} className="add_task" type="button">
                            {" "}
                            <span>+</span> Add Task{" "}
                        </button>}

                        <Modal
                            onHide={this.close}
                            style={modalStyle()}
                            aria-labelledby="modal-label"
                            show={this.state.showModal}
                            renderBackdrop={this.renderBackdrop}
                        >
                            <div className="modalMain">
                                <h2 id="modal-label">CREATE TASK</h2>
                            </div>
                            <Form onSubmit={this.handleSubmit}>
                                <div className="check">
                                    <Form.Group style={{ float: 'right' }} controlId="formBasicChecbox">
                                        <Form.Check id="checkbox" type="checkbox" label="mark me urgent" />
                                    </Form.Group>
                                </div>


                                <Form.Group>
                                    <Form.Label className="taskLabel">TASK NAME</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Write here...."
                                        className="nameField"
                                        id="name"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label className="taskLabel">TASK DESCRIPTION</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Write here...."
                                        className="desField"
                                        id="description"
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="createBt">
                                    <Button type="submit" variant="secondary" size="sm" className="taskCreate" >
                                        {this.state.loading ? <i className={"fa fa-refresh fa-spin"}></i> : "CREATE"}
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
                                <Modal.Title>Delete Task</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <p>Are you sure you want to delete ?</p>
                            </Modal.Body>

                            <Modal.Footer>
                                { this.state.deleteLoader ? "" : <Button variant="secondary" onClick={this.close3}>Cancel</Button>}
                                <Button variant="danger" onClick={this.deleteTask}>
                                    {this.state.deleteLoader ? <i className={"fa fa-refresh fa-spin"}></i> : "Confirm"}
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>



                </div>

                <div className="bodyTask">
                    <h4>{(this.state.project.name) ? this.state.project.name : <lines className="shine proj_name"></lines>}</h4>
                    <p>{(this.state.project.description) ? this.state.project.description : <lines className="shine proj_desc"></lines>}</p>


                    {items && items.length !== 0 && <div className="tableHeader">
                        <div className="num"></div>
                        <div className="taskname">Task Name</div>
                        <div className="created">Created on</div>
                        <div className="estimate">Estimate Delivery</div>
                        <div className="status">Status</div>
                        {(role==="admin" || role==="manager") && <div className="delete"></div>}
                        <div className="arrow"></div>
                    </div>}
                    {console.log(!items)}
                    {console.log(items)}

                    {!items && <div className="task-tableBody">
                        <div className="num"><lines className="shine task_holder_num"></lines></div>
                        <div className="taskname"><lines className="shine task_holder_name"></lines></div>
                        <div className="created"><lines className="shine task_holder"></lines></div>
                        <div className="estimate"><lines className="shine task_holder"></lines></div>
                        <div className="status"><lines className="shine task_holder"></lines></div>
                        {(role==="admin" || role==="manager") && <div className="delete" ></div>}
                        <div className="arrow"></div>
                    </div>}

                    {items && items.length === 0 && <div className={"task-div"}><img className="no_task" src={NO_Tasks} alt="logo" /></div>}
                    {items && items.length === 0 && <div className={"no_task-div"}><p className={"no_proj"}>No tasks added !!!</p></div>}

                    <Accordion>
                        <SortableInfiniteList items={items} open={open} toOpen={this.open3} cid={localStorage.getItem('clientId')} pid={this.props.match.params.pid} token={this.props.auth.stsTokenManager.accessToken} onSortEnd={this.onSortEnd} />
                    </Accordion>


                    <Modal
                        onHide={this.close4}
                        style={modalStyle4()}
                        aria-labelledby="modal-label"
                        show={this.state.showModal4}
                        renderBackdrop={this.renderBackdrop}
                    >

                        <div className="monitorHeading">
                            <h5 id="modal-label">Add New Monitors</h5>
                        </div>

                        <br/>

                        <AddMonitors
                            options={this.state.monitors}
                            pid={this.props.match.params.pid}
                            token={this.props.auth.stsTokenManager.accessToken}
                            fetchEmpLoader={this.state.fetchEmpLoader}
                            addToState={this.addToState}
                        />

                        <br/>
                        <br/>

                        <div className="monitorHeading">
                            <h5 id="modal-label">Current Monitors</h5>
                        </div>

                        <br/>

                        <div className="monitor-list">
                            {
                                this.state.team && this.state.team.map((employee, index) =>
                                    // console.log(employee,"this is employee list")
                                    <div className="monitor" key={index}>
                                        <div className="profileImg monitorImg">
                                            <div className="profile">{this.getInitals(employee.name)} </div>
                                        </div>
                                        <div className="monitorName vert-align">{employee.name}</div>
                                        <div className="monitorMail vert-align">{employee.email}</div>
                                        <div className="vert-align">
                                            <img src={Pic} alt="logo" className="vert-align deleteEmp" title={"Delete"} onClick={() => this.open5(employee.id)} />
                                        </div>

                                    </div>
                                )
                            }
                        </div>


                    </Modal>
                    <Modal
                        onHide={this.close5}
                        className={"delete-model"}
                        aria-labelledby="modal-label"
                        show={this.state.showModal5}
                        renderBackdrop={this.renderBackdrop}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Monitor</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Are you sure you want to delete ?</p>
                        </Modal.Body>

                        <Modal.Footer>
                            { this.state.deleteMonitorConfirm ? "" : <Button variant="secondary" onClick={this.close5}>Cancel</Button>}
                            <Button variant="danger" onClick={this.handleDeleteMonitor}>
                                {this.state.deleteMonitorConfirm ? <i className={"fa fa-refresh fa-spin"}></i> : "Confirm"}
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </div>

            </div>
        );
    }
}


const mapStateToProps = (state) => {
    console.log("my name is state1", state);
    return {
        auth: state.firebase.auth
    }
}
export default connect(mapStateToProps)(Tasks);