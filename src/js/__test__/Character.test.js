import Character from "../Character";
import Bowman from "../TypesPers/Bowman";
import Magician from "../TypesPers/Magician";
import Swordsman from "../TypesPers/Swordsman";
import Undead from "../TypesPers/Undead";
import Vampire from "../TypesPers/Vampire";
import Daemon from "../TypesPers/Daemon";

test ("Выбрасывает ошибку при new Character(level)", () => {
    expect(() => {
        const newPers = new Character(1, "Bowman");
        return newPers;
      }).toThrow();
});

test("new Daemon", () => {
  const recieved = new Daemon(2, "Daemon");
  expect(recieved).toEqual({
    type: "daemon",
    health: 100,
    level: 2,
    attack: 10,
    deffence: 40,
  });
});
test("new Magician", () => {
  const recieved = new Magician(1, "Magician");
  expect(recieved).toEqual({
    type: "magician",
    health: 100,
    level: 1,
    attack: 10,
    deffence: 40,
  });
});
test("new Swordsman", () => {
  const recieved = new Swordsman(1, "Swordsman");
  expect(recieved).toEqual({
    type: "swordsman",
    health: 100,
    level: 1,
    attack: 40,
    deffence: 10,
  });
});
test("new Undead", () => {
  const recieved = new Undead(2, "Undead");
  expect(recieved).toEqual({
    type: "undead",
    health: 100,
    level: 2,
    attack: 40,
    deffence: 10,
  });
});
test("new Vampire", () => {
  const recieved = new Vampire(2, "Vampire");
  expect(recieved).toEqual({
    type: "vampire",
    health: 100,
    level: 2,
    attack: 25,
    deffence: 25,
  });
});

test("levelUp()  повышает уровень и здоровье", () => {
  const recieved = new Bowman(2, "Bowman");
  recieved.health = 30;
  recieved.levelUp();
  expect(recieved).toEqual({
    type: "bowman",
    health: 100,
    level: 3,
    attack: 38,
    deffence: 38,
  });
});