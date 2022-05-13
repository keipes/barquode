const ns = 'http://www.w3.org/2000/svg';

let scale = 2;
const svg = document.createElementNS(ns, 'svg');
const svgS = svg.setAttribute.bind(svg);
svgS('xmlns', ns);
svgS('width', `${1.469 * scale}in`);
svgS('height', `${0.9 * scale}in`);
svgS('viewBox', '0 0 113 100');
svgS('preserveAspectRatio', 'none');

const getRect = (x, y, width, height, color) => {
    const rect = document.createElementNS(ns, 'rect');
    const rs = rect.setAttribute.bind(rect);
    rs('x', x);
    rs('y', y);
    rs('width', width);
    rs('height', height);
    rs('fill', color);
    svg.appendChild(rect);
    return rect;
};

let backgroundRect = getRect(0, 0, 113, 100, 'white');
document.getElementById("barcode").appendChild(svg);

const listen = (id: string, t: string, cb) => document.getElementById(id).addEventListener(t, cb);

const bcI: HTMLInputElement = <HTMLInputElement> document.getElementById('bc');
bcI.focus();

listen('bc-size', 'input', e => {
    scale = parseFloat(e.target.value);
    svgS('width', `${1.469 * scale}in`);
    svgS('height', `${0.9 * scale}in`);
});

// GS1 Release 22, Section 5.2.1.2.1, "Symbol character encodation"
// This table contains A elements. The B set contains the A elements in reverse. C is the A set with swapped bars and spans.
const encoding = {
    0: [3, 2, 1, 1],
    1: [2, 2, 2, 1],
    2: [2, 1, 2, 2],
    3: [1, 4, 1, 1],
    4: [1, 1, 3, 2],
    5: [1, 2, 3, 1],
    6: [1, 1, 1, 4],
    7: [1, 3, 1, 2],
    8: [1, 2, 1, 3],
    9: [3, 1, 1, 2],
};
const characterSets = {
    0: [0, 0, 0, 0, 0, 0],
    1: [0, 0, 1, 0, 1, 1],
    2: [0, 0, 1, 1, 0, 1],
    3: [0, 0, 1, 1, 1, 0],
    4: [0, 1, 0, 0, 1, 1],
    5: [0, 1, 1, 0, 0, 1],
    6: [0, 1, 1, 1, 0, 0],
    7: [0, 1, 0, 1, 0, 1],
    8: [0, 1, 0, 1, 1, 0],
    9: [0, 1, 1, 0, 1, 0],
};

/*
Each number has two bars and two blanks, but we only need to draw the blanks so only two slots are stored.

rects {
0: first guard bar
1: second guard bar
2,3: first digit
4,5: second digit
6,7: third digit
8,9: fourth digit
10,11: fifth digit
12,13: sixth digit
14: first middle guard bar
15: second middle guard bar
16,17: seventh digit
18, 19: eighth digit
20, 21: ninth digit
22, 23: tenth digit
24, 25: eleventh digit
27, 28: twelfth digit
29: first end guard bar
30: second end guard bar
}
 */
const rects = [...Array(24).keys()].map(_ => getRect(0,0, 0, 100, 'black'));
// left guard bar
getRect(12, 0, 1, 100, 'black');
getRect(14, 0, 1, 100, 'black');
// middle guard
getRect(57, 0, 1, 100, 'black');
getRect(59, 0, 1, 100, 'black');
// right guard bar
getRect(101, 0, 1, 100, 'black');
getRect(103, 0, 1, 100, 'black');

const digitStart = (index) => {
    // offset by quiet space, left guard, prior digits
    let offset = 11 + 3 + (index * 7);
    // add middle guard width for upper six digits
    if (index > 5) offset += 5;
    return offset;
}
for (let i = 0; i < 12; i++) {
    console.log(`${i} ${digitStart(i)}`)
}

const uRect = (index, key, val) => {
    rects[index].setAttribute(key, val);
};

const setDigit = (index, value, special) => {
    console.log(`${index} ${value} ${special}`);
    // "special" is the extra character encoded in ean13
    // a value of 0 generates a valid UPCA barcode
    let i = index > 5 ? index - 5 : index;
    let aBMask = (index > 5) ? characterSets[0] : characterSets[special];
    let encoded = encoding[value].slice();
    if (index < 6 && aBMask[i] === 1) encoded.reverse();
    let startX: number = digitStart(index);

    let barOneIdx = index * 2;
    let barTwoIdx = barOneIdx + 1;

    if (index > 5) {
        // 0
        uRect(barOneIdx, 'x', startX);
        uRect(barOneIdx, 'width', encoded[0]);
        // 2
        uRect(barTwoIdx, 'x', startX + encoded[0] + encoded[1]);
        uRect(barTwoIdx, 'width', encoded[2]);
    } else {
        // 1
        uRect(barOneIdx, 'x', startX + encoded[0]);
        uRect(barOneIdx, 'width', encoded[1]);
        // 3
        uRect(barTwoIdx, 'x', startX + encoded[0] + encoded[1] + encoded[2]);
        uRect(barTwoIdx, 'width', encoded[3]);
    }
};

const clearDigit = index => {
    let barOneIdx = index * 2;
    let barTwoIdx = (index * 2) + 1;
    uRect(barOneIdx, 'x', 0);
    uRect(barOneIdx, 'width', 0);
    uRect(barTwoIdx, 'x', 0);
    uRect(barTwoIdx, 'width', 0);
}

const maxLength = 13;
listen('bc', 'input', e => {
    if (e.target.value.length > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
    }
    updateBarcode(e.target.value);
});

let currentBarcode = "";
const updateBarcode = barcode => {
    let special = 0;
    let curDigits = currentBarcode.split('').map(Number);
    let digits = barcode.split('').map(Number);
    if (barcode.length === 13) {
        special = digits[0];
        digits = digits.slice(1);
    }
    for (const [i, value] of digits.entries()) {
        if (curDigits[i] !== value) {
            setDigit(i, value, special);
        }
    }
    for (let i = digits.length; i < 12; i++) {
        clearDigit(i);
    }
};
