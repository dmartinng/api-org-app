import React, { Component } from 'react';

const moment = require('moment');

class NoteListItem extends Component {

  state = {
    id: "",
    title: "",
    text: "",
    last_updated: ""
  }

  constructor(props) {
    super();

    this.state = props.note;
  }

  componentWillReceiveProps(props) {
    this.setState({
      id: props.note.id,
      title: props.note.title,
      text: props.note.text,
      last_updated: props.note.last_updated
    })
  }

  pickNote() {
    this.props.pickNote(this.state)
  }

  render() {
    let titleText = ""
    if(this.state.title === "") {
      titleText = <h4 className="text-muted"><i>Untitled Note</i></h4>
    } else {
      titleText = <h4>{this.state.title}</h4>
    }

    let entryText = ""
    if(this.state.text === "") {
      entryText = <p className="text-muted"><i>Empty note</i></p>
    } else {
      entryText = <p>{this.state.text.substring(0,20)}</p>
      if (this.state.text.length > 20) {
        entryText = <p>{this.state.text.substring(0,20)}...</p>
      }
    }

    let selectedStyle = {}
    if(this.state.id === this.props.current_note.id) {
      selectedStyle = {backgroundColor: "#ccc"}
    }

    return (
      <div className="note-list-item" onClick={this.pickNote.bind(this)} style={selectedStyle} >
        {titleText}
        <p>{entryText}</p>
        <p className="text-muted"><small>Last updated: {moment(this.state.last_updated).fromNow()}</small></p>
      </div>
    );
  }

}

export default NoteListItem;
