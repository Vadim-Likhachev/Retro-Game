import Character from '../Character';

export default class Zombie extends Character {
  constructor(...attrs) {
    super(...attrs);
    this.attack = 25;
    this.deffence = 25;
    this.type = "vampire";
  }
}
