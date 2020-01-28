import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles, Typography } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { FormattedMessage } from "react-intl";
import ReactGA from "react-ga";
import undefsafe from "undefsafe";
import { Redirect } from "react-router-dom";
import { Error } from "@material-ui/icons";

import Wings from "../../wing/Wings";
import ProfileService from "../../../../services/profile.service";
import PopupLayout from "../PopupLayout";
import { styles } from "./ProposeSkills.css";
import {
  getUnique,
  getBaseUrl
} from "../../../../services/utils.service";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class AcceptSkills extends React.Component {
  state = {
    open: this.props.isOpen,
    error: null,
    ready: false,
    success: false
  };

  componentDidMount() {
    this.props.skillsPropositionStore
      .fetchSkillsProposition(this.props.skillsPropositionId)
      .then(sp => {
        this.setState({ ready: true });
      })
      .catch(e => {
        this.setState({ error: e });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.isOpen)
      this.setState({ open: nextProps.isOpen });
  }

  handleAccept = async () => {
    this.props.recordStore.currentUserRecord.hashtags = getUnique(
      this.props.recordStore.currentUserRecord.hashtags.concat(
        this.props.skillsPropositionStore.skillsProposition.hashtags
      ),
      "_id"
    );

    await this.props.recordStore.updateRecord(
      this.props.recordStore.currentUserRecord._id,
      ["hashtags"],
      { hashtags: this.props.recordStore.currentUserRecord.hashtags }
    );

    this.setState({ success: true });

    this.props.skillsPropositionStore.updateSkillsPropositionStatus(
      this.props.skillsPropositionStore.skillsProposition._id,
      "accepted"
    );
  };

  handleRefuse = () => {
    this.props.skillsPropositionStore.updateSkillsPropositionStatus(
      this.props.skillsPropositionStore.skillsProposition._id,
      "refused"
    );
    this.handleClose();
  };

  handleClose = () => {
    this.setState({
      open: false,
      redirectTo:
        getBaseUrl(this.props) +
        "/" +
        this.props.commonStore.url.params.recordTag
    });
  };

  onDelete = selectedId => {
    this.props.skillsPropositionStore.skillsProposition.hashtags = this.props.skillsPropositionStore.skillsProposition.hashtags.filter(
      elt => elt._id !== selectedId
    );
    this.forceUpdate();
  };

  render() {
    const { classes, theme } = this.props;
    const { ready, error, success, redirectTo } = this.state;
    const { locale } = this.props.commonStore;
    const { skillsProposition } = this.props.skillsPropositionStore;

    if (!ready && !error) return null;

    if (redirectTo) return <Redirect to={redirectTo} />;

    return (
      <PopupLayout
        isOpen={this.state.open}
        PaperProps={{ style: { background: theme.palette.primary.main } }}
        title={
          ready &&
          !error &&
          !success && (
            <Typography variant="h4" className={classes.stepTitle}>
              <FormattedMessage
                id="skillsProposition.manage.title"
                values={{
                  senderName: entities.decode(
                    undefsafe(skillsProposition, "sender.name")
                  )
                }}
              />
            </Typography>
          )
        }
        actions={
          <div className={classes.actions}>
            {ready && !error && !success ? (
              <>
                <Button onClick={this.handleRefuse} className={classes.buttons}>
                  <FormattedMessage id="skillsProposition.manage.refuse" />
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.handleAccept}
                  className={classes.buttons}
                >
                  <FormattedMessage id="skillsProposition.manage.accept" />
                </Button>
              </>
            ) : (
              <Button onClick={this.handleClose} className={classes.buttons}>
                <FormattedMessage id="skillsProposition.manage.close" />
              </Button>
            )}
          </div>
        }
        onClose={this.handleClose}
        style={this.props.style}
      >
        {ready && !error && !success ? (
          <div className={classes.selectedSkillsContainer}>
            {skillsProposition &&
              skillsProposition.hashtags &&
              skillsProposition.hashtags.map(selected => (
                <Wings
                  key={selected.tag}
                  label={ProfileService.getWingDisplayedName(selected, locale)}
                  mode="onboard"
                  onDelete={() => this.onDelete(selected._id)}
                />
              ))}
          </div>
        ) : (
          <>
            {!error && success ? (
              <>
                <img className={classes.emojiImg} src={ProfileService.getEmojiUrl('🤗')} alt="bigPicture" />
                <br />
                <FormattedMessage
                  id="skillsProposition.manage.success"
                  values={{
                    senderName: entities.decode(
                      undefsafe(skillsProposition, "sender.name")
                    )
                  }}
                />
              </>
            ) : (
              <>
                <Error fontSize="large" className={classes.failedIcon} />
                <br />
                <FormattedMessage id="skillsProposition.manage.error" />
                <br />
                {error.message}
              </>
            )}
          </>
        )}
      </PopupLayout>
    );
  }
}

export default inject(
  "commonStore",
  "orgStore",
  "recordStore",
  "skillsPropositionStore"
)(observer(withStyles(styles, { withTheme: true })(AcceptSkills)));
