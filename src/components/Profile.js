export default class Profile extends lng.Component {
    static _template(){
        return {
            User:{
                text:{
                    text: 'Welkom User', fontFace: "Regular"
                }
            },
            Time:{ y:54, color: 0x80ffffff,
                text:{
                    text: '00:00:00', fontFace: "Black", fontSize: 48
                }
            }
        }
    }

    _init(){
        this._interval = setInterval(()=>{
            this._setTime();
        },900);

        // run it for the first time
        this._setTime();
    }

    _setTime(){
        const d = new Date();
        const time = [d.getHours(),d.getMinutes(), d.getSeconds()].map((part)=>{
            return part < 10 ? `0${part}` : part
        }).join(":");

        this.tag("Time").text.text = time;
    }

}

