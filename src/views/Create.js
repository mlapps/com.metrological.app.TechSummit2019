import App from "../App.js";
import RoundedRectangleShader from "../shaders/RoundedRectangleShader.js";

export default class Create extends lng.Component {
    static _template() {
        return {
            Buttons: {},
            Title:{
                y:240, text:{text:'Sequence', fontFace: "Regular"}
            },
            Pattern:{
                rtt: true, shader: {type: RoundedRectangleShader, radius: 20},
                y: 330, w: 1710, h: 200, rect: true, color: 0x20000000,
                Items: {x: 20, y: 20}
            },
            Save:{
                rect: true, w:200, h:90, alpha:0.4, y: 600,
                Label:{ mount:0.5, x:100, y:45,
                    text:{text:'STORE', fontFace: "Regular", textColor: 0xff000000}
                }
            }
        }
    }

    _init() {
        this.build();
        this._buttonIndex = 0;

        this._setState("Buttons");
    }

    build() {
        this.tag("Buttons").children = [
            {label: 'RED', pin: 14},
            {label: 'YELLOW', pin: 15},
            {label: 'GREEN', pin: 18},
        ].map((el, idx) => {
            return {
                type: Button,
                label: el.label,
                pin: el.pin,
                colorTop: App.COLORS[el.label],
                colorBottom: App.COLORS[el.label] - 0x30ffffff,
                x: idx * 200
            };
        });
    }


    _active() {
        this._sequence = [];
    }

    _inactive() {

    }

    $addTask(){
        const {pin, label} = this.activeButton;
        const task = {
            pin, label
        };

        // add new task to the sequence
        this._createTask(task);
    }

    _createTask(task){
        this.tag("Items").childList.a({
            type: Item, task, x: this._sequence.length * 94, label: this._sequence.length
        });

        this._sequence.push(task);
    }

    _setIndex(index){
        this._buttonIndex = index;
    }

    get activeButton(){
        return this.buttons[this._buttonIndex];
    }

    get buttons(){
        return this.tag("Buttons").children;
    }

    get tasks(){
        return this.tag("Pattern").children;
    }

    static _states(){
        return [
            class Buttons extends this{
                $enter(){

                }
                $exit(){

                }
                // will be called when left is pressed on remote control
                // and this component has focus
                _handleLeft(){
                    if(this._buttonIndex > 0){
                        this._setIndex(this._buttonIndex - 1);
                    }else{
                        this._setIndex(this.buttons.length -1);
                    }
                }

                // will be called when right is pressed on remote control
                // and this component has focus
                _handleRight(){
                    if(this._buttonIndex < this.buttons.length - 1){
                        this._setIndex(this._buttonIndex + 1);
                    }else{
                        this._setIndex(0);
                    }
                }
                _handleDown(){
                    this._setState("Save");
                }
                _getFocused(){
                    return this.activeButton;
                }
            },
            class Save extends this{
                $enter(){
                    this.tag("Save").patch({
                        smooth:{
                            alpha:1, scale:1.2
                        }
                    });
                }
                $exit(){
                    this.tag("Save").patch({
                        smooth:{
                            alpha:0.4, scale:1
                        }
                    });
                }
                _handleUp(){
                    this._setState("Buttons");
                }
                _getFocused(){
                    return this;
                }
            }
        ]
    }
}

class Button extends lng.Component {
    static _template() {
        return {
            rtt: true, shader: {type: RoundedRectangleShader, radius: 75},
            rect: true, w: 150, h: 150,
            Overlay: {
                rtt: true, shader: {type: RoundedRectangleShader, radius: 75}, color: 0x20000000,
                rect: true, w: 130, h: 130, mount: .5, x: 75, y: 75
            }
        };
    }

    _init() {
        this._enterAnimation = this.animation({duration: .3, actions: [
            {t: '', rv: 1, p: 'scale', v: {0: 1.2, .5: 1.1, 1: 1.2}},
        ]});
    }

    get label(){
        return this._label;
    }

    set label(v) {
        this._label = v;
    }

    get pin(){
        return this._pin;
    }

    set pin(v) {
        this._pin = v;
    }

    // lifecycle event:
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
    _focus(){
        // smooth each individual property
        this.setSmooth("scale", 1.2)
    }

    // lifecycle event:
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
    _unfocus(){
        // patch a part of the render tree
        this.patch({
            smooth:{
                scale:1
            }
        });

        this._enterAnimation.stop();
    }

    // will be called when ok button is pressed on remote control
    // and this component has focus
    _handleEnter() {
        this._enterAnimation.start();
        this.fireAncestors("$addTask");
    }
}

class Item extends lng.Component {
    static _template(){
        return {
            rtt: true, shader: {type: RoundedRectangleShader, radius: 40},
            rect: true, w:80, h:80, alpha: .1, scale : 0.1, y: 40,
            Overlay: {
                rtt: true, shader: {type: RoundedRectangleShader, radius: 30}, color: 0x20000000,
                rect: true, w: 60, h: 60, mount: .5, x: 40, y: 40
            },
            Label: {
                mount: .5, x: 40, y: 44, color: 0x90ffffff,
                text: {fontSize: 42, fontFace: "Black"}
            }
        }
    }

    _active() {
        this.patch({
           smooth: {
               scale: 1, alpha: 1, y: [0, {duration: .6}]
           }
        });
    }

    set task(v){
        this._task = v;
        const {label} = v;

        this.colorTop = App.COLORS[label];
        this.colorBottom = App.COLORS[label] - 0x40ffffff;
    }

    set label(v) {
        this.tag("Label").patch({
           text: {text: v}
        });
    }

    get task(){
        return this._task;
    }
}