import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import zxcvbn from 'zxcvbn';
import bcrypt from 'bcryptjs';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Grid from '@mui/material/Grid2';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const history = useHistory();

    const passwordScore = zxcvbn(password).score;

    const isEmailValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, hashedPassword })
        });

        if (response.ok) {
            history.push('/login'); // Redirect to login page or dashboard as appropriate
        } else {
            alert("Failed to create user.");
        }
    };

    const goToLogin = () => {
        history.push('/login');
    };

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            <h1>Register to Your Notes</h1>
            <Grid container alignItems="center" justifyContent="center">
                <Grid container alignItems="center" justifyContent="center" direction="column">
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-username"
                            type="text"
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" color={ passwordScore > 2 ? 'success' : 'error' }>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </FormControl>
                    <Button sx={{ m: 1, width: '15ch' }} variant="contained" color="success"
                        onClick={handleRegister} disabled={!username || !email || !password || password !== confirmPassword || passwordScore < 3 || !isEmailValid(email)}
                    >
                        Register
                    </Button>
                </Grid>
                <Grid container alignItems="center" justifyContent="center" direction="column">
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" color= { isEmailValid(email) ? 'success' : 'error'}>
                        <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-email"
                            type="text"
                            label="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" color={password === confirmPassword ? 'success' : 'error' }>
                        <InputLabel htmlFor="outlined-adornment-confpassword">Confirm</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-confpassword"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="ConfPassword"
                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} disabled={passwordScore < 3}
                        />
                    </FormControl>
                    <Button sx={{ m: 1, width: '15ch' }} variant="contained" color="primary" onClick={goToLogin}>Login</Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default Register;
