import Bowman from "./TypesPers/Bowman";
import Magician from "./TypesPers/Magician";
import Swordsman from "./TypesPers/Swordsman";
import Undead from "./TypesPers/Undead";
import Vampire from "./TypesPers/Vampire";
import Daemon from "./TypesPers/Daemon";
import Character from "./Character";

export default class Team {
    constructor(pers) {
        this.typesForHuman = [Bowman, Swordsman, Magician];
        this.typesForComputer = [Daemon, Vampire, Undead];
      }
}
