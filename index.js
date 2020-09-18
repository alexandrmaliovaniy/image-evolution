class Img {

    static EmptyImage(width, height) {
        let res = [];
        for (let i = 0; i < width * height; i++) {
            res[i] = 0;
        }
        return res;
    }
    static RandomImage(width, height, chance = 0) {
        let res = [];
        for (let i = 0; i < width * height; i++) {
            res[i] = Math.round(Math.random() + chance);
        }
        return res;
    }



    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.data = Img.EmptyImage;
    }
    SetData(newData) {
        for (let i = 0; i < newData.length; i++) {
            this.data[i] = newData[i];
        }
        return this;
    }
    SetColor(x, y, color) {
        this.data[x + y * this.height] = color;
    }
    GetColor(x, y) {
        return this.data[x + y * this.height];
    }
    Copy() {
        let res = new Img(this.width, this.height);
        res.SetData(this.data);
        return res;
    }
    toString() {
        let row = '\n';
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                row += this.data[j + i * this.height] == 0 ? "  " : "■ "
            }
            row+= "\n";
        }
        return row;
    }
    GetValue(x, y) {
        let E = this.GetColor(x, y - 1) + this.GetColor(x + 1, y) + this.GetColor(x - 1, y) + this.GetColor(x, y + 1);
        let NotE = this.GetColor(x + 1, y + 1) + this.GetColor(x - 1, y + 1) + this.GetColor(x + 1, y - 1) + this.GetColor(x - 1, y - 1);
        let F = 8 - E - NotE;
        return Math.pow(Math.abs(E - NotE) - 2, 2) - Math.pow(F - 4, 2);
    }
}

console.time('timer');

let test = new Img(48, 48);
test.SetData(Img.RandomImage(test.width, test.height, -0.2));

let pixDelta = 0;

function NewGeneration() {
    let x = Math.floor(Math.random() * (test.width - 2)) + 1;
    let y  = Math.floor(Math.random() * (test.height - 2)) + 1;
    let d = test.GetValue(x, y);
    for (let i = 0; i < 100000; i++) {
        let _x = Math.floor(Math.random() * (test.width - 2)) + 1;
        let _y  = Math.floor(Math.random() * (test.height - 2)) + 1;
        let _d = test.GetValue(_x, _y);
        if (_d > d && test.GetColor(_x, _y) == 0 && Math.abs(pixDelta) < 20) {
            x = _x;
            y = _y;
            d = _d;
        } else if (_d < -5) {
            pixDelta--;
            test.SetColor(_x, _y, 0);
        }
    }
    let color = d >= 0 ? 1 : 0;
    if (color == 0 && test.GetColor(x, y) == 1) {
        pixDelta--;
    } else if (color == 1 && test.GetColor(x, y) == 0) {
        pixDelta++;
    }
    test.SetColor(x, y, color);
    console.clear();
    console.log(test.toString());
    console.log(d);
    setTimeout(function() {
        NewGeneration();
    }, 60);
}
NewGeneration();

// for (let i = 0; i < 1000; i++) {
//     NewGeneration();
// }
//console.log(test.toString());


//console.timeEnd('timer');