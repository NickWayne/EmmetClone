# EmmetClone (Bennett)
I have used Emmet fairly often while writing HTML in VS code and I wanted to challenege myself to recreate it.
I also wanted to improve on some functionality, add some new features, and have a live rendering process.
I have completed the project for now.
[Emmet Documentation](https://emmet.io/)

---
## Features
- Child ( > )
- Sibling ( + )
- Parent ( ^ )
- Multiplication ( * )
- Item Numbering ( $ )
  - reverse numbering ( @-; )
  - starting number ( @NUMBER;)
- ID ( #ID )
- Class ( .CLASS )
- Custom Attributes ( ["prop"="value" hidden] )
  - everything in the brackets is added as properties verbatim
- Text ( {} )
  - Everything inside the curly braces is inserted into the innerHTML
- Angular
  - One Way In ( & )
  - One Way In ( _ )
  - Two Way ( | )
- Aliases
  - Defined in [JSON file](Bennett/src/assets/templates.json)
  - JSON format
    - "snippet pattern": {} (spaces work)
    - Inside attributes:
      - properties: string[]
      - selfClosing: boolean
      - classes: string[]
      - oneWayIns: string[]
      - oneWayOuts: string[]
      - twoWays: string[]
      - id: string

## Examples