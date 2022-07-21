/*
TODO: PNG output @ 300 ppi

TODO: delete SVG blob from document when download is done

TODO: disable download button when other than 12 or 13 digits are entered
 */

const ns = 'http://www.w3.org/2000/svg';

const svg = document.createElementNS(ns, 'svg');
document.getElementById("barcode").appendChild(svg);
const group = document.createElementNS(ns, 'g');
svg.appendChild(group);

const xDimensionMM = 0.33;
const horizontalDim = 113;
const verticalDim = 80; // 69 for normal pattern, 11 additional for guard extensions and characters
// Characters are scaled to fit in a 7x11 block with padding of .5-1 on all sides.
// (0, 0) of the box is the upper left corner.
// These are the characters 0-9 from a creative commons OCRB font created by Matthew Anderson. They have been scaled
// down, vertically flipped, and translated up. https://web.archive.org/web/20190328165040/https://wehtt.am/ocr-b/
const digitPaths = [
    'M 1.0368 5.4528 C 1.0368 8.4768 2.2356 9.7404 3.5208 9.7404 C 4.8492 9.7404 6.0048 8.6064 6.0048 5.4528 C 6.0048 2.472 5.0544 1.2516 3.5208 1.2516 C 2.0412 1.2516 1.0368 2.4936 1.0368 5.4528 Z M 1.9008 5.4528 C 1.9008 3.1092 2.5272 2.1156 3.5208 2.1156 C 4.6332 2.1156 5.1408 3.12 5.1408 5.4528 C 5.1408 7.764 4.6224 8.8548 3.5208 8.8548 C 2.5488 8.8548 1.9008 7.8072 1.9008 5.4528 Z', // 0
    'M 1.3176 3.444 C 1.3176 3.6276 1.512 3.8004 1.7064 3.8004 C 1.8576 3.8004 2.0088 3.6924 2.1384 3.5844 L 3.5532 2.3316 V 9.168 C 3.5532 9.4704 3.6936 9.708 3.9852 9.708 C 4.2768 9.708 4.4172 9.4596 4.4172 9.168 V 1.986 C 4.4172 1.608 4.2444 1.284 3.7908 1.284 C 3.402 1.284 3.1752 1.5 3.024 1.6404 L 1.6092 2.8932 C 1.404 3.0768 1.3176 3.2172 1.3176 3.444 Z', // 1
    'M 1.1772 2.4828 C 1.1772 2.7204 1.3176 2.8932 1.566 2.8932 C 2.1492 2.8932 2.1168 2.1156 3.3264 2.1156 C 4.2768 2.1156 4.8168 2.796 4.8168 3.552 C 4.8168 4.3404 3.9096 5.01 3.1428 5.5068 C 1.9872 6.2412 1.1448 7.3104 1.1448 8.8332 C 1.1448 9.3408 1.3932 9.5892 2.0088 9.5892 H 5.3784 C 5.67 9.5892 5.9184 9.4488 5.9184 9.1572 C 5.9184 8.8656 5.6808 8.7252 5.3784 8.7252 H 2.0196 C 2.0844 7.4724 2.7648 6.738 3.618 6.198 C 4.536 5.6148 5.6808 4.8696 5.6808 3.552 C 5.6808 2.2776 4.698 1.2516 3.3264 1.2516 C 2.1384 1.2516 1.1772 2.1372 1.1772 2.4828 Z', // 2
    'M 0.8748 8.6928 C 0.8748 9.276 2.376 9.7404 3.024 9.7404 C 4.5036 9.7404 5.9076 8.79 5.9076 7.1268 C 5.9076 5.6472 5.1732 4.8264 3.8448 4.5996 L 5.2488 2.904 C 5.4972 2.6232 5.6376 2.364 5.6376 2.0508 C 5.6376 1.662 5.2812 1.4136 4.8384 1.4136 H 1.3932 C 1.0908 1.4136 0.8532 1.5756 0.8532 1.8456 C 0.8532 2.1372 1.1016 2.2776 1.3932 2.2776 H 4.6224 L 2.7432 4.578 C 2.6568 4.6644 2.6244 4.794 2.6244 4.9128 C 2.6244 5.2044 2.8728 5.3448 3.1644 5.3448 C 4.266 5.3448 5.0436 5.8956 5.0436 7.1052 C 5.0436 8.1312 4.0824 8.8764 3.024 8.8764 C 2.0088 8.8764 1.8252 8.3256 1.2096 8.3256 C 1.026 8.3256 0.8748 8.4984 0.8748 8.6928 Z', // 3
    'M 1.026 7.0944 C 1.026 7.5588 1.458 7.7208 2.0844 7.7208 H 4.0284 V 9.168 C 4.0284 9.4596 4.1688 9.708 4.4604 9.708 C 4.752 9.708 4.914 9.4596 4.8924 9.168 V 7.7208 H 5.5728 C 5.8644 7.7208 6.1128 7.5804 6.1128 7.2888 C 6.1128 6.9972 5.8752 6.8568 5.5728 6.8568 H 4.8924 V 5.496 C 4.914 5.2044 4.752 4.956 4.4604 4.956 C 4.1688 4.956 4.0284 5.2044 4.0284 5.496 V 6.8568 H 1.9872 L 4.158 2.094 C 4.2228 1.9428 4.266 1.7916 4.266 1.6296 C 4.266 1.4784 4.0716 1.284 3.8664 1.284 C 3.6612 1.284 3.4992 1.4244 3.4344 1.5972 L 1.3284 6.2088 C 1.2096 6.4572 1.026 6.7812 1.026 7.0944 Z', // 4
    'M 1.3176 9.3084 C 1.3176 9.6108 1.566 9.7404 1.8576 9.7404 C 3.7368 9.7404 5.7132 8.8008 5.7132 6.7164 C 5.7132 4.956 4.3632 4.0488 2.43 4.1676 L 2.5164 2.2776 H 4.968 C 5.2596 2.2776 5.508 2.1264 5.508 1.8456 C 5.508 1.554 5.2704 1.4136 4.968 1.4136 H 2.2248 C 1.9332 1.4136 1.7064 1.6296 1.6848 1.9212 L 1.5336 4.524 C 1.512 4.8696 1.7496 5.064 2.0196 5.064 C 2.1924 5.064 2.3652 5.0316 2.592 5.0316 C 4.2444 5.0316 4.8168 5.8308 4.8168 6.7164 C 4.8168 7.9692 3.4992 8.8764 1.8576 8.8764 C 1.566 8.8764 1.3176 9.006 1.3176 9.3084 Z', // 5
    'M 0.9288 7.0188 C 0.972 8.6928 2.1492 9.7404 3.5208 9.7404 C 4.8924 9.7404 6.1128 8.6712 6.1128 7.0188 C 6.1128 5.3232 4.9788 4.3404 3.5208 4.3404 C 3.2832 4.3404 2.97 4.4376 2.754 4.4808 C 3.2616 3.6924 3.9636 2.8068 4.698 2.0832 C 4.7952 1.9968 4.8384 1.8564 4.8384 1.716 C 4.8384 1.4892 4.644 1.284 4.428 1.284 C 4.2876 1.284 4.1364 1.338 4.0392 1.446 C 3.1968 2.364 2.4516 3.2928 1.7928 4.3836 C 1.3824 5.064 0.9288 5.9388 0.9288 7.0188 Z M 1.9008 7.0188 C 1.9008 6.0684 2.4732 5.2044 3.5208 5.2044 C 4.6008 5.2044 5.2488 5.9388 5.2488 7.0188 C 5.2488 8.0772 4.482 8.8764 3.5208 8.8764 C 2.5488 8.8764 1.9008 8.088 1.9008 7.0188 Z', // 6
    'M 1.0368 1.8456 C 1.0368 2.1372 1.2852 2.2776 1.5768 2.2776 H 5.0328 C 4.7952 3.39 3.834 4.3188 3.2616 5.3232 C 2.6028 6.4788 2.3976 7.8288 2.3976 9.168 C 2.3976 9.4704 2.538 9.708 2.8296 9.708 C 3.1212 9.708 3.2616 9.4596 3.2616 9.168 C 3.2616 8.0232 3.4128 6.8568 3.9852 5.8524 C 4.7628 4.5132 6.0048 3.4656 6.0048 1.9536 C 6.0048 1.662 5.7672 1.4136 5.4648 1.4136 H 1.5768 C 1.2744 1.4136 1.0368 1.5432 1.0368 1.8456 Z', // 7
    'M 1.0368 7.44 C 1.0368 8.8116 2.1816 9.7404 3.5208 9.7404 C 4.9356 9.7404 6.0048 8.79 6.0048 7.44 C 6.0048 6.3816 5.3676 5.5932 4.4388 5.0316 C 5.2164 4.6104 5.6376 4.0704 5.6376 3.12 C 5.6376 1.986 4.6548 1.2516 3.5208 1.2516 C 2.376 1.2516 1.404 1.9752 1.404 3.12 C 1.404 4.0704 1.9656 4.632 2.6028 5.0316 C 1.674 5.5932 1.0368 6.3708 1.0368 7.44 Z M 1.89 7.44 C 1.89 6.5436 2.5488 5.9604 3.5424 5.4744 C 4.2444 5.8416 5.1408 6.5868 5.1408 7.44 C 5.1408 8.2176 4.5684 8.8764 3.5208 8.8764 C 2.5704 8.8764 1.89 8.2392 1.89 7.44 Z M 2.268 3.12 C 2.268 2.5692 2.808 2.1156 3.5208 2.1156 C 4.3416 2.1156 4.7736 2.5692 4.7736 3.12 C 4.7736 3.8436 4.1364 4.3188 3.5208 4.5996 C 2.916 4.3188 2.268 3.8328 2.268 3.12 Z', // 8
    'M 6.102 4.0164 C 6.0588 2.3424 4.8816 1.2948 3.51 1.2948 C 2.1384 1.2948 0.918 2.364 0.918 4.0164 C 0.918 5.712 2.052 6.6948 3.51 6.6948 C 3.7476 6.6948 4.0608 6.5976 4.2768 6.5544 C 3.7692 7.3428 3.0672 8.2284 2.3328 8.952 C 2.2356 9.0384 2.1924 9.1788 2.1924 9.3192 C 2.1924 9.546 2.3868 9.7512 2.6028 9.7512 C 2.7432 9.7512 2.8944 9.6972 2.9916 9.5892 C 3.834 8.6712 4.5792 7.7424 5.238 6.6516 C 5.6484 5.9712 6.102 5.0964 6.102 4.0164 Z M 5.13 4.0164 C 5.13 4.9668 4.5576 5.8308 3.51 5.8308 C 2.43 5.8308 1.782 5.0964 1.782 4.0164 C 1.782 2.958 2.5488 2.1588 3.51 2.1588 C 4.482 2.1588 5.13 2.9472 5.13 4.0164 Z' // 9
];

