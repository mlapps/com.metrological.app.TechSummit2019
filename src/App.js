import ThunderJS from "../lib/thunderJS.js";
import Create from "./views/Create.js";
import Patterns from "./views/Patterns.js";
import Worker from "./components/Worker.js";
import Profile from "./components/Profile.js";

const config = [
    // R Y G
    [9,10,11]
];

export default class App extends ux.App {

    // Provide app specific fonts
    static getFonts() {
        return [

        ];
    }

    // Define the render tree:
    // docs: https://webplatformforembedded.github.io/Lightning/docs/renderEngine/template
    static _template() {
        return {
            rect: true, color: 0xff000000, w:1920, h:1080,
            Profile:{
                type: Profile, x:100, y:50
            },
            Patterns:{
                type: Patterns, x: 100, y: 300, clipping:true, w: 1920, h:780
            },
            Create:{
                type: Create, y:200, x:100, alpha:0
            },
            Worker:{
                type: Worker, x:1550, y:50,
                // pass atttibute data, will be accessible to the component
                // when initialized
                speed:0.8,
            }
        };
    }


    // lifecycle event:
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
    _construct() {
        this._thunderjs = new ThunderJS({
            host: '192.168.8.114'
        });
    }

    // lifecycle event:
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
    _init(){
        // this._thunderjs.call("IOConnector","pin@14",1);
        this._setState("Patterns");

        // this.$sequence({
        //     sequence:App.SEQUENCES[0]
        // });

        let i = 0, j = App.SEQUENCES.length;
        for(; i < j; i++){
            this.tag("Patterns").add(App.SEQUENCES[i]);
        }
    }

    // child parent communication
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/communication/fireancestors
    $sequence({sequence}){
        this.tag("Worker").start(sequence);
    }

    // statemachine definition
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/statemachine/statemachine
    static _states() {
        return [
            class Create extends this{
                $enter(){
                    this.tag("Create").setSmooth("alpha", 1);
                }
                $exit(){
                    this.tag("Create").setSmooth("alpha", 0);
                }
                // tell lightning which component is the active component
                // and should handle the key / remote control events
                // docs: https://webplatformforembedded.github.io/Lightning/docs/focus/focus
                _getFocused(){
                    return this.tag("Create");
                }
            },
            class Patterns extends this{
                $enter(){
                    this.tag("Patterns").setSmooth("alpha", 1);
                }
                $exit(){
                    this.tag("Patterns").setSmooth("alpha", 0);
                }
                _getFocused(){
                    return this.tag("Patterns");
                }
            }
        ];
    }

    get thunderjs(){
        return this._thunderjs;
    }
}

App.COLORS = {
    RED: 0xff9a0412,
    YELLOW: 0xffc8c10c,
    GREEN: 0xff459c27
};

App.PINS = {
     9: "RED",
    10: "YELLOW",
    11: "GREEN"
};

App.SEQUENCES = [
    [9,9,9,10,11,10,11,10,9,9,9],
    [9,9,9,10,11,10,11,10,9,9,9,10,11,10,11,10],
    [9,9,9,10,11,10,11,10,9,9,9],
    [11,11,10,10,9,10,9,10,10,9,9],
    [9,9,9,10,11,10,11,10,9,9,9,10,11,10,11,10],
    [9,9,9,10,11,10,11,10,9,9,9]
];