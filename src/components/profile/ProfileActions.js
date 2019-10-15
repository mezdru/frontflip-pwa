import React from 'react';
import { withStyles, Grid, IconButton } from '@material-ui/core';
import { ArrowBack, Edit } from '@material-ui/icons';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';
import { getBaseUrl } from '../../services/utils.service.js';
import {Link} from 'react-router-dom';

const styles = theme => ({
  button: {
    height: 40,
    width: 40,
  },
  returnButton: {
    background: 'white',
    color: theme.palette.secondary.main,
    opacity: 0.7,
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      backgroundColor: 'white',
      color: theme.palette.secondary.main,
      opacity: 1,
    }
  }
});

class ProfileActions extends React.PureComponent {
  render() {
    const { classes } = this.props;
    const { isEditable } = this.props.profileContext;

    return (
      <>
        <Grid item xs={2}>
          <IconButton className={classNames(classes.button, classes.returnButton)} onClick={this.props.handleClose} >
            <ArrowBack />
          </IconButton>
        </Grid>

        <Grid container item justify="flex-end" alignContent="flex-end" xs={10}>

          {isEditable && (
            <Grid item >
              <IconButton
                className={classNames(classes.button, classes.returnButton)}
                component={Link}
                to={getBaseUrl(this.props) + '/onboard/intro/edit/' + this.props.profileContext.getProp('tag')}
              >
                <Edit />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </>
    )
  }
}

export default inject('commonStore', 'orgStore')(
  observer(
    withStyles(styles)(withProfileManagement(ProfileActions))
  )
);
