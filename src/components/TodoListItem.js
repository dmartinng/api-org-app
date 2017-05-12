import React, { Component } from 'react';
const axios = require('axios');

class TodoListItem extends Component {

  constructor(props) {
    super();

    this.state = props.task;
  }

  handleTaskToggle() {
    axios.post('http://localhost:9000/api/tasks/toggle', { id: this.state.id })
      .then((res) => {
        this.setState(res.data);
      }).catch((err) => {
        console.log(err);
      })
  }

  deleteTask() {
    axios.post('http://localhost:9000/api/tasks/delete', {id: this.state.id})
      .then((res) => {
        this.props.deleteTask(this.state.id)
      }).catch((err) => {
        console.log(err);
      })
  }

  render() {
    var taskStyle = {}
    if (this.state.completed) {
      taskStyle = {textDecoration: "line-through"}
    }
    return (
      <div className='todo-list-item'>
        <label style={taskStyle}><input type="checkbox" value="" checked={this.state.completed} onChange={this.handleTaskToggle.bind(this)} /> {this.state.entry}</label> <button className="btn btn-danger btn-sm" onClick={this.deleteTask.bind(this)}>x</button>
      </div>
    );
  }
}

export default TodoListItem;
