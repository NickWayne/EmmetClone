import { Component, OnInit } from '@angular/core';
import { Stack } from '../../utils/stack';
import { Element } from '../../utils/element';
import { ElementGroup } from 'src/utils/elementGroup';
import { Rank } from '../models/rank.model';

@Component({
  selector: 'app-bennett',
  templateUrl: './bennett.component.html',
  styleUrls: ['./bennett.component.css']
})
export class BennettComponent implements OnInit {

  textInput: string;
  textOutput: string;
  stackCharacters = '+>^';
  struct: Stack<ElementGroup>;
  parseInput(event: string) {
    this.struct = this.splitString(event);
    this.textOutput = this.outputStack();
  }

  rankStackCharacters(textInput: string): Rank[] {
    const rank = [];
    for (let i = 0; i < this.stackCharacters.length; i++) {
      const char = this.stackCharacters.charAt(i);
      const pos = this.stackCharacters.indexOf(char);
      if (pos > -1 && this.textInput.includes(char)) {
        rank.push({char, pos});
      }
    }
    return rank.sort((a, b) => {
      return a.pos - b.pos;
    });
  }

  splitString(textInput: string): Stack<ElementGroup> {
    const stack = new Stack<ElementGroup>();
    const elGroup = new ElementGroup();
    console.clear();
    while (textInput !== '') {
      const ranks = this.rankStackCharacters(textInput);
      console.log(ranks);
      if (ranks.length > 0) {
        elGroup.addElement(new Element(textInput.slice(0, ranks[0].pos)));
        textInput = textInput.slice(ranks[0].pos + 1, textInput.length);
      } else {
        elGroup.addElement(new Element(textInput, 'test'));
        textInput = '';
      }
    }
    stack.push(elGroup); // temporary
    return stack;
  }

  outputStack(): string {
    const out = [];
    let outStr = '';
    while (!this.struct.isEmpty()) {
      const elementGroup = this.struct.pop();
      out.concat(elementGroup.renderElements());
    }
    out.forEach(el => {
      outStr += el + '\n';
    });
    return outStr.slice(0, outStr.length - 2);
  }

  ngOnInit() {
  }

}
