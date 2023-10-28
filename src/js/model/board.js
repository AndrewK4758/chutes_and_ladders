/*
Only needs to have a start space and number of spaces
Test in beforeAll - reset after each test

Setup is where you design the spaces and run the players through the spaces
*/

import { Avatar, Color } from "./avatar.js";
import { Space, SpaceType } from "./space.js";

export class Board {
  #TotalSpaces = 0;
  #StartSpace = null;
  #Board = [];
  #Chutes = [];
  #Ladders = [];

  constructor(totalSpaces, startSpace) {
    this.#TotalSpaces = totalSpaces;
    this.#StartSpace = startSpace;
  }

  get totalSpaces() {
    return this.#TotalSpaces;
  }

  get startSpace() {
    return this.boardSetup[this.boardSetup.length - 1];
  }

  randomSelector(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  spaceMaker(space, value) {
    let isSpecialSpace = false;
    let spaceType = SpaceType.NORMAL;

    let specialSpaceSelector = this.randomSelector(0, 20);

    if (specialSpaceSelector === 7 || specialSpaceSelector === 14) {
      let chuteOrLadderSelector = this.randomSelector(0, 2);
      if (chuteOrLadderSelector === 0 && value > 10 && !isSpecialSpace) {
        spaceType = SpaceType.CHUTE;
        value = "Chute";
        isSpecialSpace = true;
      }
      if (chuteOrLadderSelector === 1 && value < 89 && !isSpecialSpace) {
        spaceType = SpaceType.LADDER;
        value = "Ladder";
        isSpecialSpace = true;
      }
      isSpecialSpace = false;
    }

    if (value === 1) {
      spaceType = SpaceType.START;
      value = "Start";
    }

    space.previous = new Space(spaceType, `${value}`);
  }

  chuteSpaceConnector() {
    let chutes = [];
    let dummyNode = null;
    let cur = this.#Board;
    for (let i = 0; i < this.#Board.length; i++) {
      if (cur[i].type === SpaceType.CHUTE) chutes.push(cur[i]);
    }
    for (let i = 0; i < chutes.length; i++) {
      dummyNode = chutes[i];
      for (let j = 0; j < 10; j++) {
        dummyNode = dummyNode.previous;
      }
      chutes[i].special = dummyNode;
    }
  }

  ladderSpaceConnector() {
    let ladders = [];
    let dummyNode = null;
    let cur = this.#Board;

    for (let i = 0; i < this.#Board.length; i++) {
      if (cur[i].type === SpaceType.LADDER) ladders.push(cur[i]);
    }

    for (let i = 0; i < ladders.length; i++) {
      dummyNode = ladders[i];
      for (let j = 0; j < 10; j++) {
        dummyNode = dummyNode.next;
      }
      ladders[i].special = dummyNode;
    }
  }

  get boardSetup() {
    let totalSpaces = this.#TotalSpaces;
    let space = new Space(SpaceType.FINISH, "Finish");
    let board = [space];

    for (let i = totalSpaces - 1; i >= 1; i--) {
      this.spaceMaker(space, i);
      space.previous.next = space;
      space = space.previous;
      board.push(space);
    }

    this.chuteSpaceConnector();
    this.ladderSpaceConnector();
    this.#Board = board;
    return this.#Board;
  }

  get displaySpaces() {
    let board = this.boardSetup;
    let row = [];
    let display = [];
    board.forEach((space, idx) => {
      row.push(space);
    });
  }
}
