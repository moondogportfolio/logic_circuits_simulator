import { currMouseAction, backToEdit } from "../menutools.js"
import { MouseAction, ElementType } from "./Enums.js";
import { Node, fillValue } from "./Node.js";
import { colorMouseOver, fileManager } from "../simulator.js"

export class LogicInput {
    constructor() {

        this.value = false;
        this.posX = mouseX;
        this.posY = mouseY;
        this.diameter = 25;
        this.isSpawned = false;
        this.isMoving = false;
        this.offsetMouseX = 0;
        this.offsetMouseY = 0;
        this.output = new Node(this.posX + 30, this.posY, true, this.value);
        this.nodeStartID = this.output.id;
        this.isSaved = false;
    }


    static from(json){
        return Object.assign(this, json);
    }

    destroy() {
        this.output.destroy();
        delete this.output;
    }

    draw() {
        if (!this.isSpawned) {
            this.posX = mouseX;
            this.posY = mouseY;
        }else if(!this.isSaved)
        {
            fileManager.saveState();
            this.isSaved = true;
        }

        fillValue(this.value);

        if (this.isMoving) {
            this.posX = mouseX + this.offsetMouseX;
            this.posY = mouseY + this.offsetMouseY;
        }

        if(this.isMouseOver())
            stroke(colorMouseOver[0], colorMouseOver[1], colorMouseOver[2]);
        else
            stroke(0);

        strokeWeight(4);
        line(this.posX, this.posY, this.posX + 30, this.posY);
        circle(this.posX, this.posY, this.diameter);


        this.output.updatePosition(this.posX + 30, this.posY);
        this.output.setValue(this.value);
        this.output.draw();

        this.printInfo();

        textSize(18);

        if (this.value) {
            textStyle(BOLD);
            text('1', this.posX - this.diameter / 4, this.posY + this.diameter / 4);
        }
        else {
            textStyle(NORMAL);
            fill(255);
            text('0', this.posX - this.diameter / 4, this.posY + this.diameter / 4);
        }
    }

    refreshNodes()
    {
        let currentID = this.nodeStartID;
        this.output.setID(currentID);
    }


    printInfo() {
        noStroke();
        fill(0);
        textSize(12);
        textStyle(NORMAL);
        text('LOG. INPUT', this.posX - 20, this.posY + 25);
    }

    isMouseOver() {
        if (dist(mouseX, mouseY, this.posX, this.posY) < this.diameter / 2)
            return true;
        return false;
    }


    mousePressed() {
        if (!this.isSpawned) {
            this.posX = mouseX;
            this.posY = mouseY;
            this.isSpawned = true;
            backToEdit();
            return;
        }

        if (this.isMouseOver() || currMouseAction == MouseAction.MOVE) {
            this.isMoving = true;
            this.offsetMouseX = this.posX - mouseX;
            this.offsetMouseY = this.posY - mouseY;
        }
    }


    mouseReleased() {
        if (this.isMoving) {
            this.isMoving = false;
        }

    }


    doubleClicked() {
        if (this.isMouseOver())
            this.value ^= true;
    }


    mouseClicked() {
        if (this.isMouseOver() || this.output.isMouseOver()) {
            this.output.mouseClicked();
            return true;
        }
        return false;
    }


    toggle() {
        this.value ^= true;
    }

}
