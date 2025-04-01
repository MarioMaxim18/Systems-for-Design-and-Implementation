// This will simulate a simple in-memory database
let languages = [
    { id: 1, name: "C++", developer: "Bjarne Stroustrup", year: 1985, description: "Low-level features." },
    { id: 2, name: "Java", developer: "James Gosling", year: 1995, description: "Enterprise development." },
    { id: 3, name: "Python", developer: "Guido van Rossum", year: 1991, description: "High-level scripting." }
  ];
  
  // This function is used to get all languages
  const getAllLanguages = () => languages;
  
  // This function is used to add a new language
  const addLanguage = (newLang) => {
    newLang.id = languages.length ? Math.max(...languages.map(l => l.id)) + 1 : 1;  // Generate unique ID
    languages.push(newLang);
    return newLang;
  };
  
  // This function is used to update a language by ID
  const updateLanguage = (id, updatedLang) => {
    languages = languages.map(lang =>
      lang.id === id ? { ...updatedLang, id } : lang
    );
    return updatedLang;
  };
  
  // This function is used to delete a language by ID
  const deleteLanguage = (id) => {
    languages = languages.filter(lang => lang.id !== id);
    return { id };
  };
  
  module.exports = { getAllLanguages, addLanguage, updateLanguage, deleteLanguage };