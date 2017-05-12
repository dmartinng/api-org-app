import React, { Component } from 'react';

const axios = require('axios');


class TodoList extends Component {

  state = {
    entry: ""
  }

  handleInputChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		// console.log(event.target.name)

		this.setState({
			[name]: value,
		});
	}

  handleSubmit(event) {
    event.preventDefault()
    axios.post("http://localhost:9000/api/tasks/create", {entry: this.state.entry})
      .then((res) => {
        this.props.addTask(res.data)
        this.setState({entry: ""})
      }).catch((err) => {
        console.log(err)
      })
  }

  render() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit.bind(this)}>
				<div className="form-group">
					<input required type="text" className="form-control" name="entry" id="subtaskDescription" value={this.state.entry} onChange={this.handleInputChange.bind(this)} placeholder="Todo Entry" />
				</div>
				<button type="submit" className="btn btn-default btn-sm">+</button>
			</form>
    );
  }
}

export default TodoList;
