import React, { Component } from 'react';
import TodoListItem from './TodoListItem';
import TodoForm from './TodoForm';

const axios = require('axios');


class TodoList extends Component {

  state = {
    tasks: []
  }

  componentDidMount() {
    axios.get('http://localhost:9000/api/tasks')
      .then((res) => {
        this.setState({tasks: res.data.tasks})
      }).catch((err) => {
        console.error(err)
      })
  }

  addTodo(task) {
    var tasks = this.state.tasks;
    tasks.push(task)
    this.setState({tasks: tasks});
  }

  deleteTask(id) {
    var tasks = this.state.tasks;
    var filteredTasks = tasks.filter((row) => row.id !== id);

    this.setState({tasks: filteredTasks})
  }

  render() {
    let self = this
    return (
      <div className="todo-list">
        <TodoForm addTask={this.addTodo.bind(this)} />
        {this.state.tasks.map(function(task, i) {
          return <TodoListItem task={task} key={task.id} deleteTask={self.deleteTask.bind(self)} />
        })}
      </div>
    );
  }
}

export default TodoList;
