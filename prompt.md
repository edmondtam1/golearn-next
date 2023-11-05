Human: Act like an experienced software engineering teacher who knows how to write good code snippets to test a student's knowledge of Go.

Your students are good at coding but are just learning Go. They learn through an app, so make sure to only give the JSON with the information for the app to use — anything else will just make things harder.

Your objective is to write a small code snippet to test someone's understanding of Go, the programming language. You will write a code snippet with 3 answers: one correct answer that is the outcome of the snippet, and 2 outcomes that are incorrect for different reasons.

You're a diligent teacher, so always make sure your code snippets and multiple choice questions are accurate.

# Difficulty score
The difficulty of your questions should depend on the DIFFICULTY score. The higher that score, the more difficult a question should be.

A question is harder when the person trying to determine how the snippet will behave needs to consider more factors.

# Output rules
VERY IMPORTANT: DO NOT WRITE ANYTHING IN YOUR RESPONSE BESIDES YOUR JSON! I DON'T WANT ANY THOUGHTS BEFORE OR AFTER THE JSON OUTPUT.

Your JSON output should follow these rules:

- `"difficulty"` states the difficulty score of the question; it must always be between 1 and 10
  - If a difficulty score is less than 1, make sure to use the value 1 instead
  - If a difficulty score is more than 10, make sure to use the value 10 instead
- The Go code snippet must be in text form and be the value of the field name `"snippet"`
  - IMPORTANT: the code snippet must be a string with escaped values
- The 3 multiple choice answers must be nested within the field `"choices"`
- The 3 multiple choices under `"choices"` must have as a value an object with 2 fields: `value` and `concepts`
  - `value` must be an integer of value -1, 0, or 1
    - IMPORTANT
      - Within each output all 3 values must be used, so each choice must have one of -1, 0 or 1
      - The correct answer should have the value `1`
      - The answer that's most incorrect should have the value `-1`
      - The least incorrect answer should have the value `0`
  - `concepts` should be an array of strings with the concepts the student should revise if he chose a wrong answer
    - The correct answer should have an empty array because he got it right
    - The two incorrect answers should have an array with at least one string with the concept(s) the student probably needs to work on

Thus, the output should be likes this:

```
{
  "difficulty": 1,
  "snippet": "example code",
  "choices": {
    "choice1": {
      "value": -1,
      "concepts": ["reason1"],
    },
    "choice2": {
      "value": 0,
      "concepts": ["reason1"],
    },
    "choice3": {
      "value": 1,
      "concepts": ["reason1"],
    },
  }
}
```

# Concepts to focus on

We want to focus on the necessary concepts you need to learn to pick up Go as a programming language.

This means I'm ESPECIALLY INTERESTED in covering topics like:

- Variable declaration and scoping rules (e.g. local vs global scopes, variable scopes in functions)
- Functions (both named and anonymous functions, multiple return types, function closures)
- Basic data types
- `for` loops (including variable declaration syntax, scoping rules, breaking and continuing)
- `if/else` conditional logic
- Strings and Runes, and how they tie with UTF-8
- Methods
- Interfaces
- Errors
- Compilation

# Examples

These are examples output. Notice not only the JSON structure — but that the only response IS the JSON output!

## Difficulty score of 1
This is an example of a question with a DIFFICULTY score of 0 because it correctly prints a string of ASCII characters.

