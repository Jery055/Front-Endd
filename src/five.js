import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './five.css';

function Five() {
  const location = useLocation();
  const navigate = useNavigate();
  const { branch, semester, courseType, subject, userType } = location.state || {};
  const [notes, setNotes] = useState([]);
  const [personalNotes, setPersonalNotes] = useState([]);
  const [editSuggestions, setEditSuggestions] = useState({});
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [newSuggestion, setNewSuggestion] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [visibleNote, setVisibleNote] = useState(null); // Track the note being edited

  const notesKey = `teacherNotes_${subject}`;
  const suggestionsKey = `suggestions_${subject}`;

  useEffect(() => {
    const teacherNotes = localStorage.getItem(notesKey);
    if (teacherNotes) {
      setNotes(JSON.parse(teacherNotes));
    }

    if (userType === 'Student') {
      const studentNotes = localStorage.getItem('personalNotes');
      if (studentNotes) {
        setPersonalNotes(JSON.parse(studentNotes));
      }
    }

    const savedMessages = localStorage.getItem('classroomMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    const savedSuggestions = localStorage.getItem(suggestionsKey);
    if (savedSuggestions) {
      setEditSuggestions(JSON.parse(savedSuggestions));
    }
  }, [notesKey, suggestionsKey, userType]);

  const handleFileUpload = (e, isPersonal = false) => {
    const file = e.target.files[0];
    if (file && (file.type === 'text/markdown' || file.name.toLowerCase().endsWith('.md'))) {
      const reader = new FileReader();
      reader.onload = function(event) {
        const newNote = {
          id: Date.now(),
          title: file.name,
          content: event.target.result
        };
        
        if (isPersonal) {
          const updatedPersonalNotes = [...personalNotes, newNote];
          setPersonalNotes(updatedPersonalNotes);
          localStorage.setItem('personalNotes', JSON.stringify(updatedPersonalNotes));
        } else {
          const updatedNotes = [...notes, newNote];
          setNotes(updatedNotes);
          localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload only markdown (.md) files.');
    }
  };

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      const noteToAdd = { id: Date.now(), ...newNote };
      if (userType === 'Teacher') {
        const updatedNotes = [...notes, noteToAdd];
        setNotes(updatedNotes);
        localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
      }
      setNewNote({ title: '', content: '' });
    } else {
      alert('Please enter both title and content for the new note.');
    }
  };

  const handleDeleteNote = (id, isPersonal = false) => {
    if (isPersonal) {
      const updatedPersonalNotes = personalNotes.filter(note => note.id !== id);
      setPersonalNotes(updatedPersonalNotes);
      localStorage.setItem('personalNotes', JSON.stringify(updatedPersonalNotes));
    } else if (userType === 'Teacher') {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
    }
  };

  const handleTextToSpeech = (content) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentAudio(null);
    } else {
      const utterance = new SpeechSynthesisUtterance(content);
      setCurrentAudio(utterance);
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleSuggestEdit = (noteId) => {
    if (newSuggestion[noteId]) {
      const updatedSuggestions = {
        ...editSuggestions,
        [noteId]: [
          ...(editSuggestions[noteId] || []),
          {
            id: Date.now(),
            content: newSuggestion[noteId],
            timestamp: new Date().toISOString()
          }
        ]
      };
      setEditSuggestions(updatedSuggestions);
      localStorage.setItem(suggestionsKey, JSON.stringify(updatedSuggestions));
      
      setNewSuggestion(prev => ({
        ...prev,
        [noteId]: ''
      }));
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        id: Date.now(),
        from: userType,
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      
      const updatedMessages = [...messages, newMessageObj];
      setMessages(updatedMessages);
      localStorage.setItem('classroomMessages', JSON.stringify(updatedMessages));
      setNewMessage('');
    }
  };

  const handleHomeClick = () => {
    navigate('/second');
  };

  const openNoteEditor = (note) => {
    setVisibleNote(note);
  };

  const closeNoteEditor = () => {
    setVisibleNote(null);
  };

  const handleNoteContentChange = (content) => {
    setVisibleNote(prev => ({ ...prev, content }));
  };

  const saveNoteChanges = () => {
    const updatedNotes = notes.map(note => note.id === visibleNote.id ? visibleNote : note);
    setNotes(updatedNotes);
    localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
    setVisibleNote(null); // Close the editor and return to main view
  };

  const renderNoteItem = (note, isPersonal = false) => (
    <div key={note.id} className="note-item">
      <h3>{note.title}</h3>
      <button onClick={() => openNoteEditor(note)}>View</button>
      <div className="note-actions">
        <button onClick={() => handleTextToSpeech(note.content)}>
          {isPlaying && currentAudio === note ? 'Stop' : 'Play'}
        </button>
        {isPersonal || userType === 'Teacher' ? (
          <>
            <a href={`data:text/markdown;charset=utf-8,${encodeURIComponent(note.content)}`} download={`${note.title}.md`}>
              Download
            </a>
            <button onClick={() => handleDeleteNote(note.id, isPersonal)}>Delete</button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={newSuggestion[note.id] || ''}
              onChange={(e) => setNewSuggestion(prev => ({
                ...prev,
                [note.id]: e.target.value
              }))}
              placeholder="Suggest an edit"
            />
            <button onClick={() => handleSuggestEdit(note.id)}>Submit Suggestion</button>
          </>
        )}
      </div>
      {userType === 'Teacher' && editSuggestions[note.id] && editSuggestions[note.id].length > 0 && (
        <div className="suggestions-list">
          <h4>Suggested Edits:</h4>
          {editSuggestions[note.id].map(suggestion => (
            <div key={suggestion.id} className="suggestion-item">
              <p>{suggestion.content}</p>
              <small>{new Date(suggestion.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="five-page">
      <div className="sidebar">
        <h1>RSET NOTES</h1>
        <button className="sidebar-btn" onClick={handleHomeClick}>
          <i className="fas fa-home"></i> HOME
        </button>
        <button className="sidebar-btn dark-mode-btn">
          <i className="fas fa-moon"></i> DARK MODE
        </button>
        <div className="branch-info">
          <h3>Branch: {branch}</h3>
          <h3>Semester: {semester}</h3>
          <h3>Course: {courseType}</h3>
          <h3>Subject: {subject}</h3>
          <h3>User Type: {userType}</h3>
        </div>
      </div>

      <div className="main-content">
        <h2>Notes for {subject}</h2>
        <div className="notes-grid">
          {notes.map(note => renderNoteItem(note))}
        </div>

        {visibleNote && (
          <div className="note-editor-modal">
            <h3>Editing: {visibleNote.title}</h3>
            <ReactQuill value={visibleNote.content} onChange={handleNoteContentChange} />
            <button onClick={saveNoteChanges}>Save Changes</button>
            <button onClick={closeNoteEditor}>Close</button>
          </div>
        )}

        {userType === 'Teacher' && (
          <div className="teacher-section">
            <h3>Add New Note</h3>
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <textarea
              placeholder="Note Content (Markdown supported)"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
            <button onClick={handleAddNote}>Add Note</button>

            <h3>Upload New Note</h3>
            <input type="file" accept=".md" onChange={(e) => handleFileUpload(e)} />
          </div>
        )}

        {userType === 'Student' && (
          <div className="student-section">
            <h3>Upload Personal Note</h3>
            <input type="file" accept=".md" onChange={(e) => handleFileUpload(e, true)} />

            <h3>Your Personal Notes</h3>
            <div className="notes-grid">
              {personalNotes.map(note => renderNoteItem(note, true))}
            </div>
          </div>
        )}

        <div className="messaging-section">
          <h3>Messages</h3>
          <div className="message-list">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.from === userType ? 'sent' : 'received'}`}
              >
                <div className="message-content">
                  <p>{message.content}</p>
                  <small>{message.from} - {new Date(message.timestamp).toLocaleTimeString()}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Five;
