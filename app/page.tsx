"use client";

import { Message, nanoid } from "ai";
import { useChat, useCompletion } from "ai/react";
import { FormEvent, useEffect, useState } from "react";
// import ReactMarkdown from "react-markdown";
// import prompt from "../prompt.txt";
// import * as prompt from "../prompt.txt";
// const someTextContent = require('./some.txt');

const prompt = `
Human: Act like an experienced software engineering teacher who knows how to write good code snippets to test a student's knowledge of Go.

Your students are good at coding but are just learning Go. They learn through an app, so make sure to only give the JSON with the information for the app to use — anything else will just make things harder.

Your objective is to write a small code snippet to test someone's understanding of Go, the programming language.

You're a diligent teacher, so always make sure your code snippets do what you intend them to do.

# Difficulty score
The difficulty of your questions should depend on the DIFFICULTY score. The higher that score, the more difficult a question should be.

A question is harder when the person trying to determine how the snippet will behave needs to consider more factors.

# Output rules
VERY IMPORTANT: DO NOT WRITE ANYTHING IN YOUR RESPONSE BESIDES YOUR JSON! I DON'T WANT ANY THOUGHTS BEFORE OR AFTER THE JSON OUTPUT.

Your JSON output should follow these rules:

- The Go code snippet must be in text form and be the value of the field name "snippet"
  - IMPORTANT: the code snippet must be a string with escaped values

Thus, the output should be likes this:

<json>
{
  "snippet": "example code",
}
</json>

# Concepts to focus on

We want to focus on the necessary concepts you need to learn to pick up Go as a programming language.

This means I'm ESPECIALLY INTERESTED in covering topics like:

- Variable declaration and scoping rules (e.g. local vs global scopes, variable scopes in functions)
- Functions (both named and anonymous functions, multiple return types, function closures)
- Basic data types
- for loops (including variable declaration syntax, scoping rules, breaking and continuing)
- if/else conditional logic
- Strings and Runes, and how they tie with UTF-8
- Methods
- Interfaces
- Errors
- Compilation

## Focus on the student's hazy concepts

The student might have concepts they might need to work on. If they do, the concepts to work on will be strings in this array: {{ CONCEPTS }}.

If there are strings in that array please try to make the question be relevant to those concepts.

# Examples

These are examples output. Notice not only the JSON structure — but that the only response IS the JSON output!

## Difficulty score of 1
This is an example of a question with a DIFFICULTY score of 0 because it correctly prints a string of ASCII characters.

<json>
{
  "snippet": "package main\nimport fmt\nfunc main() {\n  fmt.Println(\"go\" + \"lang\")\n}",
}
</json>

As described in the rules, there are 3 answers in the JSON within "choices" with each answer's value in a field name:

- "Doesn't compile": this is wrong because the program does compile and print a string, which is why it's the least correct answer with value -1
- "Prints go lang": this suggests the program compiles but prints the wrong string because the space between words isn't there, which is why it's wrong but less wrong than the previous answer with value 0
- "Prints golang": this is what the program prints and is thus the correct answer with value 1

A variation of this problem of difficulty 1 would change the snippet by removing import fmt, which causes the code to break.

## Difficulty score of 2

<json>
{
  "snippet": "package main\n\nimport \"fmt\"\n\nfunc triple(x int) int {\n    return 3 * x\n}\n\nfunc main() {\n    x := 5\n    x = 10\n    fmt.Println(triple(x))\n}",
}
</json>

## Difficulty score of 3

<json>
{
  "snippet": "package main\n\nimport \"fmt\"\n\ntype Shape interface {\n\tArea() int\n}\n\ntype Rectangle struct {\n\tWidth, Height int\n}\n\nfunc (r Rectangle) Area() int {\n\treturn r.Width * r.Height\n}\n\nfunc main() {\n\tr := Rectangle{Width: 3, Height: 4}\n\tvar s Shape = r\n\tfmt.Println(s.Area())\n}",
}
</json>

## Difficulty score of 4

<json>
{
  "snippet": "package main\n\nimport \"fmt\"\n\nfunc maker() func() int {\n\tnum := 0\n\treturn func() int {\n\t\tnum += 1\n\t\treturn num\n\t}\n}\n\nfunc main() {\n\tcounter := maker()\n\tfmt.Println(counter())\n\tfmt.Println(counter())\n}",
}
</json>

## Difficulty score of 6
Here the reader needs to be aware that:

- Go has built-in functionality to handle Unicode
- Go for loops iterate by byte
- The character "π" has a length of 2 bytes

<json>
{
  "snippet": "package main\n\nimport (\n\tfmt\n)\n\nfunc main() {\n\tfor i := 0; i < len(\"π\"); i++ {\n\t\tfmt.Println(i)\n\t}\n}",
}
</json>

## Difficulty score of 7

<json>
{
  "snippet": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  x := []int{1, 2, 3}\n  y := x\n  y[1] = 5\n  fmt.Println(x[1])\n}",
}
</json>

## Difficulty score of 9

<json>
{
  "snippet": "package main\n\nimport \"fmt\"\n\nfunc main() {\n  c := make(chan int)\n\n  go func() {\n    c <- 1\n  }()\n\n  go func() {\n    c <- 2\n  }()\n\n  fmt.Println(<-c)\n  fmt.Println(<-c)\n}",
}
</json>

# TASK

Please generate a single output of difficulty 7.

ONLY RETURN THE JSON!

Assistant:

<json>
`;

