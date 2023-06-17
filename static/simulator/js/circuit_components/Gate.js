import { currMouseAction, backToEdit } from "../menutools.js"
import { gateIMG } from "../simulator.js";
import { gateType, MouseAction } from "./Enums.js"
import { Node } from "./Node.js";
import { colorMouseOver, fileManager } from "../simulator.js";
import { FileManager } from "../FileManager.js";

/**
 * Class that
 * @class Gate
 */
export class Gate {
    constructor(strType) {
        this.strType = strType;
        this.type = this.convertToType(strType);
        this.width = gateIMG[this.type].width;
        this.height = gateIMG[this.type].height;
        this.posX = mouseX - (this.width / 2);
        this.posY = mouseY - (this.height / 2);
        this.isSpawned = false;
        this.offsetMouseX = 0;
        this.offsetMouseY = 0;
        this.isMoving = false;
        this.isSaved = false;

        this.input = [];
        this.input.push(new Node(this.posX, this.posY + 15));
        if (this.type != gateType.NOT) {
            this.input.push(new Node(this.posX, this.posY + this.height - 15));
            this.input[0].setBrother(this.input[1]);
            this.input[1].setBrother(this.input[0]);
        }
        this.output = new Node(this.posX + this.width, this.posY + this.height / 2, true);
        this.nodeStartID = this.input[0].id;

    }

    destroy() {
        for (let i = 0; i < this.input.length; i++) {
            this.input[i].destroy();
            delete this.input[i];
        }
        this.output.destroy();
        delete this.output;
    }

    draw() {
        if (!this.isSpawned) {
            this.posX = mouseX - (this.width / 2);
            this.posY = mouseY - (this.height / 2);
        }else if(!this.isSaved)
        {
            fileManager.saveState();
            this.isSaved = true;
        }

        if (this.isMoving) {
            this.posX = mouseX + this.offsetMouseX;
            this.posY = mouseY + this.offsetMouseY;
        }

        if (this.type == gateType.NOT) {
            this.input[0].updatePosition(this.posX, this.posY + this.height / 2);
        } else {
            this.input[0].updatePosition(this.posX, this.posY + 15);
            this.input[1].updatePosition(this.posX, this.posY + this.height - 15);
        }

        this.output.updatePosition(this.posX + this.width, this.posY + this.height / 2);

        if (this.isMouseOver()) {
            noFill();
            strokeWeight(2);
            stroke(colorMouseOver[0], colorMouseOver[1], colorMouseOver[2]);
            rect(this.posX, this.posY, this.width, this.height);
        }

        image(gateIMG[this.type], this.posX, this.posY);

        for (let i = 0; i < this.input.length; i++)
            this.input[i].draw();

        this.generateOutput();
        this.output.draw();
    }

    refreshNodes()
    {
        let currentID = this.nodeStartID;
        this.input[0].setID(currentID);
        currentID++;
        if (this.type != gateType.NOT)
        {
            this.input[1].setID(currentID);
            currentID++;
        }
        this.output.setID(currentID);
    }

    generateOutput() {
        this.output.setValue(this.calculateValue());
    }

    calculateValue() {
        switch (this.type) {
            case gateType.NOT:
                return !this.input[0].getValue();

            case gateType.AND:
                return this.input[0].getValue() && this.input[1].getValue();

            case gateType.NAND:
                return !(this.input[0].getValue() && this.input[1].getValue());

            case gateType.OR:
                return this.input[0].getValue() || this.input[1].getValue();

            case gateType.NOR:
                return !(this.input[0].getValue() || this.input[1].getValue());

            case gateType.XOR:
                return this.input[0].getValue() ^ this.input[1].getValue();

            case gateType.XNOR:
                return !(this.input[0].getValue() ^ this.input[1].getValue());
        }
    }

    convertToType(str) {
        switch (str) {
            case "NOT":
                return gateType.NOT;

            case "AND":
                return gateType.AND;

            case "NAND":
                return gateType.NAND;

            case "OR":
                return gateType.OR;

            case "NOR":
                return gateType.NOR;

            case "XOR":
                return gateType.XOR;

            case "XNOR":
                return gateType.XNOR;
            //default here

        }
    }

    isMouseOver() {
        if (mouseX > this.posX && mouseX < (this.posX + this.width)
            && mouseY > this.posY && mouseY < (this.posY + this.height))
            return true;
        return false;
    }

    mousePressed() {
        if (!this.isSpawned) {
            this.posX = mouseX - (this.width / 2);
            this.posY = mouseY - (this.height / 2);
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
        this.isMoving = false;
    }

    mouseClicked() {
        let result = this.isMouseOver();

        for (let i = 0; i < this.input.length; i++)
            result |= this.input[i].mouseClicked();

        result |= this.output.mouseClicked();
        return result;
    }

};
