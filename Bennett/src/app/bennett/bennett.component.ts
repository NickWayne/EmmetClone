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

  textInput = 'p>span>li*3^p^p';
  textOutput = '';
  stackCharacters = '+>^';
  specialCharacters = [
    '{',
    '.',
    '#',
    '*'
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
    console.clear();
    this.splitString(event);
    this.textOutput = this.outputElements();
  }

  rankStackCharacters(textInput: string): Rank[] {
    const rank = [];
    this.specialCharacters.forEach(charSet => {
      for (let i = 0; i < charSet.length; i++) {
        const char = charSet.charAt(i);
        const pos = textInput.indexOf(char);
        if (pos > -1) {
          rank.push({char, pos});
        }
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
    let rank = this.rankStackCharacters(str);
    if (rank.length > 0) {
      result.name = str.slice(0, rank[0].pos);
      str = str.slice(rank[0].pos, str.length);
    } else {
      result.name = str ;
      return result;
    }
    while (str !== '') {
      rank = this.rankStackCharacters(str);
      if (rank.length > 1) {
          if (rank[0].char === '{') {
            result.text = str.slice(1, str.indexOf('}'));
          } else if (rank[0].char === '.') {
            result.classes.push(str.slice(1, rank[1].pos));
          } else if (rank[0].char === '*') {
            result.multiplier = +str.slice(1, rank[1].pos);
          } else {
            result.id = str.slice(1, rank[1].pos);
          }
          str = str.slice(rank[1].pos, str.length);
      } else {
        if (rank[0].char === '{' && str.includes('}')) { // Might need to remove
          result.text = str.slice(1, str.length - 1);
        } else if (rank[0].char === '.') {
          result.classes.push(str.slice(1, str.length));
        } else if (rank[0].char === '*') {
          result.multiplier = +str.slice(1, str.length);
        } else {
          result.id = str.slice(1, str.length);
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
        // Add error checking
        this.lastElement.childElements = new ElementGroup();
        this.currentElementGroup = this.lastElement.childElements;
        this.nestingLevel++;
      } else if (el === '^') {
        // console.clear();
        console.group('^');
        console.log('CurrElementGroup Before:', this.currentElementGroup);
        if (this.nestingLevel > 0) {
          this.currentElementGroup = this.lastElement.parentGroup;
          this.nestingLevel--;
        }
        console.log('CurrElementGroup after', this.currentElementGroup);
        // console.log('struct', this.struct);
        console.groupEnd();
      } else if (el !== '+' && el !== '') {
        let newElement = null;
        console.group(el);
        console.log('lastElement Before:', this.lastElement);
        if (this.lastElement !== null) {
          newElement = this.constructElement(el, this.lastElement.parentGroup);
        } else {
          newElement = this.constructElement(el, this.struct);
        }
        this.currentElementGroup.addElement(newElement);
        this.lastElement = newElement;
        console.log('lastElement After:', this.lastElement);
        console.groupEnd();
      }
    });

  }

  constructElement(el: string, parentGroup: ElementGroup): Element {
    const properties = this.splitAndAssignProperties(el);
    const addElement = new Element(properties.name);
    addElement.parentGroup = parentGroup;
    addElement.nestingLevel = this.nestingLevel;
    addElement.addProperties(properties);
    return addElement;
  }

  outputElements(): string {
    return this.struct.renderElements();
  }

}