const choicesPrompt = `
Human: Act like an experienced software engineering teacher who knows how write good multiple choice questions about a code snippet.

Your students are good at coding but are just learning Go. They learn through an app, so make sure to only give the JSON with the information for the app to use — anything else will just make things harder.

Your objective is to take a code snippet in Go and output 3 multiple choice answers.

You're a diligent teacher, so always make sure your code snippets and multiple choice questions are accurate.

# Input rules

I'll pass you a code snippet you need to interpret and write 3 multiple choice answers: one correct and 2 incorrect.

SNIPPET
{{ SNIPPET }}

# Output rules
VERY IMPORTANT: DO NOT WRITE ANYTHING IN YOUR RESPONSE BESIDES YOUR JSON! I DON'T WANT ANY THOUGHTS BEFORE OR AFTER THE JSON OUTPUT.

Your JSON output should follow these rules:

- The 3 multiple choice answers must be nested within the array value of the field "choices"
- The 3 multiple choices under "choices" must have as a value an object with 2 fields: value and concepts
  - value must be an integer of value -1, 0, or 1
    - IMPORTANT
      - Within each output all 3 values must be used, so each choice must have one of -1, 0 or 1
      - The correct answer should have the value 1
      - The answer that's most incorrect should have the value -1
      - The least incorrect answer should have the value 0
  - concepts should be an array of strings with the concepts the student should revise if he chose a wrong answer
    - The correct answer should have an empty array because he got it right
    - The two incorrect answers should have an array with at least one string with the concept(s) the student probably needs to work on

Thus, the output should be likes this:

<json>
{
  "choices": [
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
  ]
}
</json>

# Concepts to focus on

We want to focus on the necessary concepts you need to learn to pick up Go as a programming language.

This means I'm ESPECIALLY INTERESTED in covering topics like:

- Variable declaration and scoping rules (e.g. local vs global scopes, variable scopes in functions)
- Functions (both named and anonymous functions, multiple return types, function closures)
- Basic data types
- for loops (including variable declaration syntax, scoping rules, breaking and continuing)
- if/else conditional logic
- Strings and Runes, and how they tie with UTF-8
- Methods
- Interfaces
- Errors
- Compilation

## Focus on the student's hazy concepts

The student might have concepts they might need to work on. If they do, the concepts to work on will be strings in this array: ["errors"].

If there are strings in that array please try to make the question be relevant to those concepts.

# Examples

These are examples output. Notice not only the JSON structure — but that the only response IS the JSON output!

## Difficulty score of 1
This is an example of a question with a DIFFICULTY score of 0 because it correctly prints a string of ASCII characters.

<json>
{
  "choices": [
    {"Doesn't compile": {
      "value": -1,
      "concepts": ["complilation"],
    }},
    {"Prints go lang": {
      "value": 0,
      "concepts": ["string operations"],
    }},
    {"Prints golang": {
      "value": 1,
      "concepts": [],
    }},
  ]
}
</json>

As described in the rules, there are 3 answers in the JSON within "choices" with each answer's value in a field name:

- "Doesn't compile": this is wrong because the program does compile and print a string, which is why it's the least correct answer with value -1
- "Prints go lang": this suggests the program compiles but prints the wrong string because the space between words isn't there, which is why it's wrong but less wrong than the previous answer with value 0
- "Prints golang": this is what the program prints and is thus the correct answer with value 1

A variation of this problem of difficulty 1 would change the snippet by removing import fmt, which causes the code to break.

## Difficulty score of 2

<json>
{
  "choices": [
    {"Prints 5": {
      "value": -1,
      "concepts": ["functions"]
    }},
    {"Prints 30": {
      "value": 1,
      "concepts": []
    }},
    {"Prints 15": {
      "value": 0,
      "concepts": ["variable assignment", "functions"]
    }}
  ]
}
</json>

## Difficulty score of 3

<json>
{
  "choices": [
    {"Doesn't compile": {
      "value": -1,
      "concepts": ["interfaces", "methods"]
    }},
    {"Prints 3": {
      "value": 0,
      "concepts": ["method receivers"]
    }},
    {"Prints 12": {
      "value": 1,
      "concepts": []
    }}
  ]
}
</json>

## Difficulty score of 4

<json>
{
  "choices": [
    {"Prints 1 then 1": {
      "value": 0,
      "concepts": ["closures"]
    }},
    {"Prints 1 then 2": {
      "value": 1,
      "concepts": []
    }},
    {"Doesn't compile": {
      "value": -1,
      "concepts": ["functions"]
    }}
  ]
}
</json>

## Difficulty score of 6
Here the reader needs to be aware that:

- Go has built-in functionality to handle Unicode
- Go for loops iterate by byte
- The character "π" has a length of 2 bytes

<json>
{
  "choices": [
    {"Prints 0": {
      "value": 0,
      "concepts": ["for loops iterate by byte", "UTF-8 and how it feeds into Go"],
    }},
    {"Prints 0 and 1": {
      "value": 1,
      "concepts": [],
    }},
    {"Doesn't compile": {
      "value": -1,
      "concepts": ["Go is compatible with UTF-8", "compilation"],
    }},
  ]
}
</json>

## Difficulty score of 7

<json>
{
  "choices": [
    {"Prints 2": {
      "value": -1,
      "concepts": ["slices are reference types"]
    }},
    {"Prints 5": {
      "value": 1,
      "concepts": []
    }},
    {"Causes a runtime panic": {
      "value": 0,
      "concepts": ["slice manipulation"]
    }}
  ]
}
</json>

## Difficulty score of 9

<json>
{
  "choices": [
    {"Prints 1 then 2": {
      "value": 1,
      "concepts": []
    }},
    {"Prints 2 then 1": {
      "value": 0,
      "concepts": ["channel synchronization"]
    }},
    {"Deadlocks": {
      "value": -1,
      "concepts": ["goroutines", "channels"]
    }}
  ]
}
</json>

# TASK

Please generate a single output choices for the code snippet I pass you.

ONLY RETURN THE JSON!

Assistant:

<json></json>
`;

