import express from 'express';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
//import cors from 'cors';
import nocache from 'nocache';

const app = express();
import cookieParser from 'cookie-parser';

//app.use(cors());
app.use(cookieParser());
app.use(nocache());
app.set('etag', false);
app.use(session({
    secret: 'QdbAMxQVu9M5B6Fk8xhe3H2VKiZ4xCE7lyBxRZZZPoOgUagYhg3wGou9rzDEjZju',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000000, secure: false, httpOnly: false },
    proxy: true
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/notes', noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
