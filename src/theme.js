import {createMuiTheme} from '@material-ui/core/styles';

export const palette = {
    primary: {
        main: '#dd362e',
        dark: '#ca342e'
    },
    secondary: {
        light: '#fff',
        main: '#1667A2',
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
        MuiAppBar: {
            root: {
                height: 80
            }
        },
        MuiGrid: {
            "spacing-xs-16": {
                width: "auto",
                margin: "auto",
            },
        },
        MuiDrawer: {
            root: {
                height: 80,
            }
        },
        MuiChip: {
            root: {
                padding: '6px 12px',
                fontSize: 18,
                color: 'white',
                margin: 8,
                borderRadius: 50,
                height: 45,
                boxShadow: '0 2px 2px -1px darkgrey, 0 0 0 5px transparent',
                ['&:hover']: {
                    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
                },
            },
        },
        MuiAvatar: {
            root: {
                // width: '6rem',
                // height: '6rem',
                // boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
                zIndex: 999,
                backgroundColor: 'white',
            },
            img: {
                height: 'auto',
            }
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
                    color: palette.primary.main
                }
            }
        },
        MuiOutlinedInput: {
            root: {
                backgroundColor: 'white',
                borderRadius: 30,
                [`& fieldset`]: {
                    borderRadius: 30
                },
            },
            input: {
                borderRadius: 30,
            }
        },
        MuiTab: {
            root: {
                fontSize: '0.875rem!important',
                fontWeight: '400',
                ['&:hover']: {
                    color: palette.primary.main
                },
            },
        },
        MuiCard: {
            root: {
                padding: 0,
                maxWidth: 500,
                borderRadius: 30,
                margin: 15,
            }
        },
        MuiCardContent: {
            root: {
                paddingBottom: '0!important'
            }
        },
        MuiPaper: {
            root: {
                padding: '16px'
            }
        },
        MuiTypography: {
            h6: {
                display: 'block',
                padding: 8,
                fontFamily: '"Open sans"',
            },
            h4: {
                color: 'white',
                fontWeight: '700',
                fontFamily: '"Open sans"',
            },
            subheading: {
                // color: 'white',
                fontWeight: '500',
                fontFamily: '"Open sans"',
            }
        },
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
