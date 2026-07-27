# The kit verbs — one thing at a time

Mike, 2026-07-27: *"We want to apply the same concept — test the verb — as we do on
gaming. First we need a list of features to focus on singularly and test."*

This is the games' first build pillar pointed at the kits. In a game you get one
thing working until it's fun before adding the second thing. Here the equivalent is:
a kit is not a screen to sweep, it's a short list of things a learner **does**. Test
one of them end to end, all the way through, before looking at anything else.

The whole point is that a verb is testable on its own. If testing one verb needs you
to work through three others first, that's a finding about the kit, not about the test.

## How to use this list

Pick ONE row. Run it in one kit, on a phone and on a desktop, from a clean start.
Everything else on the screen is out of scope for that pass — note it and move on.

A verb passes when all three hold:

1. **It does what it says.** The thing you did had the effect you expected.
2. **You always know where you are.** Before, during, and after — what this is, what
   just happened, what's next.
3. **It survives a reload.** Close the tab mid-verb, come back, and you are not
   silently reset or stranded.

## The verbs

| # | The verb | What you actually do | Passes when |
|---|---|---|---|
| V1 | **Start** | Land on a kit with no history and begin | The first screen tells a stranger what this is and gives exactly one thing to do |
| V2 | **Read the concept** | Take in the teaching part of a lesson | One idea, in everyday words, with nothing competing for attention |
| V3 | **See it worked** | Read the worked example | You can follow the example without scrolling back to the concept |
| V4 | **Answer a check** | Choose an option in a Quick Check | One tap decides it — no second click to confirm — and you learn immediately whether you were right |
| V5 | **Order the pieces** | Arrange lines into the right order | You can rearrange freely; nothing is graded until you say so; a wrong order tells you what was wrong |
| V6 | **Type and run** | Write a query / formula / snippet and run it | The instruction stays visible while you type, on a phone especially; errors read like help, not stack traces |
| V7 | **Miss something** | Get one wrong | It says what was right, files the miss automatically, and does not scold |
| V8 | **Finish a lesson** | Reach the end | You know you finished, what you can now do, and where to go — one directive, not a menu |
| V9 | **Practise** | Do the drills attached to a lesson | It feels like the same session continuing, not a second app |
| V10 | **Review misses** | Open Review and work the queue | Only real misses are in there; answering one removes it; an empty queue says so kindly |
| V11 | **Leave and come back** | Close the tab, return tomorrow | It puts you back where you were and says so |
| V12 | **Move to the next lesson** | Continue along the path | Never ambiguous which lesson is next, and never a dead end at a unit boundary |
| V13 | **Reset** | Clear progress and start over | It says exactly what will be cleared, clears all of it, and keeps what must survive (purchase, API key, sign-in) |
| V14 | **Sign in** | Use an account | Progress made signed-out is not lost on sign-in |
| V15 | **Switch theme** | Light ↔ dark | Nothing is unreadable in either, including anything drawn by JS after load |

## Which of these are already covered

The private headless suite (`apk-headless/de-test.mjs`) exercises V2, V3, V7, V8,
V10 and V12 in some form across six kits. It cannot see V1, V4, V5, V6, V9, V11,
V13, V14 or V15 — those are the ones that need a human on a phone.

## Feeding the playtest tracker

The tracker's suite for these projects is game-shaped (six passes about builds and
crashes). Once this list settles, it becomes the kit suite: one checklist item per
verb, per kit, with the three pass conditions above as the how-to-test text.

Status: **list only.** Nothing has been re-tested against it yet.
