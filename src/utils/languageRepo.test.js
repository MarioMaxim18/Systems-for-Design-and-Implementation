const { addLanguage, getLanguages, updateLanguage, deleteLanguage, getSortedLanguages, getLanguage } = require("./languageRepo");

const languages = [
  { id: 1, name: "C++", developer: "Bjarne Stroustrup", year: 1985, description: "A general-purpose programming language with low-level features." },
  { id: 2, name: "Java", developer: "James Gosling", year: 1995, description: "A class-based, object-oriented language used in enterprise applications." },
  { id: 3, name: "Python", developer: "Guido van Rossum", year: 1991, description: "An interpreted, high-level language great for scripting and automation." }
];

test("adds a new language", () => {
  const newLang = { name: "Rust", developer: "Graydon Hoare", year: 2010, description: "Safe language" };
  const result = addLanguage(newLang);
  expect(result).toHaveLength(1);
  expect(result[0].name).toBe("Rust");
});

test("updates a language by ID", () => {
  const updated = updateLanguage(1, { name: "Ruby", developer: "Matz", year: 1995, description: "Improved" }, languages);
  expect(updated[0].year).toBe(1995);
});

test("removes a language by ID", () => {
  const result = deleteLanguage(1, languages);
  expect(result).toHaveLength(2);
  expect(result.find(lang => lang.id === 1)).toBeUndefined();
});

test("sorts languages by name", () => {
  const sorted = getSortedLanguages(languages, "Name");
  expect(sorted.map(lang => lang.name)).toEqual(["C++", "Java", "Python"]);
});

test("sorts languages by year", () => {
  const sorted = getSortedLanguages(languages, "Year");
  expect(sorted.map(lang => lang.year)).toEqual([1985, 1991, 1995]);
});

test("returns the original array when sortBy is invalid", () => {
  const sorted = getSortedLanguages(languages, "Invalid");
  expect(sorted).toEqual(languages);
});

test("gets a language by ID", () => {
  const lang = getLanguage(2, languages);
  expect(lang.name).toBe("Java");
});