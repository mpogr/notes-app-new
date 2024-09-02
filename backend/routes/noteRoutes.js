import express from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/noteController.js';

const router = express.Router();

router.get('/', getNotes);
router.post('/', createNote);
router.put('/:note_id', updateNote);
router.delete('/:note_id', deleteNote);

export default router;
