import React from "react";
import { styles } from "./ListResults.css";

class ListResults extends React.Component {
  state = {
    hits: [],
    page: 0,
    noResult: false,
    loading: true,
    noMore: false
  };

  componentDidMount() {
    let { filters } = this.props.searchStore.values;
    this.fetchHits(filters);
  }

  fetchHits = () => {};

  render() {
    return null;
  }
}

export default ListResults;
