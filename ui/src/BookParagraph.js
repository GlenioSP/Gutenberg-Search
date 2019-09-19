import PropTypes from "prop-types";
import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import { Button, Divider, Typography } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Creators as BookParagraphActions } from "./store/ducks/bookParagraphs";

const styles = theme => ({
  allCaps: {
    textTransform: "uppercase"
  },
  bookModal: {
    width: "100%",
    height: "100%",
    padding: "40px 10%",
    margin: "0 auto",
    backgroundColor: "white",
    overflowY: "scroll",
    position: "fixed",
    top: 0,
    left: 0
  },
  error: {
    color: "#C0C0C0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  locationsLabel: {
    textAlign: "center",
    margin: theme.spacing()
  },
  modalFooter: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    background: "white"
  },
  paragraphsContainer: {
    maxWidth: 800,
    margin: "0 auto",
    marginBottom: 48
  },
  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end"
  }
});

class BookParagraph extends Component {
  constructor(props) {
    super(props);
    this.start = 0;
    this.offsetFromParagraph = 5;
    this.offset = 10;
    this.prevPageUrl = "";
    this.nextPageUrl = "";
  }

  componentDidMount() {
    const { selectedParagraph } = this.props;
    this.start =
      selectedParagraph._source.location - this.offsetFromParagraph >= 0
        ? selectedParagraph._source.location - this.offsetFromParagraph
        : 0;
    this.doSearch("");
  }

  doSearch = newEndpoint => {
    (async () => {
      const { SearchBookParagraphs, selectedParagraph } = this.props;
      const { fetchBookParagraphsEnd, fetchBookParagraphsError } = this.props;
      try {
        const bookParagraphs = await SearchBookParagraphs(
          selectedParagraph._source.title,
          this.start,
          this.offset,
          newEndpoint
        );
        fetchBookParagraphsEnd(bookParagraphs);
      } catch (e) {
        if (e.response !== undefined) {
          fetchBookParagraphsError(e.response.data);
        } else {
          fetchBookParagraphsError({
            message: "Search service is unavailable. Please try again."
          });
        }
      }
    })();
  };

  closeBookParagraphModal = () => {
    const { onCloseBookParagraphModal } = this.props;
    onCloseBookParagraphModal();
  };

  prevResultsPage = () => {
    this.doSearch(this.prevPageUrl);
    this.start = parseInt(
      this.prevPageUrl
        .match(/start=.*&/)[0]
        .split("=")[1]
        .replace("&", "")
    );
  };

  nextResultsPage = () => {
    this.doSearch(this.nextPageUrl);
    this.start = parseInt(
      this.nextPageUrl
        .match(/start=.*&/)[0]
        .split("=")[1]
        .replace("&", "")
    );
  };

  render() {
    const { classes, selectedParagraph } = this.props;
    const { bookParagraphs } = this.props;
    const { error } = bookParagraphs;
    const paragraphs =
      bookParagraphs.paragraphs === null ? [] : bookParagraphs.paragraphs.items;
    const links =
      bookParagraphs.paragraphs === null
        ? []
        : bookParagraphs.paragraphs._links;
    this.prevPageUrl = links.prev === null ? "" : links.prev;
    this.nextPageUrl = links.next === null ? "" : links.next;

    return (
      <div className={classes.bookModal}>
        <div className={classes.paragraphsContainer}>
          <div className={classes.titleRow}>
            <Typography variant="h4" className={classes.allCaps}>
              {selectedParagraph._source.title}
            </Typography>
            <Typography variant="h5">
              {selectedParagraph._source.author}
            </Typography>
          </div>
          <br />
          <Divider />
          <Typography variant="subtitle1" className={classes.locationsLabel}>
            Locations {this.start} - {this.start + this.offset}
          </Typography>
          <Divider />
          <br />

          {error !== null ? (
            <div className={classes.error}>
              <div>
                <Icon>error_outline</Icon>
              </div>
              <div>
                <Typography variant="subtitle1">{error.message}</Typography>
              </div>
            </div>
          ) : (
            paragraphs.map(paragraph => (
              <div>
                {paragraph._source.location ===
                selectedParagraph._source.location ? (
                  <Typography variant="body1">
                    <strong>{paragraph._source.text}</strong>
                  </Typography>
                ) : (
                  <Typography variant="body1">
                    {paragraph._source.text}
                  </Typography>
                )}
                <br />
              </div>
            ))
          )}
        </div>

        <div className={classes.modalFooter}>
          {this.prevPageUrl ? (
            <Button
              className={classes.buttonDefault}
              onClick={this.prevResultsPage}
            >
              Prev Page
            </Button>
          ) : (
            <Button
              disabled
              className={classes.buttonDefault}
              onClick={this.prevResultsPage}
            >
              Prev Page
            </Button>
          )}
          <Button
            className={classes.buttonDefault}
            onClick={this.closeBookParagraphModal}
          >
            Close
          </Button>
          {this.nextPageUrl ? (
            <Button
              className={classes.buttonDefault}
              onClick={this.nextResultsPage}
            >
              Next Page
            </Button>
          ) : (
            <Button
              disabled
              className={classes.buttonDefault}
              onClick={this.nextResultsPage}
            >
              Next Page
            </Button>
          )}
        </div>
      </div>
    );
  }
}

BookParagraph.propTypes = {
  bookParagraphs: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.string),
  selectedParagraph: PropTypes.objectOf(PropTypes.object),
  SearchBookParagraphs: PropTypes.func,
  fetchBookParagraphsEnd: PropTypes.func,
  fetchBookParagraphsError: PropTypes.func,
  onCloseBookParagraphModal: PropTypes.func
};

const mapStateToProps = ({ bookParagraphs }) => ({
  bookParagraphs
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(BookParagraphActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(BookParagraph));
