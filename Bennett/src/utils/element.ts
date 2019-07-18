import { CharMap } from 'src/app/models/charMap.model';
import { ElementGroup } from './elementGroup';
import { ElementTemplates } from './elementTemplates';
export class Element {

    elementTemplates = new ElementTemplates();

    constructor(
        public name: string,
        public inputProperties: CharMap,
        public parent: Element = null,
        public parentGroup: ElementGroup = null,
        public childElements: ElementGroup = null,
        public text = '',
        public classes = [],
        public oneWayIns = [],
        public oneWayOuts = [],
        public twoWays = [],
        public id = '',
        public multiplier = 1,
        public nestingLevel = 0,
        public startNumber = 1,
        public order = true,
        public properties = '',
        public selfClosing = false
    ) {
        this.addProperties(this.inputProperties);
        this.addProperties(this.elementTemplates.getTemplate(this.name));
    }

    mapAttribute(mapItem: string[], splitChar: string): string[] {
        let arr = [];
        mapItem.forEach(el => {
            arr = arr.concat(el.split(splitChar));
        });
        return arr;
    }

    addProperties(map: CharMap) {
        this.name = map.name ? map.name : this.name;
        this.text = map.text ? map.text : this.text;
        this.classes = map.classes ? map.classes : this.classes.concat(this.mapAttribute(map.classes, '.'));
        this.oneWayIns = map.oneWayIns ? map.oneWayIns : this.oneWayIns.concat(this.mapAttribute(map.oneWayIns, '&'));
        this.oneWayOuts = map.oneWayOuts ? map.oneWayOuts : this.oneWayOuts.concat(this.mapAttribute(map.oneWayOuts, '_'));
        this.twoWays = map.twoWays ? map.twoWays : this.twoWays.concat(this.mapAttribute(map.twoWays, '|'));
        this.properties = map.properties ? map.properties : this.properties;
        this.id = map.id ? map.id : this.id;
        this.text = map.text ? map.text : this.text;
        this.multiplier = map.multiplier ? map.multiplier : this.multiplier;
        this.parent = map.parent ? map.parent : map.parent;
        this.childElements = map.subElements ? map.subElements : this.childElements;
        this.selfClosing = map.selfClosing ? map.selfClosing : this.selfClosing;
    }

    render(): string {
        let str = '\t'.repeat(this.nestingLevel) + `<${this.name}`;
        if (this.id !== '') {
            str += ` id='${this.id}'`;
        }
        if (this.classes.length > 0) {
            str += ' class=\'';
            this.classes.forEach(cl => {
                str += `${cl} `;
            });
            str = str.slice(0, str.length - 1) + '\'';
        }
        if (this.oneWayIns.length > 0) {
            str += ' ';
            this.oneWayIns.forEach(cl => {
                str += `(${cl})='' `;
            });
            str = str.slice(0, str.length - 1);
        }
        if (this.oneWayOuts.length > 0) {
            str += ' ';
            this.oneWayOuts.forEach(cl => {
                str += `[${cl}]='' `;
            });
            str = str.slice(0, str.length - 1);
        }
        if (this.twoWays.length > 0) {
            str += ' ';
            this.twoWays.forEach(cl => {
                str += `[(${cl})]='' `;
            });
            str = str.slice(0, str.length - 1);
        }
        if (this.properties !== '') {
            str += ` ${this.properties}`;
        }
        if (this.selfClosing) {
            str += ` />\n`;
        } else {
            if (this.childElements !== null) {
                str += `>${this.text !== '' ? '\n' + '\t'.repeat(this.nestingLevel + 1) + this.text : this.text}\n`;
                str += this.childElements.renderElements();
                str += '\t'.repeat(this.nestingLevel) + `</${this.name}>\n`;
            } else {
                str += `>${this.text}</${this.name}>\n`;
            }
        }
        return this.repeatString(str);
    }

    parseLoopModifier(str: string) {
        this.order = !str.includes('-');
        if (this.order) {
            this.startNumber = +str.slice();
        } else {
            this.startNumber = +str.slice(1);
        }
    }

    splitDollars(str: string) {
        const lst = [];
        let stringBuilder = '';
        let dollarToggle = false;
        while (str !== '') {
            if (dollarToggle) {
                if (str[0] === '@') {
                    this.parseLoopModifier(str.slice(str.indexOf('@') + 1, str.indexOf(';')));
                    lst.push(stringBuilder);
                    stringBuilder = '';
                    str = str.slice(str.indexOf(';') + 1);
                    dollarToggle = false;
                } else if (str[0] !== '$') {
                    dollarToggle = false;
                    lst.push(stringBuilder);
                    stringBuilder = '';
                }
                stringBuilder += str[0];
            } else {
                if (str[0] === '$') {
                    dollarToggle = true;
                    lst.push(stringBuilder);
                    stringBuilder = '';
                }
                stringBuilder += str[0];
            }
            if (str.length === 1) {
                lst.push(stringBuilder);
                str = '';
            } else {
                str = str.slice(1);
            }
        }
        return lst;
    }

    formatDollars(str: string[], num: string): string {
        let stringBuilder = '';
        str.forEach(el => {
            if (el.startsWith('$')) {
                stringBuilder += num.padStart(el.length, '0');
            } else {
                stringBuilder += el;
            }
        });
        return stringBuilder;
    }

    repeatString(str: string): string {
        const dollarList = this.splitDollars(str);
        let stringBuilder = '';
        if (this.multiplier > 1) {
            if (this.order) {
                for (let i = this.startNumber; i <= this.multiplier + this.startNumber - 1; i++) {
                    stringBuilder += this.formatDollars(dollarList, i.toString());
                }
            } else {
                for (let i = this.multiplier + this.startNumber - 1; i >= this.startNumber; i--) {
                    stringBuilder += this.formatDollars(dollarList, i.toString());
                }
            }
        } else {
            stringBuilder += this.formatDollars(dollarList, '1');
        }
        return stringBuilder;
    }
}
