import { INPUT_STATE } from "./Enums.js";
import { wireMng } from "../simulator.js";

export let nodeList = [];

let currentID = 0;

export class Node {
    constructor(posX, posY, isOutput = false, value = false) {
        this.diameter = 10;
        this.value = value;
        this.posX = posX;
        this.posY = posY;
        this.isOutput = isOutput;
        this.hitRange = this.diameter + 10;

        this.inputState = INPUT_STATE.FREE;

        this.isAlive = true;
        this.brotherNode = null;

        this.id = currentID;
        currentID++;

        nodeList[this.id] = this;
    }

    destroy() {
        this.isAlive = false;
        delete nodeList[this.id];
    }

    draw() {
        fillValue(this.value);

        stroke(0);
        strokeWeight(4);
        circle(this.posX, this.posY, this.diameter);

        if (this.isMouseOver()) {
            fill(128, 128);
            noStroke();
            circle(this.posX, this.posY, this.hitRange)
        }

    }

    setID(newID)
    {
        delete nodeList[this.id];
        this.id = newID;
        nodeList[this.id] = this;

        if(this.id > currentID)
            currentID = this.id + 1;
    }

    setInputState(state) {
        this.inputState = state;
    }

    setBrother(brotherNode) {
        this.brotherNode = brotherNode;
    }

    getBrother() {
        return this.brotherNode;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }

    updatePosition(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }

    isMouseOver() {
        if (dist(mouseX, mouseY, this.posX, this.posY) < (this.hitRange) / 2)
            return true;
        return false;
    }

    mouseClicked() {
        if (this.isMouseOver() && (this.inputState == INPUT_STATE.FREE || this.isOutput)) {
            wireMng.addNode(this);
            return true;
        }
        return false;
    }


};

export function fillValue(value) {
    if (value)
        fill(255, 193, 7);
    else
        fill(52, 58, 64);
}
