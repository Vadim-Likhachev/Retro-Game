/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

 import PositionedCharacter from "./PositionedCharacter";

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

export function generateTeam(allowedTypes, maxLevel, characterCount, survivor) {
  const teamCharacters = [];

  for (let i = 0; i < characterCount; i += 1) {
    const generator = characterGenerator(allowedTypes, maxLevel);
    teamCharacters.push(generator.next().value);
  }
  if (survivor.length > 0) {
    survivor.forEach((element) => teamCharacters.push(element));
  }
  return teamCharacters;
}

export function createPositions(teamPlayer, positionsArr) {
  const arr = positionsArr;
  return teamPlayer.reduce((acc, prev) => {
    const coordPlayer =
      arr[Math.floor(Math.random() * (positionsArr.length - 1))];
    acc.push(new PositionedCharacter(prev, coordPlayer));
    arr.splice(arr.indexOf(coordPlayer), 1);
    return acc;
  }, []);
}

export function positionsTeam(characterCount, player, boardSize = 8) {
  const positionsArr = [];
  const possiblePositions = [];
  for (let i = 0; i < boardSize ** 2; i += boardSize) {
    if (player === "human") {
      possiblePositions.push(i, i + 1);
    }
    if (player === "computer") {
      possiblePositions.push(i + boardSize - 2, i + boardSize - 1);
    }
  }
  let possibleCountPositions = boardSize * 2;
  for (let i = 0; i < characterCount; i += 1) {
    const position = Math.floor(Math.random() * possibleCountPositions);
    positionsArr.push(possiblePositions[position]);
    possiblePositions.splice(position, 1);
    possibleCountPositions -= 1;
  }

  return positionsArr;
}