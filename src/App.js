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
            {family: 'Black', url: App.getPath('fonts/Roboto-Black.ttf'), descriptors: {}},
            {family: 'Regular', url: App.getPath('fonts/Roboto-Regular.ttf'), descriptors: {}}
        ]
    }

    // Define the render tree:
    // docs: https://webplatformforembedded.github.io/Lightning/docs/renderEngine/template
    static _template() {
        return {
            rect: true, colorTop: 0xff282828, colorBottom: 0xff181818, w:1920, h:1080,
            Profile:{
                type: Profile, x:100, y:50
            },
            Patterns:{
                type: Patterns
            },
            Create:{
                type: Create, y:300, x:100
            },
            Worker:{
                type: Worker, x:1550, y:50, alpha:2,
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
            host: '127.0.0.1'
        });
    }

    // lifecycle event:
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
    _init(){
        this._thunderjs.call("IOConnector","pin@14",1);
        this._setState("Create");

        this.$sequence({
            sequence:App.SEQUENCES[0]
        });
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
            }
        ];
    }

    get thunderjs(){
        return this._thunderjs;
    }
}

App.COLORS = {
    RED: 0xfff26458,
    YELLOW: 0xfff8be58,
    GREEN: 0xff5ac45a
};

App.PINS = {
    9: "RED",
    10: "YELLOW",
    11: "GREEN"
};


App.SEQUENCES = [
    [9,9,9,10,11,10,11,10,9,9,9],
    [9,9,9,10,11,10,11,10,9,9,9]
];