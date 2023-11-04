"use client";

import { useChat } from "ai/react";
import { FormEvent, useState } from "react";

export default function Chat() {
  let { input, messages, handleInputChange, handleSubmit } = useChat();
  const [buttonText, setButtonText] = useState("Submit your answer");
  const options = [
    "This is a good answer",
    "This is a neutral answer",
    "This is a bad one",
  ];

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonText === "Submit your answer") {
      setButtonText("Next question");
      // TODO: grade the result here and store the information in the next prompt
    } else {
      handleSubmit(e);
      setButtonText("Submit your answer"); // Reset the button text for the next question
    }
  };

  console.log(messages);
  return (
    <div className="mx-auto w-full max-w-xl my-12 flex flex-col stretch overflow-y-scroll">
      <div className="p-4 my-8 w-full max-w-xl mx-auto bg-gray-100 rounded-md shadow-lg">
        <p className="mb-4 text-gray-700">
          {messages &&
            messages.length > 0 &&
            messages[messages.length - 1].content}
        </p>

        <pre className="p-3 bg-gray-800 text-white font-mono text-sm rounded-md overflow-x-auto">
          <code>{"code"}</code>
        </pre>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="flex flex-col items-center justify-center">
          {options.map((option) => (
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
                onChange={handleInputChange}
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
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
