import { Component } from '@angular/core';
import { Element } from 'src/utils/element';
import { ElementGroup } from 'src/utils/elementGroup';
import { SplitMultiCharacter } from 'src/utils/utilFunctions';
import { Rank } from '../models/rank.model';
import { CharMap } from '../models/charMap.model';

@Component({
  selector: 'app-bennett',
  templateUrl: './bennett.component.html',
  styleUrls: ['./bennett.component.css']
})
export class BennettComponent {

  textInput = 'a:mai';
  textOutput = '';
  renderHTML = false;
  stackCharacters = '+>^';
  propertyModifiers = [
    '{', // Text (close with '}')
    '.', // Classes
    '#', // Id
    '*', // Multiplier
    '&', // Angular Oneway binding in
    '_', // Angular Oneway binding out
    '|', // Angular Twoway binding
    '['  // Custom Attributes (inserts directly, close with ']')
  ];
  struct: ElementGroup = new ElementGroup();
  currentElementGroup: ElementGroup = this.struct;
  lastElement: Element = null;
  nestingLevel = 0;

  parseInput(event: string) {
    this.struct = new ElementGroup();
    this.currentElementGroup = this.struct;
    this.lastElement = null;
    this.nestingLevel = 0;
    this.splitString(event);
    this.textOutput = this.outputElements();
  }

  toggleRenderMode() {
    this.renderHTML = !this.renderHTML;
  }

  rankCharacters(textInput: string): Rank[] {
    const rank = [];
    this.propertyModifiers.forEach(char => {
      const pos = textInput.indexOf(char);
      if (pos > -1) {
        rank.push({char, pos});
      }
    });
    return rank.sort((a, b) => {
      return a.pos - b.pos;
    });
  }

  splitAndAssignProperties(str: string): CharMap {
    const result: CharMap = {};
    if (str.includes('.')) {
      result.classes = [];
    }
    if (str.includes('&')) {
      result.oneWayIns = [];
    }
    if (str.includes('_')) {
      result.oneWayOuts = [];
    }
    if (str.includes('|')) {
      result.twoWays = [];
    }
    let rank = this.rankCharacters(str);
    if (rank.length > 0) {
      result.name = str.slice(0, rank[0].pos);
      str = str.slice(rank[0].pos, str.length);
    } else {
      result.name = str ;
      return result;
    }
    while (str !== '') {
      rank = this.rankCharacters(str);
      if (rank.length > 1) {
          if (rank[0].char === '{') {
            result.text = str.slice(1, str.indexOf('}'));
          } else if (rank[0].char === '[') {
            result.properties = str.slice(1, str.indexOf(']'));
          } else if (rank[0].char === '.') {
            result.classes.push(str.slice(1, rank[1].pos));
          } else if (rank[0].char === '*') {
            result.multiplier = +str.slice(1, rank[1].pos);
          } else if (rank[0].char === '&') {
            result.oneWayIns.push(str.slice(1, rank[1].pos));
          } else if (rank[0].char === '_') {
            result.oneWayOuts.push(str.slice(1, rank[1].pos));
          } else if (rank[0].char === '|') {
            result.twoWays.push(str.slice(1, rank[1].pos));
          } else {
            result.id = str.slice(1, rank[1].pos);
          }
          str = str.slice(rank[1].pos, str.length);
      } else {
        if (rank[0].char === '{' && str.includes('}')) { // Might need to remove
          result.text = str.slice(1, str.length - 1);
        }  else if (rank[0].char === '[') {
          result.properties = str.slice(1, str.length - 1);
        } else if (rank[0].char === '.') {
          result.classes.push(str.slice(1));
        } else if (rank[0].char === '*') {
          result.multiplier = +str.slice(1);
        } else if (rank[0].char === '&') {
          result.oneWayIns.push(str.slice(1));
        } else if (rank[0].char === '_') {
          result.oneWayOuts.push(str.slice(1));
        } else if (rank[0].char === '|') {
          result.twoWays.push(str.slice(1));
        } else {
          result.id = str.slice(1);
        }
        str = '';
      }
    }
    return result;
  }

  splitString(textInput: string) {
    const elementList = SplitMultiCharacter(this.stackCharacters, textInput);
    elementList.forEach(el => {
      if (el === '>') {
        this.lastElement.childElements = new ElementGroup(this.lastElement);
        this.currentElementGroup = this.lastElement.childElements;
        this.nestingLevel++;
      } else if (el === '^') {
        if (this.nestingLevel > 0) {
          this.currentElementGroup = this.currentElementGroup.parentElement.parentGroup;
          this.nestingLevel--;
        }
      } else if (el !== '+' && el !== '') {
        const newElement = this.constructElement(el);
        this.currentElementGroup.addElement(newElement);
        this.lastElement = newElement;
      }
    });

  }

  constructElement(el: string): Element {
    const properties = this.splitAndAssignProperties(el);
    const addElement = new Element(properties.name, properties);
    addElement.parentGroup = this.currentElementGroup;
    addElement.nestingLevel = this.nestingLevel;
    return addElement;
  }

  outputElements(): string {
    return this.struct.renderElements();
  }

}
