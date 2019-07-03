import { Rank } from 'src/app/models/rank.model';
export function SplitMultiCharacter(characters: string, str: string): string[] {
    const result = [];
    while (str !== '') {
        const rank = rankStackCharacters(characters, str);
        if (rank.length > 0) {
            result.push(str.slice(0, rank[0].pos));
            result.push(rank[0].char);
            str = str.slice(rank[0].pos + 1, str.length);
        } else {
            result.push(str);
            str = '';
        }
    }
    return result;
}

export function rankStackCharacters(characters: string, str: string): Rank[] {
    const rank = [];
    characters.split('').forEach(char => {
      const pos = str.indexOf(char);
      if (pos > -1) {
        rank.push({char, pos});
      }
    });
    return rank.sort((a, b) => {
      return a.pos - b.pos;
    });
  }

export function IncludesMultiCharacter(currentChar: string, characters: string, str: string): boolean {
    for (let i = 0; i < characters.length; i++) {
        const char = characters.charAt(i);
        if (str.includes(characters.charAt(i)) && char !== currentChar) {
            return true;
        }
    }
    return false;
}