const svgS = svg.setAttribute.bind(svg);
svgS('xmlns', ns);

const dimWidth = document.getElementById('width');
const dimHeight = document.getElementById('height');
const dimScale = document.getElementById('scale');

const numFormat = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const updateSvgScale = scale => {
    const w = `${numFormat.format(xDimensionMM * horizontalDim * scale)}mm`;
    const h = `${numFormat.format(xDimensionMM * verticalDim * scale)}mm`;
    dimWidth.innerText = w;
    dimHeight.innerText = h;
    dimScale.innerText = `${Math.round(scale * 100)}%`;
    svgS('width', w);
    svgS('height', h);
}
svgS('preserveAspectRatio', 'none');

const eanViewBox = () => svgS('viewBox', '0 0 113 80');
const upcViewBox = () => svgS('viewBox', '2 0 113 80');
upcViewBox();

const createRect = (x, y, width, height, color) => {
    const rect = document.createElementNS(ns, 'rect');
    const rs = rect.setAttribute.bind(rect);
    rs('x', x);
    rs('y', y);
    rs('width', width);
    rs('height', height);
    rs('fill', color);
    return rect;
};

// Create background (white rectangle).
group.appendChild(createRect(0, 0, 115, 80, 'white'));

const createDigit = (digit, x, y) => {
    const digitPath = document.createElementNS(ns, 'path');
    const modifyDigit = digitPath.setAttribute.bind(digitPath);
    modifyDigit('d', digitPaths[digit]);
    modifyDigit('fill', 'black');
    modifyDigit('transform', `translate(${x}, ${y})`)
    return digitPath;
};
const digits = [...Array(13).keys()].map(_ => createDigit(0, 0, 0));

