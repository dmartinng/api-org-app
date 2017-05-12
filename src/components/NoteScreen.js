import React, { Component } from 'react';

const axios = require('axios');

class NoteScreen extends Component {

  state = {
    note: {},
  }

  constructor(props) {
    super();

    this.state.note = props.note;
  }

  componentWillReceiveProps(props) {
    this.setState({note: props.note});
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // console.log(event.target.name)

    let note = this.state.note;
    note[name] = value;

    this.setState({
      note: note
    });
  }

  handleSubmit(event) {
    event.preventDefault()
    axios.post("http://localhost:9000/api/notes/edit", this.state.note)
      .then((res) => {
        this.props.editNote(res.data)
        this.setState({note: res.data})
      }).catch((err) => {
        console.log(err)
      })
  }

  deleteNote() {
    let currentNote = this.state.note;
    axios.post("http://localhost:9000/api/notes/delete", this.state.note)
      .then((res) => {
        this.props.deleteNote(currentNote)
        this.setState({note: {id: ""}})
      }).catch((err) => {
        console.log(err)
      })
  }

  render() {
    if (this.state.note.id == "") {
      return <h1>Please pick a note</h1>
    }
    return (
      <div className="notes">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" placeholder="Title" className="note-title" value={this.state.note.title} name="title" onChange={this.handleInputChange.bind(this)} />
          <textarea placeholder="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." name="text" value={this.state.note.text} onChange={this.handleInputChange.bind(this)} >{this.state.note.text}</textarea>
          <input type="submit" value="Save" className="btn btn-primary btn-block" />
        </form>
        <button className="btn btn-block btn-danger" onClick={this.deleteNote.bind(this)} style={{marginTop: '20px'}}>Delete Note</button>
      </div>
    );
  }
}

export default NoteScreen;
