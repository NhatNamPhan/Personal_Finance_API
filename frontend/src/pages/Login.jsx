import { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
    const [userId, setUserId] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userId.trim()) {
            login(userId);
            navigate('/');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a1929 0%, #173f5f 100%)',
                p: 2,
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 4, boxShadow: '0px 20px 40px rgba(0,0,0,0.2)' }}>
                    <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                                Welcome Back
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Enter your User ID to manage your finances
                            </Typography>
                        </Box>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <TextField
                                fullWidth
                                label="User ID"
                                variant="outlined"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                type="submit"
                                sx={{ py: 1.5, fontSize: '1rem' }}
                            >
                                Access Dashboard
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
}
