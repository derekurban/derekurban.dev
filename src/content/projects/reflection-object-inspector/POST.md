---
title: Reflection-Based Object Inspector
slug: reflection-object-inspector
desc: A Java reflection utility that inspects arbitrary objects and renders their structure as deterministic, testable formatted text.
origin: University
status: Complete
pinned: false
archived: true
tags: [university, developer-tool]
tech: [Java, JUnit]
cardTheme: sage
cardForeground: ./assets/card-icon.svg
cardIconSize: 78
projectSize: Small
skillLevel: High
capabilities: [Reflection, Recursive Traversal, Runtime Introspection, Deterministic Output Design, Test Engineering, Algorithms]
startDate: 2023-10-14
endDate: 2023-10-15
duration: 2 Days
contributors: 1
contribution: "100%"
sourceUrl: 'https://github.com/derekurban/university-projects'
---

## Overview

This project is a Java reflection utility that inspects arbitrary objects and renders their structure as formatted text. Its purpose is not only to read type metadata, but to walk through an object in a way that makes the result understandable and testable. The implementation reports class information, declared methods, constructors, interfaces, fields, arrays, and selected nested object structure from a single inspection entry point.

The repository includes an older sample inspector implementation, but the main custom work is in `Inspector.java`. That file replaces the minimal sample behavior with a broader inspection routine and a deterministic output format that can be validated in unit tests.

## Runtime Model

The main runtime entry point for the project is `Asst2TestDriver.java`. Instead of hard-coding one inspector class, the driver loads an inspector by name at runtime with `Class.forName`, instantiates it reflectively, finds an `inspect(Object, boolean)` method, and then invokes that method against a fixed set of test fixtures. That design makes the driver itself a reflection exercise as well: the inspected objects are discovered statically in the test list, but the inspector implementation is loaded dynamically.

The driver runs the inspector against a varied set of targets:

- simple objects
- inherited objects
- one-dimensional arrays
- two-dimensional arrays
- a built-in `String`

That fixture selection gives the project a wider surface than a single toy class. It forces the inspector to handle both user-defined types and standard library objects, as well as both scalar objects and arrays.

![Inspection Runtime Flow](./assets/diagrams/inspection-runtime-flow.png)

## Reflection Output

The custom inspector is organized around one public method, `inspect(Object obj, boolean recursive)`, which returns a formatted string while also printing the same structure to the console. The returned string is important because it gives the project a clean testing surface. Instead of only producing console output that has to be checked manually, the inspector accumulates the formatted result internally and exposes it for assertions.

For non-array objects, the inspector reports the following major sections:

- class name
- immediate superclass
- implemented interfaces
- declared methods
- declared constructors
- declared fields

Each of those sections is generated through Java reflection APIs, and the implementation sorts interfaces, methods, constructors, and fields before printing them. That sorting step is one of the most characteristic parts of the project. It turns what could be unstable reflection output into a deterministic representation that can be compared across runs and across tests.

The method output includes return type, parameter types, exception types, and modifier flags. Constructors are formatted with parameter types and modifiers. Fields are printed with type, field name, value, and modifiers. The implementation also normalizes array type names so that array-valued types are displayed in a readable `Type[]` form instead of raw JVM descriptor syntax wherever possible.

## Recursive Inspection Behavior

The inspector supports both recursive and non-recursive modes. In non-recursive mode, it reports the immediate structure of the object being inspected. In recursive mode, it expands that view in several ways.

If a field contains a non-primitive object reference, the inspector can descend into that referenced object and inspect it as its own structured block. It also walks upward through the inheritance chain when the inspected class has a superclass above `Object`, and it expands interface hierarchies by listing interface methods and fields as part of the recursive type view.

This gives the output a depth-first traversal shape:

- inspect the current object
- inspect nested non-primitive field values
- recurse into non-`Object` superclasses
- recurse into implemented interfaces

That behavior allows the project to move beyond simple reflection metadata and into object graph exploration, at least for acyclic structures.

![Recursive Inspection Model](./assets/diagrams/recursive-inspection-model.png)

## Arrays and Value Formatting

Arrays are handled as a separate inspection path. When the inspected object is an array, the inspector reports:

- the array type
- the component type
- the array length
- the array contents

In recursive mode, non-null, non-primitive top-level array elements can be inspected individually. For direct field output, array values are formatted into a string representation rather than recursively expanded in place. Object arrays use `Arrays.deepToString`, while primitive arrays use special-case formatting logic.

The formatting logic for object values is also deliberate. Primitive wrappers, characters, booleans, strings, and nulls are rendered directly. Other object references are rendered as a compact identity string using the class name plus the object's identity hash. That gives the output enough information to distinguish object references without trying to serialize the object itself.

One boundary in the current implementation is that recursion does not track previously visited objects. That means the traversal is depth-first, but it is not cycle-safe. Another boundary is that primitive-array formatting is only explicitly implemented for `int[]`, with other primitive arrays falling back to a more generic string path.

## Access Control and Reflection Constraints

The field inspection path explicitly calls `setAccessible(true)` before reading field values. That allows the inspector to reach private fields when the runtime permits it. At the same time, the project handles `InaccessibleObjectException` and access failures explicitly, which means the inspector can continue and emit a readable failure message instead of crashing when the JVM refuses access.

That makes the output reflect both the object structure and the runtime environment. When private data can be read, it is shown. When module or accessibility boundaries prevent access, the output records that constraint as part of the inspection result.

## Testing Surface

The repository includes a substantial JUnit test suite in `InspectorTest.java`. The tests validate the formatted output against expected strings for multiple fixture cases, including custom classes, arrays, and standard library types. Because some object references include runtime-specific identity values, the test suite uses regex placeholders to normalize those unstable segments instead of comparing them literally.

This is one of the strongest technical characteristics of the project. Reflection output is often treated as a debugging artifact, but here it is converted into a repeatable output contract. The tests are not only checking that the program runs; they are checking that the reflected structure is presented in a stable, expected format.

![Output Testing Contract](./assets/diagrams/output-testing-contract.png)

The fixture classes in the repository support that test surface intentionally. The class hierarchy and interface relationships provide enough variation to exercise:

- inheritance
- implemented interfaces
- object-valued fields
- null references
- array fields
- modifiers and access patterns

That gives the inspector a compact but meaningful object model to inspect.

## Signing Off

This project was an excellent way to familiarize myself with reflection and how it can be used practically. In this particular instance, it was mainly used to print object values and fields as strings for the sake of inspection and observation, but the underlying principles go much deeper. 

Having the ability to traverse the relationships and characteristics of objects that exist within a virtual space opens the door to all kinds of meta-operations. For example, it is what allows diagramming tools to effectively map out and visualize complex codebase relationships automatically.

There were definitely some challenges when it came to applying the lessons to the project, but it was valuable nonetheless!
