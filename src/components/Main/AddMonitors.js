import React, { Component } from "react";
import { Button, Form, Row } from "react-bootstrap";
import "./AddMonitors.css";


class AddMonitors extends Component {
    state = {
        name: "",
        loading:false
    };



    addChange = () => {
        const name = document.getElementById("empName").value;
        if(name!==""){
            let id = "";
            let email= "";
            console.log("see this",name);
            const keys = document.querySelectorAll("#data-list option");
            let dataObj = null
            // console.log(keys)
            keys.forEach((key,item)=>{
                if(key.getAttribute("value").toString().toLowerCase()===name.toString().toLowerCase()) {
                    console.log(key.getAttribute("data-id"))
                    id=key.getAttribute("data-id");
                    console.log(key.getAttribute("data-email"));
                    email=key.getAttribute("data-email");

                    dataObj = {
                        "update": {
                            "team": [{name, id, email}]
                        }
                    }
                }
            })
            // const dataObj = {name,id,email};

            console.log(dataObj);
            if(dataObj){
                this.setState({
                    loading:true
                })

                const url= "https://us-central1-dexpert-admin.cloudfunctions.net/api/clients/"+localStorage.getItem('clientId')+"/projects/"+this.props.pid+"/employees/add";
                console.log(url,"sending put project",this.props);
                fetch(url,{
                    headers: {
                        Authorization: "Bearer "+this.props.token,
                        "Content-Type":"application/json"
                    },
                    method: 'PUT',
                    body: JSON.stringify(dataObj)
                })
                    .then(res => res.json())
                    .then(data => {

                        console.log("anurag",data);
                        this.props.addToState({name, id, email})
                        this.setState({
                            loading:false
                        })
                        if(data.error){
                            console.log("errrrrrrrrrrror")


                        }
                        else {
                            // window.location.reload(false);
                        }
                    })

                    .catch(err => {
                        console.log(err);
                        this.setState({
                            loading:false
                        })

                    })
            }
            document.getElementById("empName").value="";
        }};


    render() {
        // console.log("zzzzzzzzzzzzz",this.props)
        return (
            <React.Fragment>
                <datalist
                    id={"data-list"}
                >
                    {this.props.options && this.props.options.map((employee, id) => (
                        <option
                            data-id={employee.id}
                            data-name={employee.name}
                            data-email={employee.email}
                            className="opt"
                            value={employee.name}
                            key={id}
                        >
                            {`      ${employee.email}`}
                        </option>
                    ))}
                </datalist>
                <Form.Group as={Row} className={"alignment-bt"}>
                    <Form.Control
                        type="text"
                        placeholder="Add monitors"
                        className="addMonitor"
                        list={"data-list"}
                        id={"empName"}
                        onChange={this._onChange}
                    />
                    <Button className={"add-monitor-bt"} variant="secondary" size="sm" onClick={this.addChange}>
                        {this.props.fetchEmpLoader ? <i className={"fa fa-spinner fa-spin"}></i> : this.state.loading ? <i className={"fa fa-circle-o-notch fa-spin"}></i> : <b>add</b>}
                    </Button>
                </Form.Group>
            </React.Fragment>
        );
    }
}

export default AddMonitors;
