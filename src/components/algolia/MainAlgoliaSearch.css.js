export const styles = theme => ({
    hitListContainer: {
        position: 'relative',
        top: 60,
        [theme.breakpoints.up('md')]: {
            top: 150,
        },
        width: '100%',
        marginBottom: 150
    },
    hitListContainerWithoutMargin: {
        position: 'relative',
        top: 108,
        [theme.breakpoints.up('md')]: {
            top: 198,
        },
        width: '100%',
        '& ul': {
            listStyleType: 'none',
            padding:0,
            marginTop:0,
        }    
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
    //<Grid item xs={10} sm={6} lg={4}>
    searchBar: {
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 1000,
        marginTop:16,
        background: 'transparent',
        width: '100%'
    },
    '@keyframes moveTop': {
        from: {marginTop: 139},
        [theme.breakpoints.up('md')]: {
            from: {marginTop: 231}
        },
        to: {marginTop: 16}
    },
    searchBarProfile: {
        position: 'fixed !important',
        top:0,
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 1000,
        marginTop:16,
        background: 'transparent',
        width: '100%',
        animationName: 'moveTop',
        animationDuration: '1s'
    },
    searchBarMarginTop: {
        position: 'static',
        marginTop:59, // 147 - 24 - 64
        [theme.breakpoints.up('md')]: {
            marginTop: 151, //239 - 24 - 64
        },
        width: '100%',
    },
    returnButton: {
        position: 'absolute',
        margin: 16,
        background: 'white',
        color: 'black'
    }
});