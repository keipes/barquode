// SVG
const svg = document.getElementsByTagName("svg")[0];
const nominalWidth = 1.469;
const nominalHeight = 0.9;

function adjustSvgScale(scaleNum) {
    svg.setAttribute("width", (scaleNum * nominalWidth / 100).toString() + "in");
    svg.setAttribute("height", (scaleNum * nominalHeight / 100).toString() + "in");
}

// Get and set query string params.
function query(label: string, q: string = undefined): string {
    const params = new URLSearchParams(window.location.search);
    if (typeof q === 'undefined') {
        return params.get(label);
    } else {
        params.set(label, q);
        const newRelativePathQuery = window.location.pathname + '?' + params.toString();
        history.pushState(null, '', newRelativePathQuery);
        return q;
    }
}

// # Barcode Input
const barcodeInput: HTMLInputElement = <HTMLInputElement> document.getElementById('bc');
// Get initial value from query params.
const initialBarcodeValue = parseInt(query('q'));
if (!isNaN(initialBarcodeValue)) {
    barcodeInput.value = initialBarcodeValue.toString();
    handleBarcode(initialBarcodeValue.toString());
}
// Attach listener.
barcodeInput.addEventListener('input', (e: InputEvent) => {
    handleBarcode(barcodeInput.value);
    query('q', barcodeInput.value);
});

function handleBarcode(code: string) {
    let newCode: string = code;
    if (code.length < 12) {
        let padded = code.padEnd(12, '0');
        setSvgBars(upca(padded.split('').map(Number)));
        return;
    } else if (code.length == 13) {
        setSvgBars(ean13(code.split('').map(Number)));
        return;
    } else {
        alert('barcode too long');
        return;
    }
}

// # Slider Input
const sliderInput: HTMLInputElement = <HTMLInputElement> document.getElementById('bc-size');
// Get initial value from query params.
const initialSliderValue = parseInt(query('s'));
if (isNaN(initialSliderValue) || initialSliderValue < 80 || initialSliderValue > 200) {
    sliderInput.value = "100";
} else {
    sliderInput.value = initialSliderValue.toString();
    adjustSvgScale(initialSliderValue);
}
// Attach listener.
sliderInput.addEventListener('input', (e: InputEvent) => {
    const scale = sliderInput.value;
    // const scaleNum = parseInt(scale);
    adjustSvgScale(parseInt(scale));
    query('s', sliderInput.value);
});

console.log(typeof document.getElementById('btn-reset'));
// # Buttons
// Reset button
const resetButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById('btn-reset');
resetButton.addEventListener('click', (e: MouseEvent) => {
    barcodeInput.value = "";
    query('q', "");
    // console.log(e);
});
// Reset scale button
const resetScaleButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById('btn-reset-scale');
resetScaleButton.addEventListener('click', (e: MouseEvent) => {
    adjustSvgScale(100);
    sliderInput.value = "100";
    query('s', "100");
});
// Download button

const downloadSvgButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById('btn-download-svg');
downloadSvgButton.addEventListener('click', (e: MouseEvent) => {
    console.log(e);
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
}
// 5.2.3.4 Quiet Zone

class Code {
    elements: number[];

    constructor() {
        this.elements = [];
    }

    addSpace(length: number) {
        for (let i = 0; i < length; i++) {
            this.elements.push(0);
        }
    }

    addBar(length: number) {
        for (let i = 0; i < length; i++) {
            this.elements.push(1);
        }
    }

    addGuard() {
        this.elements.push(1, 0, 1);
    }

    addCenterGuard() {
        this.elements.push(0, 1, 0, 1, 0);
    }

    addAPattern(digits: number[]) {
        if (digits.length !== 4) {
            alert("broken");
            return;
        }
        this.addSpace(digits[0]);
        this.addBar(digits[1]);
        this.addSpace(digits[2]);
        this.addBar(digits[3]);
    }

    addCPattern(digits: number[]) {
        if (digits.length !== 4) {
            alert("broken");
            return;
        }
        this.addBar(digits[0]);
        this.addSpace(digits[1]);
        this.addBar(digits[2]);
        this.addSpace(digits[3]);
    }
}

function ean13(digits: number[]): Code {
    if (digits.length !== 13) {
        alert("broken");
        return;
    }
    let code = new Code();
    code.addSpace(11); // leading quiet zone
    code.addGuard();
    // Left numbers from set A or B.
    const sets = characterSets[digits[0]];
    for (let i = 1; i < 7; i++) {
        let toEncode = digits[i];
        // use set A or B?
        let set = sets[i - 1];
        if (set === 0) {
            // set A
            code.addAPattern(encoding[toEncode]);
        } else {
            // set B
            code.addAPattern(encoding[toEncode].slice().reverse());
        }
    }
    code.addCenterGuard();
    // Right numbers from set C.
    for (let i = 7; i < 13; i++) {
        console.log(digits[i]);

        code.addCPattern(encoding[digits[i]]);
    }
    code.addGuard();
    code.addSpace(7); // trailing quiet zone
    return code;
}

function upca(digits: number[]) {
    let code = new Code();
    code.addSpace(9); // leading quiet zone
    code.addGuard();
    // Left numbers from set A or B.
    const sets = characterSets[digits[0]];
    for (let i = 0; i < 6; i++) {
        code.addAPattern(encoding[digits[i]]);
    }
    code.addCenterGuard();
    // Right numbers from set C.
    for (let i = 6; i < 12; i++) {
        console.log(digits[i]);

        code.addCPattern(encoding[digits[i]]);
    }
    code.addGuard();
    code.addSpace(9); // trailing quiet zone

    return code;


}

function ean8() {
    let code = new Code();
    code.addSpace(7); // leading quiet zone


    code.addSpace(7); // trailing quiet zone
}

function upce() {
    let code = new Code();
    code.addSpace(9); // leading quiet zone


    code.addSpace(7); // trailing quiet zone
}

// 5.2.5 Human readable interpretation


// Update SVG
function setSvgBars(code: Code) {
    let output = '<rect x="0" y="0" width="113" height="100" fill="white"/>';
    const elements = code.elements;
    let prevColor = 0;
    let startX = 0;
    for (let i = 0; i < elements.length; i++) {
        let curColor = elements[i];
        if (curColor !== prevColor) {
            if (prevColor === 1) {
                output += `<rect x="${startX}" y="0" width="${i - startX}" height="100" fill="black"/>`
            }
            startX = i;
            prevColor = curColor;
        }
    }
    svg.innerHTML = output;
}


console.log("loaded");
console.log(ean13("9501101531000".split('').map(Number)).elements);

setSvgBars(ean13("9501101531000".split('').map(Number)));