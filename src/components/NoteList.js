import React, { Component } from 'react';
import NoteListItem from './NoteListItem';

const axios = require('axios');

class NoteList extends Component {

  state = {
    notes: [],
    current_note: {id: ""}
  }

  componentDidMount() {
    axios.get('http://localhost:9000/api/notes')
      .then((res) => {
        this.setState({notes: res.data.notes})
      }).catch((err) => {
        console.error(err)
      })
  }

  addNote() {
    var notes = this.state.notes;
    axios.post('http://localhost:9000/api/notes/create')
      .then((res) => {
        this.pickNote(res.data)
        notes.push(res.data)
        this.setState({notes: notes})
      }).catch((err) => {
        console.error(err)
      })
  }

  pickNote(note) {
    // console.log(note)
    this.setState({current_note: note})
    this.props.changeNote(note)
  }

  editNote(note) {
    var notes = this.state.notes;
    for (var i = 0; i < notes.length; i++) {
      if (notes[i].id == note.id) {
        notes[i] = note;
      }
    }

    this.setState({notes: notes, current_note: note})
  }

  deleteNote(note) {
    var notes = this.state.notes;
    var filteredNotes = notes.filter((row) => row.id != note.id)

    this.setState({notes: filteredNotes, current_note: {id: ""}})
  }

  render() {
    let self = this;
    this.state.notes.sort(function(a,b) {
      return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
    })
    return (
      <div className="note-list">
        <button className="btn btn-block btn-primary" onClick={this.addNote.bind(this)}>+ New Note</button>
        {this.state.notes.map(function(note, i) {
          return <NoteListItem current_note={self.state.current_note} note={note} key={note.id} pickNote={self.pickNote.bind(self)} />
        })}
      </div>
    );
  }

}

export default NoteList;
