const ns = 'http://www.w3.org/2000/svg';

let scale = 2;
const svg = document.createElementNS(ns, 'svg');
const svgS = svg.setAttribute.bind(svg);
svgS('xmlns', ns);
svgS('width', `${1.469 * scale}in`);
// svgS('height', `${0.9 * scale}in`);
// svgS('viewBox', '0 0 113 69');
svgS('preserveAspectRatio', 'none');

const eanViewBox = () => svgS('viewBox', '0 0 113 69');
const upcViewBox = () => svgS('viewBox', '2 0 113 69');
upcViewBox();

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

let backgroundRect = getRect(0, 0, 115, 69, 'white');
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
const digitStart = (index) => {
    // offset by quiet space, left guard, prior digits
    let offset = 11 + 3 + (index * 7);
    // add middle guard width for upper six digits
    if (index > 5) offset += 5;
    return offset;
}
const rects = [...Array(24).keys()].map(i => getRect(digitStart(i / 2),0, 0, 69, 'black'));
// left guard bar
getRect(11, 0, 1, 69, 'black');
getRect(13, 0, 1, 69, 'black');
// middle guard
getRect(57, 0, 1, 69, 'black');
getRect(59, 0, 1, 69, 'black');
// right guard bar
getRect(103, 0, 1, 69, 'black');
getRect(105, 0, 1, 69, 'black');


// for (let i = 0; i < 12; i++) {
//     console.log(`${i} ${digitStart(i)}`)
// }

const uRect = (index, key, val) => {
    rects[index].setAttribute(key, val);
};

const setDigit = (index, value, special) => {
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
    // uRect(barOneIdx, 'x', 0);
    uRect(barOneIdx, 'width', 0);
    // uRect(barTwoIdx, 'x', 0);
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
        eanViewBox();
        special = digits[0];
        digits = digits.slice(1);
    } else {
        upcViewBox();
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
