export default class Worker extends lng.Component {

    static _template(){
        return {
            Status:{
                text:{text:'running task 0'}
            }
        }
    }

    set buttonPress(v){
        this._buttonPress = v;
    }

    _init(){
        this._thunderjs = this.cparent.thunderjs;
    }

    // setters will be called upon component creation
    // (see App template)
    set speed(v){
        this._speed = v*1000;
    }

    start(sequence){
        this._sequence = sequence;
        this._setState("Working");
    }

    static _states(){
        return [
            class Working extends this{
                $enter(){
                    this.next();
                }
                // When parent tries to call start again
                // it would invoke this method since we're
                // Running state ( this pattern mimics(!) setPrototypeOf() )
                start(sequence){
                    // clear timer
                    clearTimeout(this._timeout);

                    // set new sequence
                    this._sequence = sequence;

                    // begin running the tasks
                    // todo: reset, turn off active led
                    this.next();
                }
                next(){
                    this._timeout = setTimeout(()=>{
                        if(this._sequence.length){
                            const task = this._sequence.shift();
                            this.runTask(task);
                        }else{
                            this.stop();
                        }
                    },this._speed);
                }
                runTask(pin){
                    // if we have pin activity
                    // we turn it off
                    if(this._activePin){
                        this._thunderjs.call("IOConnector",`pin@${pin}`, {params:0});
                    }

                    this._activePin = pin;
                    this._thunderjs.call("IOConnector",`pin@${pin}`, 1);

                    // schedule next
                    this.next();
                }
                stop(){
                    // @todo: reset text
                }
            }
        ]
    }
}