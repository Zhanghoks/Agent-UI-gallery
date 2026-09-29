// "my-card" → "My Card" / "MyCard"
export const titleCase = (id) =>
  id.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");

export const pascalCase = (id) => titleCase(id).replace(/ /g, "");
