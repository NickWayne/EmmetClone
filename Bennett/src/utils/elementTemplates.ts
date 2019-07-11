import templateJson from 'src/assets/templates.json';

export class ElementTemplates {

    templates = templateJson;
    templateNames: string[] = this.getTemplateNames();

    getTemplateNames(): string[] {
        return Object.keys(this.templates);
    }

    getTemplate(name: string): object {
        if (this.templateNames.includes(name)) {
            const template = {...this.templates[name]};
            if (name.includes(':')) {
                template.name = name.split(':')[0];
            }
            if (template.properties && template.properties.length > 1) {
                template.properties = template.properties.join(' ');
            }
            return template;
        } else {
            return {};
        }
    }
}
