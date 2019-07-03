import { CharMap } from 'src/app/models/charMap.model';
import { ElementGroup } from './elementGroup';
export class Element {

    constructor(
        public name: string,
        public parent: Element = null,
        public parentGroup: ElementGroup = null,
        public childElements: ElementGroup = null,
        public text = '',
        public classes = [],
        public id = '',
        public multiplier = 1,
        public nestingLevel = 0
    ) {}

    addProperties(map: CharMap) {
        if (map.classes) {
            let arr = [];
            map.classes.forEach(cl => {
                arr = arr.concat(cl.split('.'));
            });
            this.classes = arr;
        }
        if (map.id) {
            this.id = map.id;
        }
        if (map.text) {
            this.text = map.text;
        }
        if (map.multiplier) {
            this.multiplier = map.multiplier;
        }
        if (map.parent) {
            this.parent = map.parent;
        }
        if (map.subElements) {
            this.childElements = map.subElements;
        }
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
        if (this.childElements !== null) {

            str += `>${this.text !== '' ? '\n' + '\t'.repeat(this.nestingLevel + 1) + this.text : this.text}\n`;
            str += this.childElements.renderElements();
            str += '\t'.repeat(this.nestingLevel) + `</${this.name}>\n`;
        } else {
            str += `>${this.text}</${this.name}>\n`;
        }
        return str.repeat(this.multiplier);
    }
}
