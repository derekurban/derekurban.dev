# Custom JSON Text Parser

This project is a small TypeScript parsing utility that reconstructs JavaScript values directly from raw JSON-like text without calling `JSON.parse`. It is built around one exported class, `JsonAssembler`, which accepts an input string and incrementally assembles the corresponding value.

At the top level, the parser handles the full set of value shapes the project is designed for: objects, arrays, quoted strings, and primitive values. The implementation is compact, but it includes the core mechanics needed to recursively rebuild nested structures from plain text.

## Overview

The parser works by reading the input one character at a time and deciding what kind of value should be built next. Instead of delegating the work to the platform's built-in JSON parser, it manually interprets the text stream and reconstructs the in-memory result through its own parsing methods.

That gives the project a clear, library-style shape. The input is a string, the output is the assembled JavaScript value, and the parser itself is responsible for consuming the text, tracking its place in the stream, and dispatching to the correct parsing path.

The public entry point is intentionally small. `assemble()` begins the process, and the rest of the parser is organized as a set of internal builder methods that each handle one kind of value.

## Parsing Model

The central dispatcher is `buildValue()`. It skips whitespace, reads the next meaningful character, and uses that token to decide whether the next value is:

- A string
- An object
- An array
- A primitive

This gives the parser a recursive-descent structure. When the parser encounters a nested object or array, it calls back into the same value-building path and continues assembling from the current point in the input.

That recursive model is the core of the project. It allows the parser to handle nested combinations of arrays and objects without needing a separate parsing stage for each level.

## How Values Are Built

Strings are parsed by reading forward until an unescaped closing quote is found. Once the raw string contents are collected, the parser converts common escaped characters such as newlines, tabs, backslashes, and escaped quotes into their in-memory representations.

Arrays are parsed by repeatedly reading the next element, pushing the first character of that element back into the input stream, and then calling the same value-building logic used at the top level. Parsed values are appended to a normal JavaScript array until the closing bracket is reached.

Objects are parsed by reading a quoted key, scanning forward to the colon, and then recursively parsing the value assigned to that key. Each parsed field is added to a plain object as the object body is assembled.

Primitive values are handled by reading forward until a delimiter is reached, then coercing the collected text into a more specific type when possible. Numeric text is converted into numbers, and the parser also recognizes booleans, `null`, and `undefined`.

## Distinctive Implementation Detail

The most characteristic part of the project is the internal text-management approach. Instead of keeping a numeric cursor index and advancing through the input with pointer arithmetic, the parser uses a helper class that stores the remaining unconsumed text and slices characters off the front as they are processed.

That helper also supports a simple one-character pushback mechanism. When the parser reads a character that belongs to the next parsing step, it can return that character to the front of the remaining input and let the next builder method consume it properly.

This makes the parser easy to follow. The control flow stays local to the parsing methods, and the parser can move between reading, peeking, and recursive descent without introducing a separate tokenizer or a larger parsing pipeline.

## Supported Behavior

The project handles:

- Nested objects
- Nested arrays
- Mixed primitive types
- Escaped string content
- Empty arrays and empty objects
- Objects nested inside arrays and arrays nested inside objects

The included test suite exercises those cases across multiple combinations, which gives the parser coverage across the kinds of structures it is designed to assemble.

## Technical Character

This is a deliberately lightweight parser rather than a full JSON validation engine. The implementation focuses on reconstructing values from expected input, not on enforcing every strict rule of the JSON specification.

That is visible in a few places. The parser explicitly accepts `undefined`, which is not part of standard JSON. Primitive number parsing is also permissive because it uses `parseFloat` rather than a stricter token validation step. In practice, the project is best described as a manual JSON-like assembler built for recursive value reconstruction.

That framing fits the code more accurately than calling it a standards-compliant parser.

## Project Structure

The repository is intentionally small:

- `src/JsonAssembler.ts` contains the full parser implementation
- `JsonAssembler` acts as the public parser class
- `JsonTextManager` acts as the internal character-consumption helper
- `tests/JsonAssembler.test.ts` exercises the parser against nested structures, escaped strings, and mixed values

The small footprint is part of what makes the project readable. The full parsing flow can be traced through one source file, which makes the implementation choices easy to inspect.

## What The Work Includes

This project includes:

- Recursive parsing of nested objects and arrays
- Manual string scanning and escape-sequence replacement
- Primitive token collection and type coercion
- A mutable string cursor with pushback behavior
- A small test-backed TypeScript utility with a focused public API

Overall, this is a compact parsing exercise centered on how structured text can be turned back into nested in-memory data through explicit control over the input stream.

## Tags

- Project Size: Small
- Technical Skill Level: Medium
- Technology Tags: TypeScript
- Capability Tags: Parsing, Recursive Descent, Text Processing, Data Structures, Utility Design, Test Coverage

## Project Details:

- Start Date: 2023-10-06
- End Date: 2023-10-06
- Duration: 1 Days
- Contributors: 1
- My Contribution: 100%
