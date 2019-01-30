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
    '@keyframes fadeIn': {
        from: {opacity: 0},
        to: {opacity: 1}
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
            marginBottom: '32px',
            opacity: 0,
            animation: 'fadeIn 0.9s 1',
            animationFillMode: 'forwards',
        },
        '& ul li:nth-child(1)': {
            WebkitAnimationDelay: '0s',
            animationDelay: '0s',
        },
        '& ul li:nth-child(2)': {
            WebkitAnimationDelay: '.3s',
            animationDelay: '.3s',
        },
        '& ul li:nth-child(3)': {
            WebkitAnimationDelay: '.6s',
            animationDelay: '.6s',
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
        marginTop:8,
        background: 'transparent',
        width: '100%'
    },
    '@keyframes moveTop': {
        from: {marginTop: 139},
        [theme.breakpoints.up('md')]: {
            from: {marginTop: 231}
        },
        to: {marginTop: 8}
    },
    searchBarProfile: {
        position: 'fixed !important',
        top:0,
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 1000,
        marginTop:8,
        background: 'transparent',
        width: '100%',
        animationName: 'moveTop',
        animationDuration: '1s',
    },
    searchBarMarginTop: {
        position: 'static',
        marginTop: 83, // bannerHeight / 2
        [theme.breakpoints.up('md')]: {
            marginTop: 175, // bannerHeight / 2
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