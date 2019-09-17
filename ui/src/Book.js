import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactHtmlParser from "react-html-parser";

import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Creators as BookActions } from "./store/ducks/books";

import BookParagraph from "./BookParagraph";

const styles = theme => ({
  buttonDefault: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5)
  },
  gridCard: {
    margin: theme.spacing(2),
    cursor: "pointer"
  },
  paginationPanel: {
    display: "flex",
    justifyContent: "center"
  },
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(2)
  },
  paperError: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    color: "#C0C0C0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  textField: {
    marginTop: 0,
    width: "100%"
  },
  textParagraph: {
    marginBottom: theme.spacing(1),
    fontWeight: "normal",
    "& em": {
      fontWeight: "bold"
    }
  },
  textTitle: {
    marginTop: theme.spacing(1)
  }
});

class Book extends Component {
  constructor(props) {
    super(props);
    this.searchDebounceTimeout = null;
    this.page = 1;
    this.perPage = 10;
    this.prevPageUrl = "";
    this.nextPageUrl = "";
  }

  doSearch = async (query, newEndpoint) => {
    const { SearchBooks } = this.props;
    const { fetchBooksEnd, fetchBooksError } = this.props;
    try {
      const books = await SearchBooks(
        query,
        this.page,
        this.perPage,
        newEndpoint
      );
      fetchBooksEnd(books);
    } catch (e) {
      fetchBooksError(e.response.data);
    }
  };

  onSearchInputKeyUp = e => {
    const iptValue = e.target.value;
    clearTimeout(this.searchDebounceTimeout);
    this.searchDebounceTimeout = setTimeout(async () => {
      this.doSearch(iptValue, "");
    }, 100);
  };

  prevResultsPage = () => {
    this.doSearch("", this.prevPageUrl);
    this.page = this.prevPageUrl
      .match(/page=.*&/)[0]
      .split("=")[1]
      .replace("&", "");
    document.documentElement.scrollTop = 0;
  };

  nextResultsPage = () => {
    this.doSearch("", this.nextPageUrl);
    this.page = this.nextPageUrl
      .match(/page=.*&/)[0]
      .split("=")[1]
      .replace("&", "");
    document.documentElement.scrollTop = 0;
  };

  showBookParagraphModal = bookParagraph => {
    document.body.style.overflow = "hidden";
    const { selectParagraph } = this.props;
    selectParagraph(bookParagraph);
  };

  onCloseBookParagraphModal = () => {
    document.body.style.overflow = "auto";
    const { unselectParagraph } = this.props;
    unselectParagraph();
  };

  render() {
    const { classes } = this.props;
    const { books } = this.props;
    const items = books.books === null ? [] : books.books.items;
    const { error } = books;
    const numItems = books.books === null ? 0 : books.books._meta.total_items;
    const links = books.books === null ? [] : books.books._links;
    this.prevPageUrl = links.prev === null ? "" : links.prev;
    this.nextPageUrl = links.next === null ? "" : links.next;
    const { selectedParagraph } = books;

    return (
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div>
                <TextField
                  id="iptSearch"
                  label="Search"
                  onKeyUp={this.onSearchInputKeyUp}
                  className={classes.textField}
                />
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div>
                <Typography variant="h5">
                  Total Found: {numItems} Items
                </Typography>
              </div>
              <div>
                {numItems > 0 ? (
                  <Typography variant="subtitle1">
                    Displaying Results {1 + (this.page - 1) * this.perPage} -{" "}
                    {this.page * this.perPage}
                  </Typography>
                ) : (
                  <Typography variant="subtitle1">
                    Displaying 0 Results
                  </Typography>
                )}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            {error !== null ? (
              <Paper className={classes.paperError}>
                <div>
                  <Icon>error_outline</Icon>
                </div>
                <div>
                  <Typography variant="subtitle1">{error.message}</Typography>
                </div>
              </Paper>
            ) : (
              <Grid container>
                {items.map(item => (
                  <Grid item xs={6} key={item._source._id}>
                    <Card
                      className={classes.gridCard}
                      onClick={() => this.showBookParagraphModal(item)}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          className={classes.textParagraph}
                        >
                          {ReactHtmlParser(item.highlight.text[0])}
                        </Typography>
                        <Divider variant="middle" />
                        <Typography
                          variant="subtitle1"
                          className={classes.textTitle}
                        >
                          {item._source.title} - {item._source.author}
                        </Typography>
                        <Typography variant="body2">
                          Location {item._source.location}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          <Grid item xs={12}>
            <Paper
              className={[classes.paper, classes.paginationPanel].join(" ")}
            >
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
            </Paper>
          </Grid>
        </Grid>

        {selectedParagraph && (
          <BookParagraph
            selectedParagraph={selectedParagraph}
            onCloseBookParagraphModal={this.onCloseBookParagraphModal}
          />
        )}
      </div>
    );
  }
}

Book.propTypes = {
  books: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.objectOf(PropTypes.string),
  SearchBooks: PropTypes.func,
  fetchBooksEnd: PropTypes.func,
  fetchBooksError: PropTypes.func,
  selectParagraph: PropTypes.func,
  unselectParagraph: PropTypes.func
};

const mapStateToProps = ({ books }) => ({
  books
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(BookActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Book));