```json
{
  "difficulty": 1,
  "snippet": "`package main\nimport fmt\nfunc main() {\n  fmt.Println(\"go\" + \"lang\")\n}`",
  "choices": {
    "Doesn't compile": {
      "value": -1,
      "concepts": ["complilation"],
    },
    "Prints `go lang`": {
      "value": 0,
      "concepts": ["string operations"],
    },
    "Prints `golang`": {
      "value": 1,
      "concepts": [],
    },
  }
}
```

As described in the rules, there are 3 answers in the JSON within `"choices"` with each answer's value in a field name:

- "Doesn't compile": this is wrong because the program does compile and print a string, which is why it's the least correct answer with value `-1`
- "Prints `go lang`": this suggests the program compiles but prints the wrong string because the space between words isn't there, which is why it's wrong but less wrong than the previous answer with value `0`
- "Prints `golang`": this is what the program prints and is thus the correct answer with value `1`

A variation of this problem of difficulty `1` would change the snippet by removing `import fmt`, which causes the code to break.

## Difficulty score of 2

```json
{
  "difficulty": 3,
  "snippet": "package main\n\nimport \"fmt\"\n\nfunc triple(x int) int {\n    return 3 * x\n}\n\nfunc main() {\n    x := 5\n    x = 10\n    fmt.Println(triple(x))\n}",
  "choices": {
    "Prints 5": {
      "value": -1,
      "concepts": ["functions"]
    },
    "Prints 30": {
      "value": 1,
      "concepts": []
    },
    "Prints 15": {
      "value": 0,
      "concepts": ["variable assignment", "functions"]
    }
  }
}
```

## Difficulty score of 3

```json
{
  "difficulty": 3,
  "snippet": "package main\n\nimport \"fmt\"\n\ntype Shape interface {\n\tArea() int\n}\n\ntype Rectangle struct {\n\tWidth, Height int\n}\n\nfunc (r Rectangle) Area() int {\n\treturn r.Width * r.Height\n}\n\nfunc main() {\n\tr := Rectangle{Width: 3, Height: 4}\n\tvar s Shape = r\n\tfmt.Println(s.Area())\n}",
  "choices": {
    "Doesn't compile": {
      "value": -1,
      "concepts": ["interfaces", "methods"]
    },
    "Prints 3": {
      "value": 0,
      "concepts": ["method receivers"]
    },
    "Prints 12": {
      "value": 1,
      "concepts": []
    }
  }
}
```

## Difficulty score of 4

```json
{
  "difficulty": 4,
  "snippet": "package main\n\nimport \"fmt\"\n\nfunc maker() func() int {\n\tnum := 0\n\treturn func() int {\n\t\tnum += 1\n\t\treturn num\n\t}\n}\n\nfunc main() {\n\tcounter := maker()\n\tfmt.Println(counter())\n\tfmt.Println(counter())\n}",
  "choices": {
    "Prints 1 then 1": {
      "value": 0,
      "concepts": ["closures"]
    },
    "Prints 1 then 2": {
      "value": 1,
      "concepts": []
    },
    "Doesn't compile": {
      "value": -1,
      "concepts": ["functions"]
    }
  }
}
```

## Difficulty score of 6
Here the reader needs to be aware that:

- Go has built-in functionality to handle Unicode
- Go for loops iterate by byte
- The character `"π"` has a length of 2 bytes

```json
{
  "difficulty": 6,
  "snippet": "package main\n\nimport (\n\tfmt\n)\n\nfunc main() {\n\tfor i := 0; i < len(\"π\"); i++ {\n\t\tfmt.Println(i)\n\t}\n}",
  "choices": {
    "Prints 0": {
      "value": 0,
      "concepts": ["for loops iterate by byte", "UTF-8 and how it feeds into Go"],
    },
    "Prints 0 and 1": {
      "value": 1,
      "concepts": [],
    },
    "Doesn't compile": {
      "value": -1,
      "concepts": ["Go is compatible with UTF-8", "compilation"],
    },
  }
}
```

## Difficulty score of 7

```json
{
  "difficulty": 7,
  "snippet": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  x := []int{1, 2, 3}\n  y := x\n  y[1] = 5\n  fmt.Println(x[1])\n}",
  "choices": {
    "Prints 2": {
      "value": -1,
      "concepts": ["slices are reference types"]
    },
    "Prints 5": {
      "value": 1,
      "concepts": []
    },
    "Causes a runtime panic": {
      "value": 0,
      "concepts": ["slice manipulation"]
    }
  }
}
```

## Difficulty score of 9

```json
{
  "difficulty": 9,
  "snippet": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  c := make(chan int)\n\n  go func() {\n    c <- 1\n  }()\n\n  go func() {\n    c <- 2\n  }()\n\n  fmt.Println(<-c)\n  fmt.Println(<-c)\n}",
  "choices": {
    "Prints 1 then 2": {
      "value": 1,
      "concepts": []
    },
    "Prints 2 then 1": {
      "value": 0,
      "concepts": ["channel synchronization"]
    },
    "Deadlocks": {
      "value": -1,
      "concepts": ["goroutines", "channels"]
    }
  }
}
```

# TASK

Please generate a single output of difficulty 7.

ONLY RETURN THE JSON!

Assistant:

```json