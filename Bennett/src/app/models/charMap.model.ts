import { ElementGroup } from 'src/utils/elementGroup';
import { Element } from 'src/utils/element';

export interface CharMap {
    name?: string;
    id?: string;
    classes?: string[];
    text?: string;
    multiplier?: number;
    parent?: Element;
    subElements?: ElementGroup;
    oneWayIns?: string[];
    oneWayOuts?: string[];
    twoWays?: string[];
    properties?: string;
    selfClosing?: boolean;
}
