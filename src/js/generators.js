/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function* characterGenerator(allowedTypes, maxLevel) {
  const type = Math.floor(Math.random() * allowedTypes.length);
  const level = Math.ceil(Math.random() * maxLevel);
  yield new allowedTypes[type](level);
}

export function newlyCharLevelUp(char) {
  for (let j = 1; j < char.level; j += 1) {
    char.levelUp();
    char.health = 50;
    char.level -= 1;
  }
  return char;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    const char = characterGenerator(allowedTypes, maxLevel).next().value;
    if (char.level !== 1) {
      newlyCharLevelUp(char);
    }
    team.push(char);
  }
  return team;
}