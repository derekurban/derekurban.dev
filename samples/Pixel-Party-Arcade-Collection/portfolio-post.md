# Pixel Party Arcade Collection

Pixel Party is a local four-player Java desktop arcade bundle that combines Frogger, Pac-Man, and Pong inside one session-based application. The program moves players through a shared setup flow, runs a randomized sequence of rounds, and keeps player color and score consistent across the session.

## Overview

Pixel Party is organized as a single local multiplayer session rather than as three separate games launched independently. The session begins with an opening screen, a rules screen, a character-selection step, and a pre-game setup screen before the active game container is launched. Once the session starts, the program runs three mini-games in sequence: Frogger, Pac-Man, and Pong.

The order of the three rounds is randomized before play begins. That order is shown to the players on the leaderboard screen, and the same screen is used between rounds to show updated standings and prepare the next game.

Each player selects a distinct color before the session starts. That choice carries forward into gameplay, so the same player identity is preserved between setup screens and the mini-games. The project uses that color choice as part of the session structure rather than treating character selection as a one-off menu detail.

The three game modes do not use the same rules. Frogger and Pong run as free-for-all rounds. Pac-Man runs as two teams of two. Between rounds, the application returns to a shared leaderboard and ready-check screen before launching the next game.

## Session Design

One of the defining characteristics of the project is its one-button control scheme. Each of the four players is assigned a single key (`Q`, `R`, `U`, `P`), and the application uses that limited input set across menus and gameplay. Those simple key mappings mirror the hand-made controller setup built for the project, so the same one-button-per-player model can be used with the physical controller or directly from the keyboard. The same button is used for ready checks before rounds and for in-game actions once a round starts.

That constraint gives the project a very specific design shape. Instead of building separate, complex control mappings for each mini-game, the code organizes each mode around simple, readable input behavior that can be reused across the full session.

The pre-game screen also includes a "How To Play" view tied to the upcoming round. That keeps the transition between setup and gameplay inside the same flow rather than pushing players into separate instruction screens for each mode.

## Shared Systems

The menu and session code manages the main window, screen transitions, round startup, round completion, and leaderboard updates. A shared set of support classes handles persistent player state, input abstractions, score normalization, and sprite recoloring. Each mini-game then keeps its own runtime logic in a separate package.

The leaderboard is part of the application flow rather than an afterthought at the end of a match. After each round finishes, scores are parsed, converted into session points, and added back into the running totals before the next round begins. The session can also be replayed with a new random game order while keeping the running score history active.

Sprite recoloring is another notable shared system. After players lock in their colors, those selections are passed into the shared player state and reused inside the games so each player keeps a consistent visual identity.

## Runtime Details

The project uses Java SE with Swing and AWT rather than a dedicated game engine. UI screens are built directly as desktop panels, and gameplay relies on custom thread loops for movement, timers, collision checks, animation, and score updates.

Common runtime features across the project include:

- Multi-screen UI flow
- Shared player color and score state
- One-button input handling for four local players
- Sprite recoloring tied to character selection
- Round-by-round session scoring

Each mini-game builds on that shared base in a different way:

- Frogger uses a scrolling obstacle course with moving hazards, collision checks, respawn behavior, and finish-order scoring.
- Pac-Man uses two player-controlled Pac-Man entities, ghost movement, pellet collection, timed round logic, and team score handling.
- Pong uses a four-sided arena where each player controls one edge and loses lives when the ball escapes their side.

## Implementation Notes

The character-selection screen uses a 3x4 color grid and blocks progression until all four players have claimed a color. That makes the setup step part of the session rules rather than a cosmetic option that can be skipped.

The round lifecycle is also centralized. A single handler starts each round, waits for completion, normalizes the results, updates the running leaderboard, and prepares the next game in the sequence.

Pac-Man contains the most involved runtime of the three modes. It uses a ninety-second clock, increases difficulty over time, has ghosts drop pellets at timed intervals, and reports team scores back into the shared scoring format used by the session layer.

Frogger centers on constant movement and positional pressure. The round uses a vertically scrolling playfield, moving obstacles, and repeated collision checks to keep all four players active at once.

Pong uses a different structure from a standard two-paddle match. The arena is built around four edges, one for each player, so the round becomes a shared survival contest instead of a head-to-head game.

## Tags

- Project Size: Medium
- Technical Skill Level: Medium
- Technology Tags: Java, Swing, AWT
- Capability Tags: Game Development, Local Multiplayer, UI Flow, State Coordination, Threaded Runtime, Input Design

## Project Details:

- Start Date: 2020-02-03
- End Date: 2020-04-19
- Duration: 77 Days
- Contributors: 5
- My Contribution: 65.2%
