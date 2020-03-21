import Base from "../Base.js"

class TextComponent extends Base.Component {
    text;
    font;
    fill;

    constructor() {
        super();
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.fill;
        ctx.font = this.font;
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
    update() {

    }
}

export default TextComponent;