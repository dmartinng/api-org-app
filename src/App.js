import React, { Component } from 'react';
import './App.css';

import NoteScreen from './components/NoteScreen'
import NoteList from './components/NoteList'
import TodoList from './components/TodoList'

class App extends Component {

  state = {
    current_note: { id: "" }
  }

  changeNote(note) {
    this.setState({current_note: note});
  }

  editNote(note) {
    this.refs.noteList.editNote(note)
  }

  deleteNote(note) {
    this.refs.noteList.deleteNote(note)
  }

  render() {
    return (
      <div className="main-container">
        <div className="left">
          <NoteList ref='noteList' changeNote={this.changeNote.bind(this)} editNote={this.editNote.bind(this) }/>
        </div>
        <div className="middle">
          <NoteScreen note={this.state.current_note} editNote={this.editNote.bind(this)} deleteNote={this.deleteNote.bind(this)} />
        </div>
        <div className="right">
          <TodoList tasks={this.state.tasks} />
        </div>
    </div>
    );
  }
}

export default App;
