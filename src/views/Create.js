import App from "../App.js";

export default class Create extends lng.Component {
    static _template() {
        return {
            Buttons: {

            },
            Title:{
                y:280, text:{text:'New Sequence'}
            },
            Pattern:{
                y: 370
            },
            Save:{
                rect: true, w:200, h:90, alpha:0.4, y: 500,
                Label:{ mount:0.5, x:100, y:45,
                    text:{text:'STORE', textColor: 0xff000000}
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
                color: App.COLORS[el.label],
                x: idx * 180
            };
        });
    }


    _active() {
        this._sequence = [];
    }

    _inactive() {

    }

    // will be called when ok button is pressed on remote control
    // and this component has focus
    _handleEnter(){
        const {pin, label} = this.activeButton;
        const task = {
            pin, label
        };

        // add new task to the sequence
        this._createTask(task);
    }

    _createTask(task){
        this.tag("Pattern").childList.a({
            type: Item, task, x: this._sequence.length * 90
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
            rect: true, w: 150, h: 150, alpha:0.3
        };
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
        this.setSmooth("alpha", 1);
        this.setSmooth("scale", 1.2)
    }

    // lifecycle event:
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/overview#component-events
    _unfocus(){
        // patch a part of the render tree
        this.patch({
            smooth:{
                alpha: 0.3,
                scale:1
            }
        });
    }
}

class Item extends lng.Component {
    static _template(){
        return {
            rect: true, w:80, h:80
        }
    }

    set task(v){
        this._task = v;
        const {label} = v;

        this.color = App.COLORS[label];
    }

    get task(){
        return this._task;
    }
}