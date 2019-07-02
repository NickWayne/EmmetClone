export class Element {

    constructor(
        public name: string,
        public text?: string
    ) {}

    render(): string {
        return `<${this.name}>${this.text}</${this.name}>`;
    }
}