const transformDigit = (i: number, x, y, s) => {
    digits[i].setAttribute('transform', `translate(${x}, ${y}) scale(${s})`);
};
const setDigitValue = (i: number, v: number) => {
    digits[i].setAttribute('d', digitPaths[v]);
}

// Show or hide digits by adding or removing them from the dom.
const hideDigit = (i: number) => digits[i].remove();
const showDigit = (i: number) => group.contains(digits[i]) ? null : group.appendChild(digits[i]);

const symbolStart = (index) => {
    // offset by quiet space, left guard, prior digits
    let offset = 11 + 3 + (index * 7);
    // add middle guard width for upper six digits
    if (index > 5) offset += 5;
    return offset;
}

const symbolHeight = 69;
const displayEan13Digits = barcode => {
    transformDigit(0, 3, symbolHeight, 1);
    setDigitValue(0, barcode[0]);
    showDigit(0);
    for (let i = 1; i < 13; i++) {
        transformDigit(i, symbolStart(i - 1), symbolHeight, 1);
        setDigitValue(i, barcode[i]);
        showDigit(i);
    }
};

const displayUpcaOrPartial = barcode => {
    if (barcode.length > 0) {
        transformDigit(0, 5, symbolHeight + 4.714, 0.571);
        showDigit(0);
    } else {
        hideDigit(0);
    }
    for (let i = 0; i < 12; i++) {
        if (i < barcode.length) {
            if (i === 0) {
                transformDigit(i, 5, symbolHeight + 4.714, 0.571);
            } else if (i === 11) {
                transformDigit(i, 107, symbolHeight + 4.714, 0.571);
            } else {
                transformDigit(i, symbolStart(i), symbolHeight, 1);
            }
            setDigitValue(i, barcode[i]);
            showDigit(i);
        } else {
            hideDigit(i);
        }
    }
    hideDigit(12);
};

