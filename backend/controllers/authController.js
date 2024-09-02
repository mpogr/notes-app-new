import bcrypt from 'bcryptjs';
import pool from '../db.js';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user_id = user.user_id;
            req.session.save();
            res.json({ user_id: req.session.user_id });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const register = async (req, res) => {
    try {
        const { username, email, hashedPassword } = req.body;

        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser.rows.length > 0) {
            const message = existingUser.rows[0].username === username ? 'Username exists' : 'Email exists';
            return res.status(400).json({ message });
        }

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id',
            [username, email, hashedPassword]
        );

        res.json({ user_id: newUser.rows[0].user_id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            } else {
                return res.status(201).json({ message: "Logged out" });
            }
          });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};