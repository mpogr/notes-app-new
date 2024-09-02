
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Tooltip, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@material-ui/core';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [notesPerPage, setNotesPerPage] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [editNote, setEditNote] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const history = useHistory();

    useEffect(() => {
        fetchNotes();
    }, [notesPerPage]);

    const fetchNotes = () => {
        fetch('/api/notes')
            .then(response => response.json())
            .then(data => {
                const sortedNotes = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setNotes(sortedNotes);
                setTotalPages(Math.ceil(sortedNotes.length / notesPerPage));
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleNotesPerPageChange = (event) => {
        setNotesPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleEditNote = (note) => {
        setEditNote(note);
        setIsEditing(true);
    };

    const handleDeleteNote = (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            fetch(`/api/notes/${noteId}`, { method: 'DELETE' })
                .then(() => fetchNotes());
        }
    };

    const handleConfirmEdit = () => {
        fetch(`/api/notes/${editNote.note_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: editNote.note })
        }).then(() => {
            setIsEditing(false);
            fetchNotes();
        });
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleAddNote = () => {
        setIsAdding(true);
    };

    const handleConfirmAdd = () => {
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: newNote })
        }).then(() => {
            setIsAdding(false);
            setNewNote('');
            fetchNotes();
        });
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewNote('');
    };

    const handleLogout = () => {
        setIsAdding(false);
        setNewNote('');
        fetch('/api/auth/logout', {
            method: 'GET'
        }).then(() => {
            history.push('/login'); // Redirect to dashboard or another route as needed
        });
    };

    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

    return (
        <div>
            <h1>Your Notes</h1>
            <Button variant="contained" color="primary" onClick={handleAddNote}>Add New Note</Button>
            <label>
                Show
                <select value={notesPerPage} onChange={handleNotesPerPageChange}>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                entries
            </label>
            <Grid container justifyContent="flex-end"><Button variant="contained" color="error" onClick={handleLogout} align="right">Logout</Button></Grid>
            <table>
                <thead>
                    <tr>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentNotes.map(note => (
                        <tr key={note.note_id}>
                            <td>
                                <Tooltip title={note.note} arrow>
                                    <span>{note.note.split('\n')[0]}</span>
                                </Tooltip>
                            </td>
                            <td>
                                <Button variant="contained" color="secondary" onClick={() => handleEditNote(note)}>Edit</Button>
                                <Button variant="contained" color="secondary" onClick={() => handleDeleteNote(note.note_id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
            </div>
            <p>
                Page {currentPage} of {totalPages}
            </p>

            {/* Edit Note Dialog */}
            <Dialog open={isEditing} onClose={handleCancelEdit}>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        value={editNote?.note || ''}
                        onChange={(e) => setEditNote({ ...editNote, note: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmEdit} color="primary">Confirm</Button>
                    <Button onClick={handleCancelEdit} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Add Note Dialog */}
            <Dialog open={isAdding} onClose={handleCancelAdd}>
                <DialogTitle>Add New Note</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmAdd} color="primary">Add</Button>
                    <Button onClick={handleCancelAdd} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Dashboard;