const listen = (id: string, t: string, cb) => document.getElementById(id).addEventListener(t, cb);

const bcI: HTMLInputElement = <HTMLInputElement> document.getElementById('bc');
bcI.focus();

const bcS: HTMLInputElement = <HTMLInputElement> document.getElementById('bc-size');
updateSvgScale(bcS.value);

listen('bc-size', 'input', e => {
    updateSvgScale(parseFloat(e.target.value));
});

const download = () => {
    const blob = new Blob(['<?xml version="1.0" encoding="utf-8"?>', document.getElementById("barcode").innerHTML], );
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = `barcode-${bcI.value}.svg`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
};

const dlButton: HTMLButtonElement = <HTMLButtonElement> document.getElementById('btn-download');
listen('btn-download', 'click', download);

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

const rects = [...Array(24).keys()].map(i => createRect(symbolStart(i / 2),0, 0, 69, 'black'));
// left guard bar
group.appendChild(createRect(11, 0, 1, 74, 'black'));
group.appendChild(createRect(13, 0, 1, 74, 'black'));
// middle guard
group.appendChild(createRect(57, 0, 1, 74, 'black'));
group.appendChild(createRect(59, 0, 1, 74, 'black'));
// right guard bar
group.appendChild(createRect(103, 0, 1, 74, 'black'));
group.appendChild(createRect(105, 0, 1, 74, 'black'));

