import Character from '../Character';

export default class Zombie extends Character {
  constructor(name) {
    super(name, 'Vampire');
    this.attack = 25;
    this.deffence = 25;
  }
}
