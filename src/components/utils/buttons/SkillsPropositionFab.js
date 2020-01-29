import React from "react";
import { Fab, withStyles, Tooltip, withWidth } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import classNames from "classnames";
import { injectIntl, FormattedMessage } from "react-intl";

class SkillsPropositionFab extends React.Component {
  getVariant = () => {
    switch (this.props.width) {
      case "xs": return "round";
      case "sm":
        return "round";
      default:
        return "extended";
    }
  };

  render() {

    return (
      <Tooltip
        title={this.props.intl.formatMessage({
          id: "skillsProposition.fab.tooltip"
        })}
        placement="left"
      >
        <Fab
          color="secondary"
          aria-label="Propose Skills"
          className={classNames(this.props.className)}
          onClick={this.props.onClick}
          variant={this.getVariant()}
        >
          <Add fontSize="large" />
          {this.getVariant() === "extended" && (
            <FormattedMessage id="skillsProposition.fab.tooltip" />
          )}
        </Fab>
      </Tooltip>
    );
  }
}

export default withWidth()(
  withStyles(null, { withTheme: true })(injectIntl(SkillsPropositionFab))
);
