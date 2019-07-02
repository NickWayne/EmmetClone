import { Element } from './element';

export class ElementGroup {
    elements: Element[] = [];

    addElement(element: Element): void {
        this.elements.push(element);
    }

    renderElements(): string[] {
        const lst = [];
        this.elements.forEach(el => {
            lst.push(el.render());
        });
        return lst;
    }
}
