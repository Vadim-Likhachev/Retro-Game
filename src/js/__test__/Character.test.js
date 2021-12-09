import Character from "../Character";
import Bowman from "../TypesPers/Bowman";

test ("Выбрасывает ошибку при new Character(level)", () => {
    expect(() => {
        const newPers = new Character(1, "Bowman");
        return newPers;
      }).toThrow();
});