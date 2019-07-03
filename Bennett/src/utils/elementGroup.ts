import { Element } from './element';

export class ElementGroup {
    elements: Element[] = [];

    addElement(element: Element): void {
        this.elements.push(element);
    }

    renderElements(): string {
        let result = '';
        this.elements.forEach(el => {
            result += el.render();
        });
        return result;
    }
}
