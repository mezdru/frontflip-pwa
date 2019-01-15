export const styles = theme => ({
    hitListContainer: {
        position: 'relative',
        top: 60,
        [theme.breakpoints.up('md')]: {
            top: 150,
        },
        width: '100%',
    },
    hitList: {
        width: '100%',
        '& ul': {
            listStyleType: 'none',
            padding:0,
            marginTop: '32px',
            marginBottom: '32px',
        },
        '& ul li': {
            marginBottom: '32px'
        },
        '& ul li > div:first-child' : {
            position: 'relative',
            left: '0',
            right: '0',
            margin: 'auto'
        }
    },
    fullWidth: {
        width: '100%'
    },
    searchBar: {
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 1000,
        marginTop:21,
        background: 'transparent',
    },
    searchBarMarginTop: {
        position: 'static',
        marginTop:59, // 147 - 24 - 64
        [theme.breakpoints.up('md')]: {
            marginTop: 151, //239 - 24 - 64
        },
        width: '100%',
    }
});