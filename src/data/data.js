let languages = [
    { id: 1, name: "C++", developer: "Bjarne Stroustrup", year: 1985, description: "Low-level features." },
    { id: 2, name: "Java", developer: "James Gosling", year: 1995, description: "Enterprise development." },
    { id: 3, name: "Python", developer: "Guido van Rossum", year: 1991, description: "High-level scripting." }
  ];
  
  const getAllLanguages = () => languages;
  
  const addLanguage = (newLang) => {
    newLang.id = languages.length ? Math.max(...languages.map(l => l.id)) + 1 : 1;
    languages.push(newLang);
    return newLang;
  };
  
  const updateLanguage = (id, updatedLang) => {
    languages = languages.map(lang =>
      lang.id === id ? { ...updatedLang, id } : lang
    );
    return updatedLang;
  };
  
  const deleteLanguage = (id) => {
    languages = languages.filter(lang => lang.id !== id);
    return { id };
  };
  
  module.exports = { getAllLanguages, addLanguage, updateLanguage, deleteLanguage };