import * as React from "react";
export const ProfileContext = React.createContext(
  // default values used by a Consumer when it does not have a
  // matching Provider above it in the tree, useful for testing
  {
    profileContext: {
      algoliaRecord: {},
      wingzyRecord: {},
      isEditable: false,
      filteredWings: [],
      filterProfile: () => {},
      setAlgoliaRecord: () => {}
    }
  }
);
