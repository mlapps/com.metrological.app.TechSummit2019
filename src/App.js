import ThunderJS from "../lib/thunderJS.js";
import Create from "./views/Create.js";
import Patterns from "./views/Patterns.js";
import Worker from "./components/Worker.js";
import Profile from "./components/Profile.js";

export default class App extends ux.App {

    // Provide app specific fonts
    static getFonts() {
        return [
            {family: 'Black', url: App.getPath('fonts/Roboto-Black.ttf'), descriptors: {}},
            {family: 'Regular', url: App.getPath('fonts/Roboto-Regular.ttf'), descriptors: {}}
        ]
    }

    /**
     * Define the render tree:
     * docs: https://webplatformforembedded.github.io/Lightning/docs/renderEngine/template
     */
    static _template() {
        return {
            rect: true, colorTop: 0xff282828, colorBottom: 0xff181818, w:1920, h:1080,
            Profile:{
                type: Profile, x:100, y:50
            },
            Patterns:{
                type: Patterns, x: 100, y: 300, clipping:true, w: 1920, h:780
            },
            Create:{
                type: Create, y:200, x:100, alpha:0,
                /**
                 * defines which signals will be send
                 * docs: https://webplatformforembedded.github.io/Lightning/docs/components/communication/signal
                 */
                signals:{addNewSequence:true}
            },
            Worker:{
                type: Worker, x:1450, y:50,
                // pass atttibute data, will be accessible to the component
                // when initialized
                speed:0.8,
            }
        };
    }


    /**
     * lifecycle event:
     * docs: https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
     * @private
     */
    _construct() {
        this._thunderjs = new ThunderJS({
            host: '127.0.0.1'
        });
    }

    /**
     * lifecycle event:
     * docs: https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
     * @private
     */
    _init(){
        this._setState("Patterns");

        // create the stored set of sequences, this can be served
        // from a server
        let i = 0, j = App.DEFAULT_SEQUENCES.length;
        for(; i < j; i++){
            this.tag("Patterns").add(App.DEFAULT_SEQUENCES[i]);
        }
    }

    /**
     * child parent communication
     * docs: https://webplatformforembedded.github.io/Lightning/docs/components/communication/fireancestors
     * @param sequence
     */
    $sequence({sequence}){
        this.tag("Worker").start(sequence);
    }

    addNewSequence({sequence}){
        this.tag("Patterns").add(sequence);

        // after we store a new sequence we force the app
        // to go back to the Pattern view
        this._setState("Patterns");
    }

    /**
     * statemachine definition
     * docs: https://webplatformforembedded.github.io/Lightning/docs/components/statemachine/statemachine
     * @returns {*[]}
     * @private
     */
    static _states() {
        return [
            class Create extends this{
                $enter(){
                    this.patch({
                        Create:{smooth:{alpha:1}},
                        Patterns:{smooth:{alpha:0}}
                    });
                }
                $exit(){
                    this.tag("Create").setSmooth("alpha", 0);
                }

                /**
                 * tell lightning which component is the active component
                 * and should handle the key / remote control events
                 * docs: https://webplatformforembedded.github.io/Lightning/docs/focus/focus
                 */
                _getFocused(){
                    return this.tag("Create");
                }
                _handleBack(){
                    this._setState("Patterns");
                }
            },
            class Patterns extends this{
                $enter(){
                    this.tag("Patterns").setSmooth("alpha", 1);
                }
                $exit(args){
                    // we don't want to hide the patterns view
                    // if the new state eq Profile
                    if(args.newState !== "Profile"){
                        this.tag("Patterns").setSmooth("alpha", 0);
                    }
                }
                _handleUp(){
                    this._setState("Create");
                }
                _getFocused(){
                    return this.tag("Patterns");
                }
            },
            class Profile extends this{
                _getFocused(){
                    return this.tag("Profile");
                }
                _handleEnter(){
                    this._setState("Create");
                }
                _handleDown(){
                    this._setState("Patterns")
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

App.DEFAULT_SEQUENCES = [
    [9,9,9,10,11,10,11,10,9,9,9],
    [9,9,9,10,11,10,11,10,9,9,9,10,11,10,11,10],
    [9,9,9,10,11,10,11,10,9,9,9],
    [11,11,10,10,9,10,9,10,10,9,9],
    [9,9,9,10,11,10,11,10,9,9,9,10,11,10,11,10],
    [9,9,9,10,11,10,11,10,9,9,9]
];