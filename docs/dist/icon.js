import { Mix, Log, FromData } from "./mixins.js";
class Icon extends Mix(Log("icon", "orange"), FromData("icon/", ".tico")) {
    constructor(text) {
        super();
        this.dotColor = {
            "#": "black",
            " ": "white",
            "R": "red",
            "r": "darksalmon",
            "B": "blue",
            "b": "cornflowerblue",
            "M": "rebeccapurple",
            "m": "magenta",
            "G": "grey",
        };
        const lines = text.split("\n");
        const config = lines[0] === "<<<" ? {} : JSON.parse(lines[0]);
        const main = lines.slice(lines.findIndex(l => l === "<<<") + 1, lines.findIndex(l => l === ">>>"));
        if (config.color)
            Object.assign(this.dotColor, config.color);
        this.matrix = main.map(l => l.split("").map(c => this.dotColor[c]));
    }
    paint(cvs) {
        this.log("Painting icon. name: `%s`", this.name);
        cvs.width = this.matrix[0].length * Icon.dotSize;
        cvs.height = this.matrix.length * Icon.dotSize;
        const ctx = cvs.getContext("2d");
        for (let y = 0; y < this.matrix.length; y++)
            for (let x = 0; x < this.matrix[y].length; x++) {
                ctx.fillStyle = this.matrix[y][x];
                ctx.fillRect(x * Icon.dotSize, y * Icon.dotSize, Icon.dotSize, Icon.dotSize);
            }
    }
}
Icon.dotSize = 4;
export { Icon };
//# sourceMappingURL=icon.js.map