const replaceDifficulty = (prompt: string, difficulty: number) => {
  return prompt.replace("{{DIFFICULTY}}", difficulty.toString());
};

const replaceSnippet = (prompt: string, snippet: string) => {
  return prompt.replace("{{ORIGINAL_SNIPPET}}", snippet);
};

export default function Chat() {
  let { append, input, messages, setInput, handleSubmit, isLoading } =
    useChat();
  let { complete, completion } = useCompletion();

  const [buttonText, setButtonText] = useState("Submit your answer");
  const [snippet, setSnippet] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [options, setOptions] = useState([
    { "Prints 3": { value: -1, concepts: ["append"] } },
    { "Prints 4": { value: 1, concepts: [] } },
    { "Causes a runtime error": { value: 0, concepts: ["slices"] } },
  ]);

  // useEffect(() => {
  //   const message: Message = {
  //     id: nanoid(),
  //     createdAt: new Date(),
  //     content: replaceDifficulty(prompt, difficulty),
  //     role: "user",
  //   };

  //   append(message);
  // }, []);

  // useEffect(() => {
  //   if (
  //     !isLoading &&
  //     messages.length > 0 &&
  //     messages[messages.length - 1].role === "assistant"
  //   ) {
  //     complete(
  //       replaceSnippet(choicesPrompt, messages[messages.length - 1].content)
  //     ).then((res) => {
  //       console.log("res: ", res);
  //       const json = JSON.parse(res || "[]");
  //       setOptions(json.choices);
  //     });
  //   }
  // }, [isLoading, snippet]);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("input: ", input);
    console.log("prompt: ", prompt);
    if (buttonText === "Submit your answer") {
      // gradeOption(options);
      setButtonText("Next question");
      // TODO: grade the result here and store the information in the next prompt
    } else {
      setInput(replaceDifficulty(prompt, 1));
      setButtonText("Submit your answer"); // Reset the button text for the next question
    }
  };

  console.log(messages);
  return (
    <div className="mx-auto w-full max-w-xl my-12 flex flex-col stretch overflow-y-scroll">
      <div className="p-4 my-8 w-full max-w-xl mx-auto bg-gray-100 rounded-md shadow-lg">
        <p className="mb-4 text-gray-700">What's the output of this code?</p>

        <pre className="p-3 bg-gray-800 text-white font-mono text-sm rounded-md overflow-x-auto">
          {/* <code>{snippet}</code> */}
          <code>
            {/* {messages &&
              messages.length > 0 &&
              messages[messages.length - 1].role === "assistant" &&
              messages[messages.length - 1].content} */}
            {`
              package main

              import "fmt"
              
              func main() {
                x := []int{1, 2, 3}
              
                x = append(x, 4)
              
                fmt.Println(len(x))
              }`}
          </code>
        </pre>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col items-center justify-center">
          {options &&
            options.length === 3 &&
            options.map((option: any) => {
              const key = Object.keys(option)[0];
              return (
                <label
                  key={option}
                  className={`block cursor-pointer rounded-lg border-2 py-3 px-4 my-2 transition-all font-medium
                ${
                  input === option
                    ? "border-blue-500 shadow-lg bg-blue-100 text-blue-700"
                    : "border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md"
                }`}
                >
                  <input
                    type="radio"
                    name="options"
                    className="mr-2 opacity-0 absolute"
                    value={option}
                    checked={input === option}
                    onChange={() => setInput(option)}
                  />
                  <span className="ml-2">{key}</span>
                </label>
              );
            })}
        </div>
        <button
          className="mt-12 mb-8 border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xl font-semibold text-gray-700 transition-all bg-blue-300 hover:bg-blue-500 hover:text-white hover:border-transparent hover:shadow-lg"
          type="submit"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
