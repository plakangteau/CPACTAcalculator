
class SevenSegmentDigit extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    width: 26px;
                    height: 50px;
                }
                svg {
                    width: 100%;
                    height: 100%;
                }
                .segment {
                    fill: #e9e9e9;
                    transition: fill 0.15s ease-in-out;
                }
                .segment.on {
                    fill: #333;
                }
            </style>
            <svg viewBox="0 0 26 50">
                <!-- Segment A -->
                <polygon class="segment a" points="4,4 22,4 18,8 8,8"></polygon>
                <!-- Segment B -->
                <polygon class="segment b" points="22,4 22,25 18,21 18,8"></polygon>
                <!-- Segment C -->
                <polygon class="segment c" points="22,25 22,46 18,42 18,29"></polygon>
                <!-- Segment D -->
                <polygon class="segment d" points="4,46 22,46 18,42 8,42"></polygon>
                <!-- Segment E -->
                <polygon class="segment e" points="4,25 4,46 8,42 8,29"></polygon>
                <!-- Segment F -->
                <polygon class="segment f" points="4,4 4,25 8,21 8,8"></polygon>
                <!-- Segment G -->
                <polygon class="segment g" points="4,25 22,25 18,29 8,29"></polygon>
                <!-- Decimal Point -->
                <circle class="segment decimal" cx="24" cy="48" r="2"></circle>
            </svg>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.segments = {
            a: this.shadowRoot.querySelector('.a'),
            b: this.shadowRoot.querySelector('.b'),
            c: this.shadowRoot.querySelector('.c'),
            d: this.shadowRoot.querySelector('.d'),
            e: this.shadowRoot.querySelector('.e'),
            f: this.shadowRoot.querySelector('.f'),
            g: this.shadowRoot.querySelector('.g'),
            decimal: this.shadowRoot.querySelector('.decimal'),
        };

        this.digitMap = {
            ' ': [],
            '0': ['a', 'b', 'c', 'd', 'e', 'f'],
            '1': ['b', 'c'],
            '2': ['a', 'b', 'g', 'e', 'd'],
            '3': ['a', 'b', 'g', 'c', 'd'],
            '4': ['f', 'g', 'b', 'c'],
            '5': ['a', 'f', 'g', 'c', 'd'],
            '6': ['a', 'f', 'g', 'e', 'c', 'd'],
            '7': ['a', 'b', 'c'],
            '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
            '9': ['a', 'b', 'c', 'd', 'f', 'g'],
            '-': ['g'],
            'E': ['a', 'f', 'g', 'e', 'd'],
            'r': ['e', 'g'],
            'o': ['c', 'd', 'e', 'g'],
            '.': ['decimal'],
        };
    }

    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value') {
            this.render(newValue);
        }
    }

    render(value) {
        // Turn all segments off first
        for (const segment in this.segments) {
            this.segments[segment].classList.remove('on');
        }

        // Handle composite values like "8."
        if (typeof value === 'string') {
             if (value.includes('.')) {
                this.segments.decimal.classList.add('on');
                value = value.replace('.', '');
            }
        }
       
        // Turn on the correct segments
        const segmentsOn = this.digitMap[value] || [];
        segmentsOn.forEach(segmentKey => {
            if (this.segments[segmentKey]) {
                this.segments[segmentKey].classList.add('on');
            }
        });
    }
}

customElements.define('seven-segment-digit', SevenSegmentDigit);
