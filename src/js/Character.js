export default class Character {
  constructor(level, type = "generic") {
    this.level = level;
    this.attack = 0;
    this.deffence = 0;
    this.health = 100;

    if (new.target.name === "Character") {
      throw new Error("You cannot create instances of the Character class");
    }
  }

  levelUp() {
    this.level += 1;

    this.attack = Math.round(
      Math.max(this.attack, (this.attack * (180 - this.health)) / 100)
    );

    this.deffence = Math.round(
      Math.max(this.deffence, (this.deffence * (180 - this.health)) / 100)
    );

    this.health += 80;

    if (this.health > 100) {
      this.health = 100;
    }
  }
}
