import { cosh } from 'core-js/fn/number';
import React, { Component} from 'react';

class App extends Component {

    constructor(){
        super();
        this.state={
            title:'',
            description:'',
            tasks: [],
            _id:''
        };
        this.addTask = this.addTask.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    addTask(e) {
        if(this.state._id){
            fetch(`/api/tasks/${this.state._id}`, {
                method: 'PUT',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                M.toast({html: 'Task updated'});
                this.setState({title: '', description: '', _id: ''});
                this.fetchTask(); 
            });
        } else {
            fetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }) //send data to my server
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    M.toast({html: 'Task saved'}); //materialize(css) function at moment send data
                    this.setState({title: '', description: ''}); //clean the inputs
                    this.fetchTask(); 
                })
                .catch(res=> console.log(err));
        }

        e.preventDefault(); //page dont refresh at the moment push the bottom
    }

    componentDidMount(){
        this.fetchTask();
    }

    fetchTask(){
        fetch('/api/tasks')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.setState({tasks: data}); //the tasks will print the data from server
            console.log(this.state.tasks)
        });
    }

    deleteTask(id){
        if(confirm('Are you sure you want to delete it?')){
            fetch(`/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                M.toast({html: 'Task deleted'});
                this.fetchTask();
            });
        }
    }

    editTask(id){
        fetch(`/api/tasks/${id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            this.setState({
                title: data.title,
                description: data.description,
                _id: data._id
            })
        });
    }

    handleChange(e){
        //console.log(e.target.value); take tha value of input
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
    }

    render(){
        return(
            <div>
                {/* NAVIGATION */}
                <nav className="light-blue darken-4">
                    <div className="container">
                        <a className="brand-logo" href="/">MERN Stack</a>
                    </div>
                </nav>

                <div className="container">
                    <div className="row">
                        <div className="col s5">
                            <div className="card">
                                <div className="card-content">
                                    <form onSubmit={this.addTask}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input value={this.state.title} name="title" onChange={this.handleChange} type="text" placeholder="Task Title"></input>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <textarea value={this.state.description} name="description" onChange={this.handleChange} placeholder="Task description" className="materialize-textarea"></textarea>
                                            </div>
                                        </div>
                                        <button className="btn light-blue darken-4" type="submit">Enviar</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s7">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.tasks.map(task => {
                                            return (
                                                <tr key={task._id}>
                                                    <td>{task.title}</td>
                                                    <td>{task.description}</td>
                                                    <td>
                                                        <button className="btn light-blue darken-4" onClick={() => this.deleteTask(task._id)}>
                                                            <i className="material-icons">delete</i>
                                                        </button>
                                                        <button className="btn light-blue darken-4" onClick={() => this.editTask(task._id)} style={{margin: '4px'}}>
                                                            <i className="material-icons">edit</i>
                                                        </button>                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
