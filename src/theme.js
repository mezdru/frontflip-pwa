import {createMuiTheme} from '@material-ui/core/styles';

export const palette = {
    primary: {
        main: '#dd362e',
        dark: '#ca342e'
    },
    secondary: {
        light: '#fff',
        main: '#a4c5cb',
        dark: '#8fbac0', /*for shadow*/
    }
};

export default createMuiTheme({
    palette: palette,
    typography: {
        fontFamily: [
            '"Open sans"',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    overrides: {
        MuiGrid: {
            "spacing-xs-16": {
                width: "auto",
                margin: "auto",
            },
        },
        MuiChip: {
            root: {
                padding: '6px 12px',
                fontSize: 18,
                color: 'white',
                margin: 2,
                borderRadius: 50,
                height: 40,
                overflow: 'visible',
                ['&:hover']: {
                    boxShadow: '0 2px 2px -1px darkgrey, 0 0 0 5px transparent',
                },
            },
        },
        MuiAvatar: {
            root: {
                width: '6rem',
                height: '6rem',
                boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
                zIndex: 999,
            },
        },
        MuiButton: {
            root: {
                borderRadius: 30,
                height: "56px",
            },
            text: {
                color: "darkgrey",
                ['&:hover']: {
                    backgroundColor: "transparent",
                    color: "red"
                }
            }
        },
        MuiOutlinedInput: {
            root: {
                backgroundColor: 'white',
                borderRadius: 30,
                [`& fieldset`]: {
                    borderRadius: 30
                }
            }
        },
        MuiTab: {
            root: {
                fontSize: '0.9rem!important',
                ['&:hover']: {
                    color: palette.primary.main
                }
            }
        },
        MuiPaper: {
            root: {
                padding: '16px'
            }
        }
    },
    props: {
        MuiButton: {
            variant: "contained"
        },
        MuiInput: {
            margin: "none"
        }
    },
    global: {
        body: {
            fontFamily: '"Open sans',
        },
    }
});
