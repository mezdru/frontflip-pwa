import React, { Suspense } from "react";
import { withStyles, CircularProgress } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";
import undefsafe from "undefsafe";
import defaultPicture from "../../../resources/images/placeholder_person.png";
import defaultCover from "../../../resources/images/fly_away.jpg";
import "./uploadcare_customize.css";

const Uploader = React.lazy(() => import("../uploadcare/Uploader"));

const styles = theme => ({
  pictureContainer: {
    position: "relative",
    margin: "0px 16px",
    textAlign: "center",
    [theme.breakpoints.down("xs")]: {
      margin: 8
    }
  },
  logo: {
    position: "relative",
    borderRadius: "50%",
    width: 250,
    height: 250,
    [theme.breakpoints.down("xs")]: {
      width: 180,
      height: 180
    },
    border: "8px solid white",
    background: "white",
    zIndex: 2
  },
  cover: {
    position: "relative",
    borderRadius: 4,
    width: "100%",
    height: "auto",
    background: "white",
    zIndex: 2
  }
});

const types = {
  LOGO: "logo",
  COVER: "cover"
};

class PictureField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pictureUrl: null
    };
  }

  componentDidMount() {
    this._ismounted = true;
  }

  handleChange = file => {
    if (!this._ismounted) return;
    const { pictureType } = this.props;

    if (!file) {
      let record = this.props.recordStore.workingRecord;
      if (pictureType === types.LOGO) {
        record.picture = { url: null };
        this.props.handleSave(["picture"]);
      } else if (pictureType === types.COVER) {
        record.cover = { url: null };
        this.props.handleSave(["cover"]);
      }
      this.setState({ pictureUrl: null, loading: false });
    } else {
      this.setState({ loading: true });
    }
  };

  componentWillUnmount() {
    this._ismounted = false;
  }

  handleUploadComplete = file => {
    if (!this._ismounted) return;
    const { pictureType } = this.props;
    let record = this.props.recordStore.workingRecord;
    if (pictureType === types.LOGO) {
      record.picture = {
        url: file.cdnUrl
      };
      this.props.handleSave(["picture"]);
    } else if (pictureType === types.COVER) {
      record.cover = {
        url: file.cdnUrl
      };
      this.props.handleSave(["cover"]);
    }
    this.setState({ pictureUrl: file.cdnUrl, loading: false });
  };

  render() {
    const { pictureUrl, loading } = this.state;
    const { classes, pictureType } = this.props;
    const { currentOrganisation } = this.props.orgStore;
    let record = this.props.recordStore.workingRecord;
    return (
      <div>
        <div className={classes.pictureContainer} style={this.props.style}>
          {loading && !pictureUrl && (
            <CircularProgress
              color="secondary"
              className={classes[pictureType]}
              size={300}
            />
          )}
          {(!loading || pictureUrl) && (
            <img
              src={
                pictureUrl ||
                (pictureType === types.LOGO
                  ? defaultPicture
                  : undefsafe(record, "cover.url") ||
                    undefsafe(currentOrganisation, "cover.url") ||
                    defaultCover)
              }
              alt=""
              className={classes[pictureType]}
            />
          )}
        </div>

        <Suspense fallback={<CircularProgress color="secondary" />}>
          <Uploader
            style={{ maxWidth: "100%" }}
            id="file"
            name="file"
            data-tabs="file camera url"
            data-crop={
              pictureType === "logo" ? "180x180 upscale" : "1280x720 upscale"
            }
            onChange={this.handleChange}
            value={
              pictureUrl ||
              (pictureType === types.LOGO
                ? undefsafe(record, "picture.url")
                : undefsafe(record, "cover.url"))
            }
            onUploadComplete={this.handleUploadComplete}
            data-images-only
          />
        </Suspense>
      </div>
    );
  }
}

export default injectIntl(
  withStyles(styles)(inject("orgStore", "recordStore")(observer(PictureField)))
);
