export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    
    if (new.target.name === 'Character') {
      throw new Error('Error! new Character(level) cannot be created');
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
