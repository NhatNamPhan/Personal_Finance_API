import { createTheme, alpha } from '@mui/material/styles';

const deepBlue = '#0a1929';
const emerald = '#10b981';
const softWhite = '#f3f6f9';

const theme = createTheme({
    palette: {
        mode: 'light', // Can be toggled, starting with light for broad appeal or dark for "premium"
        primary: {
            main: deepBlue,
            light: '#1e293b',
            dark: '#020b12',
            contrastText: '#ffffff',
        },
        secondary: {
            main: emerald,
            light: '#34d399',
            dark: '#059669',
            contrastText: '#ffffff',
        },
        background: {
            default: softWhite,
            paper: '#ffffff',
        },
        text: {
            primary: '#1e293b',
            secondary: '#64748b',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        h1: { fontWeight: 700, fontSize: '2.5rem' },
        h2: { fontWeight: 700, fontSize: '2rem' },
        h3: { fontWeight: 600, fontSize: '1.75rem' },
        h4: { fontWeight: 600, fontSize: '1.5rem' },
        h5: { fontWeight: 600, fontSize: '1.25rem' },
        h6: { fontWeight: 600, fontSize: '1rem' },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${deepBlue} 0%, #173f5f 100%)`,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `,
        },
    },
});

export default theme;
