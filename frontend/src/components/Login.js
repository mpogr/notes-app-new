import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Grid from '@mui/material/Grid2';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleLogin = async () => {
        setError(''); // Clear previous errors
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                history.push('/dashboard'); // Redirect to dashboard or another route as needed
            } else {
                setError('Authentication Error'); // Display authentication error
            }
        } catch (error) {
            setError('Authentication Error'); // Network or other errors
        }
    };

    const handleRegister = () => {
        history.push('/register'); // Route to the register page
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
            <h1>Login to Your Notes</h1>
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
                    <Button sx={{ m: 1, width: '15ch' }} variant="contained"
                        onClick={handleLogin}
                        disabled={!username || !password}
                    >
                        Login
                    </Button>
                </Grid>
                <Grid container alignItems="center" justifyContent="center" direction="column">
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
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
                    <Button sx={{ m: 1, width: '15ch' }} variant="outlined" color="primary" onClick={handleRegister}>Register</Button>
                </Grid>
            </Grid>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}

export default Login;
