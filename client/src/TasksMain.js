import React, { Component } from 'react'
import './TasksMain.css'
import axios from 'axios'
import Modal from 'react-modal'
import {Link} from "react-router-dom";
import pic from "./icon.png"

const navStyle = { 
  textDecoration: 'none', color:'black' 
}

class TasksMain extends Component {

  constructor(props){
    super(props);
    this.state = {
      tasks : [],
      currTask : {},
      newTask : "",
      newDesc : "",
      isActiveEdit: false,
      isActiveDelete: false,
      isActiveView: false,
      name: "",
      age: null,
      password: "",
      email: "",
      avatar: null
    };
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.resetUserInputs=this.resetUserInputs.bind(this);
    this.getTask=this.getTask.bind(this);
    this.handleEdit=this.handleEdit.bind(this);
    this.deleteUser=this.deleteUser.bind(this);
    this.logout=this.logout.bind(this)
    this.fileUpload=this.fileUpload.bind(this)
  }

  componentDidMount(){

    const token = localStorage.authToken
    Modal.setAppElement('body')
    if(!token){
      this.props.history.push('/')
    }

    axios({
      url: '/users/me',
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      this.setState({
        name: res.data.name,
        email: res.data.email,
        age: res.data.age
      })
    }).catch((err)=>{
      console.log("GET Users Error" + err)
    })

    axios({
      url: '/tasks?sortBy=createdAt:desc',
      method: 'GET',
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      this.setState({
        tasks:res.data,
      });
      if(res.data[0]!==undefined){
        this.setState({ currTask: res.data[0] });        
      }
    }).catch((err)=>{
      console.log("Get tasks error"+err)
    })

    axios({
      url: '/users/avatar',
      method: 'GET',
      responseType: 'blob',
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      const data = res.data
      this.setState({
        avatar: URL.createObjectURL(data)
      });
    }).catch((err)=>{
      this.setState({
        avatar: pic
      });
      console.log("Get avatar error"+err)
    })

  }

  // componentWillMount(){
    
  // }

  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  toggleModalEdit=()=>{
    this.setState({
      isActiveEdit: !this.state.isActiveEdit
    })
  }

  toggleModalDelete=()=>{
    this.setState({
      isActiveDelete: !this.state.isActiveDelete
    })
  }

  toggleModalView=()=>{
    this.setState({
      isActiveView: !this.state.isActiveView
    })
  }

