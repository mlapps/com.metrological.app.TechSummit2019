import App from "../App.js";

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
        }
    }

    _handleDown(){
        if(this._index < this.patterns.length - 1){
            this._setIndex(++this._index);
        }
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
    }

    _unfocus(){
        this.setSmooth("alpha",0.4);
    }
}

class Item extends lng.Component{
    static _template(){
        return {
            rect: true, w:80, h: 80
        }
    }

    set pin(v){
        this.color = App.COLORS[App.PINS[v]];
    }

}