import React, { Suspense } from "react";
import Button from "@material-ui/core/Button";
import {
  withStyles,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Typography
} from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { FormattedMessage } from "react-intl";
import ReactGA from "react-ga";

import Wings from "../../wing/Wings";
import ProfileService from "../../../../services/profile.service";
import PopupLayout from "../PopupLayout";
import { styles } from "./ProposeSkills.css";
import { withProfile } from "../../../../hoc/profile/withProfile";
import EmailService from "../../../../services/email.service";
import { Error } from "@material-ui/icons";

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const Search = React.lazy(() => import("../../../search/Search"));

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class ProposeSkills extends React.Component {
  state = {
    open: this.props.isOpen,
    steps: ["step1", "step2"],
    activeStep: 0,
    selectedSkills: [],
    error: null,
    loading: false
  };

  handleNext = async () => {
    let error = null;
    if (this.state.activeStep === 1) {
      this.setState({ loading: true }); // async method
      let sp = await this.props.skillsPropositionStore
        .postSkillsProposition({
          organisation: this.props.orgStore.currentOrganisation._id,
          hashtags: this.state.selectedSkills.map(elt => {
            return { _id: elt._id || elt.objectID };
          }),
          sender: this.props.recordStore.currentUserRecord._id,
          recipient: this.props.profileContext.getProp("_id")
        })
        .catch(e => {
          error = e;
          return null;
        });
      if (sp)
        await EmailService.sendSkillsProposition(sp._id).catch(e => {
          error = e;
          return null;
        });
    }
    this.setState({
      activeStep: this.state.activeStep + 1,
      error: error,
      loading: false
    });
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.isOpen)
      this.setState({ open: nextProps.isOpen });
  }

  handleClose = () => this.setState({ open: false });

  onSelect = selected => {
    this.setState({
      selectedSkills: this.state.selectedSkills.concat([selected])
    });
  };

  onCreate = async created => {
    let newSkill = {
      name: created.name,
      type: "hashtag",
      organisation: this.props.orgStore.currentOrganisation._id
    };
    let newSkillSaved = await this.props.recordStore.postRecord(newSkill);
    this.setState({
      selectedSkills: this.state.selectedSkills.concat([newSkillSaved])
    });
  };

  onDelete = selectedId => {
    this.setState({
      selectedSkills: this.state.selectedSkills.filter(
        elt => (elt._id || elt.objectID) !== selectedId
      )
    });
  };

  render() {
    const { classes, profileContext, theme } = this.props;
    const { steps, activeStep, selectedSkills, error, loading } = this.state;
    const { locale } = this.props.commonStore;

    return (
      <PopupLayout
        isOpen={this.state.open}
        PaperProps={{ style: { background: theme.palette.primary.main } }}
        title={
          activeStep < 2 && (
            <>
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                style={{ background: "none", display: "none" }}
              >
                {steps.map(label => (
                  <Step key={label}>
                    <StepLabel></StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Typography variant="h4" className={classes.stepTitle}>
                <FormattedMessage
                  id={"skillsProposition.propose." + steps[activeStep]}
                  values={{
                    recipientName: entities.decode(
                      profileContext.getProp("name")
                    )
                  }}
                />
              </Typography>
            </>
          )
        }
        actions={
          <div className={classes.actions}>
            {activeStep < 2 ? (
              <>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.buttons}
                >
                  <FormattedMessage id="skillsProposition.propose.back" />
                </Button>
                {loading ? (
                  <CircularProgress color="secondary" />
                ) : (
                  <Button
                    disabled={!(selectedSkills && selectedSkills.length > 0)}
                    variant="contained"
                    color="secondary"
                    onClick={this.handleNext}
                    className={classes.buttons}
                  >
                    {activeStep === steps.length - 1 ? (
                      <FormattedMessage id="skillsProposition.propose.send" />
                    ) : (
                      <FormattedMessage id="skillsProposition.propose.next" />
                    )}
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="contained"
                onClick={this.handleClose}
                className={classes.buttons}
              >
                <FormattedMessage id="skillsProposition.propose.close" />
              </Button>
            )}
          </div>
        }
        onClose={this.handleClose}
        style={this.props.style}
      >
        {activeStep < 2 ? (
          <>
            {activeStep === 0 && (
              <Suspense fallback={<CircularProgress color="secondary" />}>
                <Search
                  mode="propose"
                  onSelect={this.onSelect}
                  handleCreateWing={this.onCreate}
                  max={10}
                  exclude={selectedSkills}
                  getWorkingRecord={() => {}}
                />
              </Suspense>
            )}

            <div
              className={classes.selectedSkillsContainer}
              style={{ maxHeight: activeStep === 0 ? 112 : "100%" }}
            >
              {selectedSkills.map(selected => (
                <Wings
                  key={selected.tag}
                  label={ProfileService.getWingDisplayedName(selected, locale)}
                  mode="onboard"
                  recordId={profileContext.getProp("_id")}
                  hashtagId={selected._id || selected.objectID}
                  onDelete={
                    activeStep === 0
                      ? () => this.onDelete(selected._id || selected.objectID)
                      : null
                  }
                  enableClap={activeStep === 1}
                />
              ))}
            </div>
          </>
        ) : (
          <div>
            {!error ? (
              <>
                <img className={classes.emojiImg} src={ProfileService.getEmojiUrl('😀')} alt="bigPicture" />
                <br />
                <FormattedMessage
                  id="skillsProposition.propose.success"
                  values={{
                    recipientName: entities.decode(
                      profileContext.getProp("name")
                    )
                  }}
                />
              </>
            ) : (
              <>
                <Error fontSize="large" className={classes.failedIcon} />
                <br />
                <FormattedMessage id="skillsProposition.propose.error" />
              </>
            )}
          </div>
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
)(
  observer(
    withStyles(styles, { withTheme: true })(
      withProfile(ProposeSkills)
    )
  )
);
