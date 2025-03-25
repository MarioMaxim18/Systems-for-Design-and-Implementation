function addLanguage(lang, languages = []) {
  lang.id = languages.length ? Math.max(...languages.map(l => l.id)) + 1 : 1;
  const updated = [...languages, lang];
  return updated;
}

function updateLanguage(id, updatedLang, languages = []) {
  return languages.map(l => l.id === id ? { ...updatedLang, id } : l);
}

function deleteLanguage(id, languages = []) {
  return languages.filter(l => l.id !== id);
}

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

function getLanguage(id, languages) {
  return languages.find(lang => lang.id === id);
}

module.exports = {
  addLanguage,
  updateLanguage,
  deleteLanguage,
  getSortedLanguages,
  getLanguage
};