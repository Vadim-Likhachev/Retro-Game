import { isPosibleAttack, isRadius } from "./actions";

export function createActionArr(compArr, humanArr) {
  const compAttack = [];
  const compMove = [];
  compArr.forEach((comp) => {
    humanArr.forEach((human) => {
      const moveAttack = isPosibleAttack(
        comp.character.type,
        human.position,
        comp.position
      );
      const distance = isRadius(comp.position, human.position);
      if (moveAttack) {
        compAttack.push([comp.position, human.position]);
      }
      if (!moveAttack) {
        compMove.push([comp.position, human.position, distance]);
      }
    });
  });
  return [compAttack, compMove];
}

export function distanceAttack (compMove, compArr) {

  const dimensionalDistance = compMove.sort((x, y) => x[2] - y[2]); 
  const minimDistance = dimensionalDistance.filter(
    (item) => dimensionalDistance[0][2] === item[2]
  );

  const compRadiusAtack = minimDistance.sort(
    (x, y) =>
    compArr.find((comp) => comp.position === x[0]).character.attack -
    compArr.find((comp) => comp.position === y[0]).character.attack
  );


  const targetPers = minimDistance.filter(
    (item) =>
      compArr.find(
        (comp) => comp.position === compRadiusAtack[0][0]
      ).character.attack ===
      compArr.find((comp) => comp.position === item[0]).character.attack
  );

  return targetPers;
}

export function moveAttack(compAttack, compArr) {

  const sortCompAtack = compAttack.sort(
    (x, y) =>
    compArr.find((comp) => comp.position === y[0]).character.attack -
    compArr.find((comp) => comp.position === x[0]).character.attack
  );


  const persWithMaxAttack = compAttack.filter(
    (item) =>
    compArr.find((comp) => comp.position === item[0]).character.attack -
    compArr.find((comp) => comp.position === sortCompAtack[0][0])
        .character.attack
  );



  let attackerComp = persWithMaxAttack; 
  if (persWithMaxAttack.length === 0)
  attackerComp =
  sortCompAtack[Math.floor(Math.random() * sortCompAtack.length)];

  return attackerComp;
}

export function sortedEnergyAttack(attackerComp, humanArr) {
  const sortedEnergyArr = attackerComp.sort(
    (a, b) => isRadius(a[0], a[1]) - isRadius(b[0], b[1])
  );
  const ret = isRadius(sortedEnergyArr[0][0], sortedEnergyArr[0][1]);
  console.log(sortedEnergyArr);
  console.log(ret);
}

export function calcMovingCells(targetPers) {

  const movingCells = [];
  targetPers.forEach((item) => {
    const Y = Math.floor(item[0] / 8) - Math.floor(item[1] / 8);

    const X = (item[0] % 8) - (item[1] % 8);
    let newPosition = item[0];

    if (!Y && X < 0) {
      movingCells.push(item[0], item[0] + 1);
    }
    if (Y > 0 && !X) {
      movingCells.push(item[0], item[0] - 8);
    }
    if (!Y && X > 0) {
      movingCells.push(item[0], item[0] - 1);
    }
    if (Y < 0 && !X) {
      movingCells.push(item[0], item[0] + 8);
    }

    if (X && Y) {
      if (X > 0) newPosition -= 1;
      if (X < 0) newPosition += 1;
      if (Y > 0) newPosition -= 8;
      if (Y < 0) newPosition += 8;
    }
    movingCells.push(item[0], newPosition);
  });
  return movingCells;
}