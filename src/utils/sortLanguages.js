function getSortedLanguages(languages, sortBy) {
    return [...languages].sort((a, b) => {
      if (sortBy === "Name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "Year") {
        return a.year - b.year;
      }
      return 0;
    });
  }
  
  module.exports = { getSortedLanguages }; 