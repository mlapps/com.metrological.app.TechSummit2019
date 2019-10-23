import App from "../App.js";
import RoundedRectangleShader from "../shaders/RoundedRectangleShader.js";

export default class Patterns extends lng.Component {
    static _template(){
        return {
            Wrapper:{

            }
        }
    }

    _init(){
        this._index = 0;
    }

    add(pattern){
        this.tag("Wrapper").childList.a({
            type: Pattern,
            pattern,
            index: this.patterns.length + 1,
            y: this.patterns.length * 200
        });
    }

    get patterns(){
        return this.tag("Wrapper").children;
    }

    get activePattern(){
        return this.patterns[this._index];
    }

    _handleUp(){
        if(this._index > 0){
            this._setIndex(--this._index);
        }else{
            // by explicitly returning false
            // we let the event bubble up
            return false;
        }
    }

    _handleDown(){
        if(this._index < this.patterns.length - 1){
            this._setIndex(++this._index);
        }
    }

    // child parent communication
    // docs: https://webplatformforembedded.github.io/Lightning/docs/components/communication/fireancestors
    _handleEnter(){
        this.fireAncestors('$sequence',{sequence: this.activePattern.pattern});
    }

    _setIndex(index){
        this._index = index;
        this.patch({
            Wrapper:{
                smooth:{y: index * -200}
            }
        });
    }

    _getFocused(){
        return this.activePattern;
    }
}

class Pattern extends lng.Component{
    static _template(){
        return {
            alpha: 0.4,
            Label:{
                text:{text:''}
            },
            Tasks:{
                y: 90
            }
        }
    }

    set pattern(v){
        this._pattern = v;
        this.tag("Tasks").children = v.map((el, idx)=>{
            return {
                type: Item, x: idx * 90, pin:el
            }
        });
    }

    get pattern(){
        return this._pattern;
    }

    set index(v){
        this._index = v;
        this.tag("Label").text.text = `Sequence ${v}`
    }

    _focus(){
        this.setSmooth("alpha",1);
        this.setSmooth("scale",1.1);
    }

    _unfocus(){
        this.setSmooth("alpha",0.4);
        this.setSmooth("scale",1);
    }
}

class Item extends lng.Component{
    static _template(){
        return {
            rtt: true, shader: {type: RoundedRectangleShader, radius: 40},
            rect: true, w:80, h:80, alpha: 1, scale : 1,
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

    set pin(v){
        this.colorTop = App.COLORS[App.PINS[v]];
        this.colorBottom = App.COLORS[App.PINS[v]] - 0x40ffffff;
    }

}