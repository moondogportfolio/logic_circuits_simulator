import { logicInput, logicOutput, gate, wireMng } from "./simulator.js"
import { LogicInput } from "./circuit_components/LogicInput.js"
import { LogicOutput } from "./circuit_components/LogicOutput.js";
import { Gate } from "./circuit_components/Gate.js";
import { nodeList } from "./circuit_components/Node.js";

let eventHistory = [];

export class FileManager {

    constructor()
    {
        this.isLoadingState = false;
    }

    saveState() {
    }


    saveFile(e) {

        let jsonWorkspace = FileManager.getJSON_Workspace();
        let blob = new Blob([jsonWorkspace], { type: 'application/json' });
        saveProjectFile.href = URL.createObjectURL(blob);
        //console.log(jsonWorkspace);
    }

    static getJSON_Workspace() {
        let workspace = new Object();

        workspace["logicInput"] = logicInput;
        workspace["logicOutput"] = logicOutput;
        workspace["flipflop"] = flipflop;
        workspace["logicClock"] = logicClock;
        workspace["gate"] = gate;
        workspace["srLatch"] = srLatch;
        workspace["wire"] = wireMng.wire;

        let jsonWorkspace = JSON.stringify(workspace,
            function (key, value) {
                switch (key) {
                    case "output":
                    case "input":
                    case "nodeSet":
                    case "nodeReset":
                    case "nodeClock":
                    case "nodeD":
                    case "nodeT":
                    case "nodeJ":
                    case "nodeK":
                    case "nodeQ":
                    case "nodeNotQ":
                    case "andGate_NotQ":
                    case "andGate_Q":
                    case "ff_D":
                    case "orGate":
                    case "gateSet":
                    case "gateReset":
                    case "asyncLatch":
                    case "master":
                    case "slave":
                    case "srLatchSync":
                    case "startNode":
                    case "endNode":
                        return undefined;
                }

                return value;
            }, '\t');
        return jsonWorkspace;
    }
}
