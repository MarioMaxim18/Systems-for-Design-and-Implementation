const {
  getAllLanguages,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  _languages: languages
} = require('../data/data.js');

describe('Language Database Methods', () => {
  let originalLanguages;

  beforeEach(() => {
    originalLanguages = [
      { id: 1, name: "C++", developer: "Bjarne Stroustrup", year: 1985, description: "Low-level features." },
      { id: 2, name: "Java", developer: "James Gosling", year: 1995, description: "Enterprise development." },
      { id: 3, name: "Python", developer: "Guido van Rossum", year: 1991, description: "High-level scripting." }
    ];
    
    languages.length = 0;
    originalLanguages.forEach(lang => languages.push({...lang}));
  });

  describe('getAllLanguages()', () => {
    it('should return all languages', () => {
      const result = getAllLanguages();
      expect(result).toEqual(originalLanguages);
      expect(result).toHaveLength(3);
    });
  });

  describe('addLanguage()', () => {
    it('should add a new language', () => {
      const newLang = {
        name: "JavaScript",
        developer: "Brendan Eich",
        year: 1995,
        description: "Web language"
      };

      const result = addLanguage(newLang);
      
      expect(result.id).toBe(4);
      expect(languages).toHaveLength(4);
      expect(languages[3].name).toBe("JavaScript");
    });

    it('should handle empty database', () => {
      languages.length = 0;
      const newLang = {
        name: "TypeScript",
        developer: "Microsoft",
        year: 2012,
        description: "Typed JavaScript"
      };

      const result = addLanguage(newLang);
      expect(result.id).toBe(1);
      expect(languages).toHaveLength(1);
    });
  });

  describe('updateLanguage()', () => {
    it('should update an language', () => {
      const updatedLang = {
        name: "Java SE",
        developer: "James Gosling",
        year: 1996,
        description: "Updated Java version"
      };

      const result = updateLanguage(2, updatedLang);
      
      expect(result.name).toBe("Java SE");
      expect(result.year).toBe(1996);
      expect(languages[1].name).toBe("Java SE");
      expect(languages[1].year).toBe(1996);
      expect(languages).toHaveLength(3);
    });
  });

  describe('deleteLanguage()', () => {
    it('should delete an language', () => {
      const result = deleteLanguage(2);
      
      expect(result.id).toBe(2);
      expect(languages).toHaveLength(2);
      expect(languages.some(lang => lang.id === 2)).toBe(false);
    });
  });
});