  fileUpload(e){
    e.preventDefault()
    const token = localStorage.authToken
    const data1 = new FormData() 
    data1.append('avatar', e.target.files[0])
    
    // setTimeout(() => {  
      axios({
        url: '/users/me/avatar',
        method: 'POST',
        data: data1,
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/form-data`
      }
      }).then((res)=>{
        const newData = res.data
        // console.log('res '+ res.data)
        this.setState({
          avatar: URL.createObjectURL(newData)
        });
      }).catch((err)=>{
        console.log(err)
      })
    // }, 5000);
  }

  handleSubmit(e){
    e.preventDefault();
    const token = localStorage.authToken
    const payload = {
      title: this.state.newTask,
      description: this.state.newDesc
    }
    axios({
      url: '/tasks',
      method: 'POST',
      data: payload,
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      this.setState({
        tasks:res.data
      });
      this.resetUserInputs()
    }).catch((err)=>{
      console.log(err)
    })
  }

  handleDelete(id){
  const token = localStorage.authToken
    axios({
      url: `/tasks/${id}`,
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      this.setState({
        tasks:res.data,
        currTask: null
      });

    }).catch((err)=>{
      console.log('Enable to delete task'+ err)
    })
    
  }

  handleEdit(e){
    e.preventDefault();
    const token = localStorage.authToken
    const {name,password,age} =  this.state;
    let payload = {}
    if(name!==""){
      payload = { ...payload, name:this.state.name }
    }
    if(password!==""){
      payload = { ...payload, password: this.state.password }
    }
    if(age!==null){
      payload = { ...payload, age: this.state.age }
    }
    axios({
      url: '/users/me',
      method: 'PATCH',
      data: payload,
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      this.setState({
        name: res.data.name,
        age: res.data.age
      })
    }).catch((err)=>{
      console.log(err)
    })
  }

  deleteUser(){
    const token = localStorage.authToken
    axios({
      url: '/users/me',
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      localStorage.removeItem('authToken')
      this.props.history.push('/')
    }).catch((err)=>{
      console.log('Unable to delete account' + err)
    })
  }
    
  getTask(id){
    const task = this.state.tasks.find( task => task._id === id)
    this.setState({currTask:task})
  }

  handleMark(id){
    const token = localStorage.authToken
    const task = this.state.tasks.find( task => task._id === id)
    let payload = {}
    if(task.completed){
      payload = {
        completed: false
      }
    }else{
      payload = {
        completed: true
      }
    }
    axios({
      url: `/tasks/${id}`,
      method: 'PATCH',
      data: payload,
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      // const task1 = this.state.tasks.find( task1 => task1._id === id)
      this.setState({
        tasks:res.data,
        // currTask:task1
      });
      this.getTask(id)
    }).catch((err)=>{
      console.log(err)
    })
  }

  logout(){
    const token = localStorage.authToken
    axios({
      url: '/users/logout',
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`}
    }).then((res)=>{
      console.log(res.data)
      localStorage.removeItem('authToken')
      this.props.history.push('/login')
    }).catch((err)=>{
      console.log('Unable to logout\n'+err)
    })
  }
  
  resetUserInputs(){
    this.setState({
      newTask: '',
      newDesc: ''
    })
  }
  render() {
    return (
      <>
        <div className="NavMain">
          <ul>
          <Link to='/tasks' style={navStyle}>
            <li onClick={this.toggleModalView}>View Profile</li></Link>
            <Modal isOpen={this.state.isActiveView} onRequestClose={this.toggleModalView} className='modal-view'>
              <h3>Your Profile</h3>
              <label for="file-upload" class="custom-file-upload">
                <img src={this.state.avatar} alt = 'Profile Pic'></img>
                <div className='middle'>
                <div className="text">Upload an image</div>
                </div>
                <input id="file-upload" type="file" className="image-file" name="file" accept="image/*" onChange={(event)=> { this.fileUpload(event) }}/>
              </label>
              <div className='view-header'><hr/></div>
              <div className='main-view'>
                <div className="text-area">
                  <div className='col-1'>Name</div>
                  <div className='col-2'>: &nbsp;{ this.state.name }</div>
                </div>
                <div className="text-area">
                  <div className='col-1'>Email</div>
                  <div className='col-2'>: &nbsp;{ this.state.email }</div>
                </div>
                <div className="text-area">
                  <div className='col-1'>Age</div>
                  <div className='col-2'>: &nbsp;{ this.state.age }</div>
                </div>
              </div>
            </Modal>
            <Link to='/tasks' style={navStyle}>
            <li onClick={this.toggleModalEdit}>Edit Profile</li></Link>
              <Modal isOpen={this.state.isActiveEdit} onRequestClose={this.toggleModalEdit} className='modal'>
                {/* <div className='close'></div> */}
                <div className='heading'>
                  <h3>Edit Your Profile</h3>
                  <br></br>
                  {/* <h4>Note that only Name, Age and Password can be edited here.</h4><br></br> */}
                  <p>&emsp;Type only on those fields which you want to edit.</p><br/><hr/><br/>
                  
                </div>
                  <form onSubmit={this.handleEdit} className='form-main'>
                    <p>Name</p>
                      <input 
                        type = "text"
                        placeholder = 'Enter your name'
                        value={this.state.name}
                        name="name"
                        id="name"
                        onChange={this.handleChange}/><br/>
                    <p>Password</p>
                      <input
                        type="password" 
                        placeholder="************"
                        value={this.state.password}
                        name="password"
                        id="password"
                        onChange={this.handleChange}/><br/>
                    <p>Age</p>
                      <input
                        type="number" 
                        placeholder="Your Age"
                        id="age"
                        value={this.state.age}
                        name="age"
                        onChange={this.handleChange}
                      /><br/>
                    <button className="edit-Button" onRequestClose={this.toggleModalEdit}>Save Changes
                    </button>
                  </form>
                
              </Modal>
              <Link to='/tasks' style={navStyle}>
              <li onClick={this.toggleModalDelete}>Delete Account</li></Link>
              <Modal isOpen={this.state.isActiveDelete} onRequestClose={this.toggleModalDelete} className='modal-delete'>                
                <h3>Are you sure want to delete this Account?</h3>
                <button onClick={this.deleteUser}>Yes, I want to</button>
              </Modal>
            <Link to='/' style={navStyle}>
            <li onClick={this.logout}>Logout</li></Link>
          </ul>
        </div>
        <div className="Tasks">
          <div className="Tasks-List">
            <ul>
              <h4>Your Tasks</h4>
              {this.state.tasks.map(task=>{
                let taskCLass1 = "";
                let taskCLass2 = "";
                taskCLass1 = taskCLass1 + (task.completed && "completed");
                taskCLass2 = taskCLass2 + ( this.state.currTask!==null && this.state.currTask._id===task._id && "selected");
                return(
                  <li className={`${taskCLass1} ${taskCLass2}`}
                    onClick={()=>this.getTask(task._id)}
                  >      
                    {task.title}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="Tasks-Info">
              {this.state.currTask===null ? 
              <div>
              <h4> Select Any Task </h4>
              <h5> &nbsp;&nbsp;Or create new task</h5>
              </div> :
              <div className="Tasks-Description">
                <h4>{this.state.currTask.title}</h4>
                <p className="Description-Text">{this.state.currTask.description}</p>
                <div className="Desc-Buttons">
                  <button
                    className="Desc-Remove"
                    onClick={()=>this.handleDelete(this.state.currTask._id)}>
                    Delete this Task  
                      <i class="fas fa-times-circle"></i>
                  </button>
                  <button 
                    className="Desc-Done"
                    onClick={()=>this.handleMark(this.state.currTask._id)}>   
                    {this.state.currTask.completed?"Mark as Incomplete":"Mark as Complete"}
                    <i class="fas fa-check-square"></i>
                  </button>
                </div>
              </div>}
            <div className="Tasks-Add">
              <h4>Add New Task </h4>
              <form onSubmit={this.handleSubmit} className="Add-Main">
                <div className="Add-Content">
                  <input 
                    placeholder="Topic of the Task"
                    type="text" 
                    value={this.state.newTask}
                    name="newTask"
                    onChange={this.handleChange}
                    />
                  <textarea 
                    placeholder="Description of the Task"
                    value={this.state.newDesc}
                    name="newDesc"
                    onChange={this.handleChange}/>
                </div>
                <button className="Add-Button">Add 
                  <i class="fas fa-plus-circle"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default  TasksMain;