enum Encoding {
    A, B, C
}

const useEncoding = (index, special) => {
    if (index > 5) {
        return Encoding.C;
    } else {
        return characterSets[special][index] ? Encoding.B : Encoding.A;
    }
};

const updateSymbolBars = (index, x1, width1, x2, width2) => {
    const bars = getBars(index);
    bars.setA('x', x1);
    bars.setA('width', width1);
    bars.setB('x', x2);
    bars.setB('width', width2);
};

const setDigit = (index, value, special) => {
    const encoded = encoding[value].slice();
    const startX: number = symbolStart(index);
    const uE = useEncoding(index, special);
    // bar widths for numbers 1,2,7,8 are adjusted, see: "5.2.3.1 Nominal dimensions of characters"
    let barWidthAdjust: number = 0.0;
    if ([1, 2].includes(parseInt(value))) {
        if (uE === Encoding.A) {
            barWidthAdjust = 0.077;
        } else {
            barWidthAdjust = -0.077;
        }
    } else if ([7, 8].includes(parseInt(value))) {
        if (uE === Encoding.A) {
            barWidthAdjust = -0.077;
        } else {
            barWidthAdjust = 0.077;
        }
    }
    // update symbol bars
    switch (uE) {
        case Encoding.B:
            encoded.reverse();
            // intentional fallthrough to A case
        case Encoding.A:
            updateSymbolBars(index,
              startX + encoded[0],
              encoded[1] + barWidthAdjust,
              startX + encoded[0] + encoded[1] + encoded[2],
              encoded[3] + barWidthAdjust);
            break;
        case Encoding.C:
            updateSymbolBars(index,
              startX,
              encoded[0] + barWidthAdjust,
              startX + encoded[0] + encoded[1],
              encoded[2] + barWidthAdjust);
            break;
    }

};

type AttributeSetter = (key: string, val: object) => void;

const getBars = function (index): { a: Element, b: Element, setA: AttributeSetter, setB: AttributeSetter} {
    const aIndex = index * 2,
      bIndex = aIndex + 1,
      a = rects[aIndex],
      b = rects[bIndex];
    return {a, b, setA: a.setAttribute.bind(a), setB: b.setAttribute.bind(b)};
}

const hideBars = index => {
    const bars = getBars(index);
    bars.a.remove();
    bars.b.remove();
};

const showBars = index => {
    const bars = getBars(index);
    if (!group.contains(bars.a)) {
        group.appendChild(bars.a);
        group.appendChild(bars.b);
    }
}

const setDigitHeight = (index, height) => {
    const bars = getBars(index);
    bars.setA('height', height);
    bars.setB('height', height);
};

/**
 * Trim to max of 13 characters and remove non-digits.
 * @param input
 */
const filterInput = input => {
    return input.replace(/\D/g,'').slice(0, 13);
}

const maxLength = 13;
listen('bc', 'input', e => {
    e.target.value = filterInput(e.target.value);
    const barcode = e.target.value;
    updateBarcode(barcode);
});

const updateBarcode = barcode => {
    let special = 0;
    let digits = barcode.split('').map(Number);
    if (barcode.length === 13) {
        eanViewBox();
        special = digits[0];
        digits = digits.slice(1);
    } else {
        upcViewBox();
    }
    for (const [i, value] of digits.entries()) {
        if (barcode.length < 13 && (i === 0 || i === 11)) {
            setDigitHeight(i, 74);
        } else {
            setDigitHeight(i, 69);
        }
        showBars(i);
        setDigit(i, value, special);
    }
    for (let i = digits.length; i < 12; i++) {
        hideBars(i);
    }
    // Display human readable characters
    if (barcode.length === maxLength) {
        displayEan13Digits(barcode);
    } else {
        displayUpcaOrPartial(barcode);
    }
    // Enable or disable download button
    if (barcode.length === 13 || barcode.length === 12) {
        dlButton.disabled = false;
    } else {
        dlButton.disabled = true;
    }
};
