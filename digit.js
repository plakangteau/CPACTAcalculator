class SevenSegmentDigit extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                    width: 28px;
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
            <svg viewBox="0 0 28 50" preserveAspectRatio="xMidYMid meet">
                <!-- Segments for the digit -->
                <rect class="segment a" x="4"  y="2"  width="18" height="5" rx="1"></rect>
                <rect class="segment f" x="1"  y="5"  width="5"  height="19" rx="1"></rect>
                <rect class="segment b" x="20" y="5"  width="5"  height="19" rx="1"></rect>
                <rect class="segment g" x="4"  y="22" width="18" height="5" rx="1"></rect>
                <rect class="segment e" x="1"  y="26" width="5"  height="19" rx="1"></rect>
                <rect class="segment c" x="20" y="26" width="5"  height="19" rx="1"></rect>
                <rect class="segment d" x="4"  y="43" width="18" height="5" rx="1"></rect>
                
                <!-- Decimal point (bottom right) -->
                <circle class="segment decimal" cx="26" cy="46" r="2"></circle>
                
                <!-- Comma (top right) -->
                <rect class="segment comma" x="26" y="5" width="2" height="10" rx="1"></rect>
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
            comma: this.shadowRoot.querySelector('.comma'),
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
        Object.values(this.segments).forEach(segment => segment.classList.remove('on'));
        
        if (!value) return;

        // The primary character for the digit shape
        const digitChar = value.charAt(0);
        
        // Turn on the segments for the digit
        const digitSegmentsOn = this.digitMap[digitChar] || [];
        digitSegmentsOn.forEach(segmentKey => {
            if (this.segments[segmentKey]) {
                this.segments[segmentKey].classList.add('on');
            }
        });

        // Check for and turn on comma or decimal
        if (value.includes('.')) {
            this.segments.decimal.classList.add('on');
        }
        if (value.includes(',')) {
            this.segments.comma.classList.add('on');
        }
    }
}

customElements.define('seven-segment-digit', SevenSegmentDigit);
