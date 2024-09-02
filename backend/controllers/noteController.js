import pkg from 'pg';
import pool from '../db.js';

export const getNotes = async (req, res) => {
    try {
        if(req.session.user_id)
        {
            const notesResult = await pool.query('SELECT * FROM notes WHERE user_id = $1::integer ORDER BY created_at DESC', [req.session.user_id]);
            res.json(notesResult.rows);
        }
        else {
            res.status(501).json({ message: "User ID is not a part of the session" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createNote = async (req, res) => {
    try {
        if(req.session.user_id)
        {
            const { note } = req.body;
            const newNote = await pool.query(
                'INSERT INTO notes (user_id, note, created_at) VALUES ($1::integer, $2::text, to_timestamp($3)) RETURNING note_id, note, created_at',
                [req.session.user_id, note, Date.now() / 1000.0]
            );
            res.json(newNote.rows[0]);
        }
        else {
            res.status(501).json({ message: "User ID is not a part of the session" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { note_id } = req.params;
        const { note } = req.body;
        const updatedNote = await pool.query(
            'UPDATE notes SET note = $1 WHERE note_id = $2 RETURNING note_id, note, created_at',
            [note, note_id]
        );
        res.json(updatedNote.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { note_id } = req.params;
        await pool.query('DELETE FROM notes WHERE note_id = $1', [note_id]);
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
