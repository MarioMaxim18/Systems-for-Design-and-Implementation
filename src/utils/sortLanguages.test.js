const { getSortedLanguages } = require("./sortLanguages");

describe("getSortedLanguages", () => {
  const languages = [
    { id: 1, name: "Python", year: 1991 },
    { id: 2, name: "Java", year: 1995 },
    { id: 3, name: "C++", year: 1985 },
  ];

  test("sorts languages by name", () => {
    const sorted = getSortedLanguages(languages, "Name");
    expect(sorted.map(lang => lang.name)).toEqual(["C++", "Java", "Python"]);
  });

  test("sorts languages by year", () => {
    const sorted = getSortedLanguages(languages, "Year");
    expect(sorted.map(lang => lang.year)).toEqual([1985, 1995, 1991]);
  });
});