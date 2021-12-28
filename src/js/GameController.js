import themes from "./themes";
import cursors from "./cursors";
import PositionedCharacter from "./PositionedCharacter";
import Team from "./Team";
import GamePlay from "./GamePlay";
import GameState from "./GameState";
import {
  generateTeam,
  characterGenerator,
  newlyCharLevelUp,
  createPositions,
  positionsTeam
} from "./generators";
import { isPosibleAttack, isPosibleStep, isRadius } from "./actions";
import {
  createActionArr,
  distanceAttack,
  moveAttack,
  sortedEnergyAttack,
  calcMovingCells,

} from "./Computer";

import GameStateServiced from "./GameStateService";

import ControlBox from "./ControlBox";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.saveGame = undefined;
    this.pers = null;
    this.selectedPlayer = null;
    this.selectedPers = undefined;
    this.scores = 0;
    this.record = 0;
    this.currentTurn = "player";
  }

  init() {
    this.fieldUpdate();

    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));

    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellLeave.bind(this));
 
  }

  fieldUpdate() {
    if (this.saveGame) {
      
      this.levelUpgrade();

    } else {
      this.currentLevel = 1;
      this.gamePlay.drawUi(themes.prairie);
      this.humanPlayer  = generateTeam(
        [new Team().typesForHuman[0], new Team().typesForHuman[1]],
        1,
        2,
        [],
        this.gamePlay.boardSize
      );
  
      this.computerPlayer = generateTeam(
        new Team().typesForComputer,
        1,
        2,
        [],
        this.gamePlay.boardSize
      );
    }
    
    
    this.generateTeamsPosition(this.humanPlayer, this.computerPlayer);

    this.players = [...this.humanPosition, ...this.computerPosition];

    this.gamePlay.redrawPositions(this.players);

    this.bindingBoxCount();
    this.controlBox.showCount(this.currentLevel, this.scores, this.record);
  }

  onNewGame() {
    this.char = null;
    this.selectedPlayer = null;
    this.selectedPers = undefined;
    this.players = [];
    this.scores = 0;

    if (this.saveGame) {
      this.saveGame = undefined;
    }

    this.fieldUpdate();
  }




  onCellEnter(index) {
    this.persHover = this.players.find((item) => item.position === index);

    if (this.persHover) {
      this.gamePlay.cells.forEach((cell, number) => {
        number !== index;
        this.gamePlay.deselectCell(number);
      });
      const { level, attack, deffence, health } = this.persHover.character;

      const message = `${"\u{1F396}"} ${level} ${"\u{2694}"} ${attack} ${"\u{1F6E1}"} ${deffence} ${"\u2764"} ${health}`;
      this.gamePlay.showCellTooltip(message, index);
      this.gamePlay.setCursor(cursors.pointer);
    }

    const computerCell = this.computerPosition.some(
      (comp) => comp.position === index
    );
    const humanCell = this.humanPosition.some(
      (human) => human.position === index
    );
    this.step = isPosibleStep(this.pers, this.selectedPlayer, index);
    this.moveAttack = isPosibleAttack(this.pers, this.selectedPlayer, index);


    if (!computerCell && !humanCell && this.selectedPers) {
      this.gamePlay.cells.forEach((cell, number) => {
        number !== index;
        this.gamePlay.deselectCell(number);
        this.gamePlay.selectCell(this.selectedPers.position);
      });

 
      if (this.step === true) {
        this.gamePlay.selectCell(index, "green");
        this.gamePlay.setCursor("auto");
      } else {
        this.gamePlay.setCursor("not-allowed");
      }
    }

    if (computerCell && this.selectedPers) {
      this.computerPosition.forEach((el) =>
        this.gamePlay.deselectCell(el.position)
      );
      this.gamePlay.selectCell(this.selectedPers.position);
      if (this.moveAttack === true) {
        this.gamePlay.selectCell(index, "red");
        this.gamePlay.setCursor("crosshair");
      } else {
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor("not-allowed");
      }
    }

    if (humanCell && this.selectedPers) {
      this.gamePlay.selectCell(this.selectedPers.position);
    }
  }


  async onCellClick(index) {

    const сomputerCell = this.persFind(this.computerPosition, index);
    const humanCell = this.persFind(this.humanPosition, index);

    this.step = isPosibleStep(this.pers, this.selectedPlayer, index);
    this.moveAttack = isPosibleAttack(this.pers, this.selectedPlayer, index);

  
    let persNow = this.persFind(this.players, index);

    if (persNow && humanCell) {
      this.players.forEach((el) => this.gamePlay.deselectCell(el.position));

      this.selectedPers = persNow;
      this.selectedPlayer = this.selectedPers.position; 
      this.pers = this.selectedPers.character.type; 
      this.gamePlay.selectCell(this.selectedPers.position);
    }

    if (this.selectedPers && !persNow && this.step === true) {
   
      this.players.forEach((el) => this.gamePlay.deselectCell(el.position));
      persNow = this.selectedPers;
      persNow.position = index;

      this.gamePlay.redrawPositions(this.players);

      this.reverseOfTurn();
      this.targetComp();
    }

    if (сomputerCell) {
      if (this.selectedPers && this.moveAttack === true) {

        await this.endOfTurn(this.selectedPers, сomputerCell);
        this.reverseOfTurn();
        this.targetComp();
      } else {
        GamePlay.showError("Нельзя выбрать игрока чужой команды!");
      }
    }
  }
  
  async targetComp() {
    this.players.forEach((el) => this.gamePlay.deselectCell(el.position));
    if (this.saveGame) {
      this.humanPosition = this.saveGame.human;
      this.computerPosition = this.saveGame.computer;
    }

    this.computerPosition = this.filtredHealth(this.computerPosition);
    this.humanPosition = this.filtredHealth(this.humanPosition);

    if (!Object.keys(this.computerPosition).length) {
      this.checkScores(this.humanPosition);
      console.log(this.players, "play");
      this.nextLevel(this.players);

      this.levelUpgrade();

      if (this.currentLevel < 5) this.bindingBoxCount();
      this.controlBox.showCount(this.currentLevel, this.scores, this.record);
    }

    const agregateArr = createActionArr(

      this.computerPosition,
      this.humanPosition
    );

    const compAttack = agregateArr[0]; 
    const compMove = agregateArr[1]; 

    if (!compAttack.length) {
 
      const moveAttackComp = distanceAttack(
        compMove,
        this.computerPosition
      );

      const isEmptyCellsforStepArr = calcMovingCells(moveAttackComp);

      this.targetComputer = this.computerPosition.find(
        (comp) => comp.position === isEmptyCellsforStepArr[0]
      );

      if (!isEmptyCellsforStepArr.length) {
        return;
      }
      this.targetComputer.position = isEmptyCellsforStepArr[1];

      this.gamePlay.redrawPositions(this.players);
      this.reverseOfTurn();
      return;
    }

    this.targetComputer = this.computerPosition.find(
      (comp) => comp.position === compAttack[0][0]
    );

    this.targetHuman = this.humanPosition.find(
      (human) => human.position === compAttack[0][1]
    );

    if (compAttack.length) {
      const sortArr = compAttack.sort(
        (a, b) => isRadius(a[0], a[1]) - isRadius(b[0], b[1])
      );

      this.targetComputer = this.computerPosition.find(
        (comp) => comp.position === sortArr[0][0]
      );
      this.targetHuman = this.humanPosition.find(
        (human) => human.position === sortArr[0][1]
      );
    }

    await this.endOfTurn(this.targetComputer, this.targetHuman);

    this.humanPosition = this.filtredHealth(this.humanPosition);
    if (!this.humanPosition.length) {
      await this.gameOver(this.humanPosition, this.computerPosition);
    } else {
      this.reverseOfTurn();
    }
  }

  async endOfTurn(a, b) {
    const damage = Math.max(
      a.character.attack - b.character.deffence,
      a.character.attack * 1
    );
    b.character.health -= damage;

    await this.gamePlay.showDamage(b.position, damage);
    this.players.forEach((el) => this.gamePlay.deselectCell(el.position));
    this.players = this.filtredHealth(this.players);

    this.gamePlay.redrawPositions(this.players);
  }

  onCellLeave(index) {
    if (!this.persHover) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  finderChar(arr, index) {
    return arr.find((char) => char.position === index);
  }

  filtredHealth(obj) {
    return obj.filter((el) => el.character.health > 0);
  }

  gameOver(arr1, arr2) {
    if (!arr1.length) {
      alert("You lose!");
    } else if (!arr2.length) {
      alert("You win!");
    }
  }

  




  generateTeamsPosition(a, b){
    this.humanPositions = positionsTeam(
      a.length,
      "human",
      this.gamePlay.boardSize
    );
    this.computerPositions = positionsTeam(
      a.length,
      "computer",
      this.gamePlay.boardSize
    );

    this.humanPosition = createPositions(a, this.humanPositions);
    this.computerPosition = createPositions(b, this.computerPositions);
    this.humanTurn = true;
  }

  persFind(arr, index) {
    return arr.find((pers) => pers.position === index);
  }

  reverseOfTurn() {
    this.selectedPers = null;

    this.players.forEach((el) => this.gamePlay.deselectCell(el.position)); 
    if (this.currentTurn === "player") this.currentTurn = "computer";
    else {
      this.currentTurn === "player";
    }
  }


  nextLevel(arr) {
    console.log(this.humanPosition, "this.humanPosition");
    this.survivor = []; 
    this.humanPosition.forEach((elem) =>
      this.survivor.push(elem.character)
    );


   this.survivor.forEach(elem => {
     elem.levelUp();
   })

    this.currentLevel += 1;

    if (this.currentLevel === 2) {
      let newPers = [];
      newPers.push(new Team().typesForHuman[this.random(0,2)]);
      this.humanNewTeam = [...this.survivor, ...newPers];
      this.compNewTeam = generateTeam(
        new Team().typesForComputer,
        this.random(1, 2),
        this.humanNewTeam.length,
        this.gamePlay.boardSize
      );
    }

    // if (this.currentLevel === 3) {
    //   this.humanNewTeam= generateTeam(
    //     new Team().typesForHuman,
    //     this.random(1, 2),
    //     2,
    //     this.survivor,
    //     this.gamePlay.boardSize
    //   );
    //   this.compNewTeam = generateTeam(
    //     new Team().typesForComputer,
    //     this.random(1, 3),
    //     this.humanNewTeam.length,
    //     this.gamePlay.boardSize
    //   );
    // }

    // if (this.currentLevel === 4) {
    //   this.humanNewTeam = generateTeam(
    //     new Team().typesForHuman,
    //     this.random(1, 3),
    //     2,
    //     this.survivor,
    //     this.gamePlay.boardSize
    //   );
    //   this.compNewTeam = generateTeam(
    //     new Team().typesForComputer,
    //     this.random(1, 4),
    //     this.humanNewTeam.length,
    //     this.gamePlay.boardSize
    //   );
    // }

    // if (this.currentLevel > 4) {
    //   this.currentLevel === 4;
    //   this.gameOver(this.humanPosition, this.computerPosition);
    //   return;
    // }

    this.generateTeamsPosition(this.humanNewTeam, this.compNewTeam);
    this.players = [...this.humanPosition, ...this.computerPosition]; 
    this.gamePlay.redrawPositions(this.players);
  }

  levelUpgrade() {
    switch (this.currentLevel) {
      case 1:
        this.gamePlay.drawUi(themes.prairie);
        break;
      case 2:
        this.gamePlay.drawUi(themes.desert);
        break;
      case 3:
        this.gamePlay.drawUi(themes.arctic);
        break;
      case 4:
        this.gamePlay.drawUi(themes.mountain);
        break;
      default:
        break;
    }
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  checkScores(survivor) {
    const healthArr = [];
    survivor.forEach((el) => {
      healthArr.push(el.character.health);
    });
    const scoresOfLevel = healthArr.reduce((sum, current) => {
      return sum + current;
    }, 0);

    this.scores =
      Number(this.controlBox.boxScoresEl.textContent) + scoresOfLevel;

    if (this.record < this.scores) this.record = this.scores;
    this.controlBox.showCount(this.currentLevel, this.scores, this.record);
  }

  bindingBoxCount() {
    this.controlBox = new ControlBox(
      document.querySelector(".board-container")
    );
    this.controlBox.redrawControlBox();
  }

  onSaveGameClick() {

    this.state = {
      human: this.humanPosition,
      computer: this.computerPosition,
      level: this.currentLevel,
      scores: this.scores,
      record: this.record,
      currentTurn: this.currentTurn,
    };

    console.log(this.state);
    this.stateService.save(this.state);
    GamePlay.showMessage("Saved!");
  }

  onLoadGameClick() {
    if (this.state) {
      this.saveGame = this.stateService.load(this.state);
      this.humanPosition = this.saveGame.human;
      this.computerPosition = this.saveGame.computer;
      this.currentLevel = this.saveGame.level;
      this.scores = this.saveGame.scores;
      this.record = this.saveGame.record;
      this.players = [...this.saveGame.human, ...this.saveGame.computer];
      this.gamePlay.redrawPositions(this.players);
      console.log(this.currentLevel, "this.currentLevel");
    } else {
      GamePlay.showMessage("No saved games!");
    }
  }
}




