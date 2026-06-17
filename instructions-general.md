# General Agent Instructions

These instructions are reusable guardrails for coding agents working in any repository. They bias toward clear reasoning, small changes, and verifiable outcomes.

## Core Workflow

Think before coding.

- Inspect the relevant files and existing patterns before editing.
- State assumptions, uncertainties, and tradeoffs when they affect the implementation.
- If multiple interpretations are plausible, call them out instead of silently choosing one.
- Ask for clarification when ambiguity materially changes the implementation, data model, user experience, cost, or operational risk.
- Prefer the simplest approach that satisfies the actual request.
- Push back when a requested approach is likely to add unnecessary complexity, fragility, or cost.

For multi-step work, use a brief plan with clear verification points. Define what success means before changing code.

## Engineering Principles

Keep the solution simple, readable, and maintainable.

- Apply SOLID principles where they improve clarity, testability, and long-term maintainability.
- Use DRY to remove meaningful duplication, but do not create abstractions for one-off code or speculative reuse.
- Be aware of Gang of Four design patterns and use them when they fit the actual problem. Do not force patterns into simple code.
- Favor explicit, readable control flow over clever expressions.
- Avoid ternary expressions when they reduce readability, hide side effects, or combine complex conditions. Prefer clear `if` blocks in those cases.
- Write the minimum code that solves the problem. Avoid extra features, configuration, or flexibility that was not requested.
- Match the language, framework, and architecture already present in the repository.

Before adding an abstraction, ask whether it removes real complexity or only moves complexity somewhere else.

## Change Discipline

Make surgical changes.

- Touch only the files and lines needed for the task.
- Preserve unrelated user work, local edits, formatting, and behavior.
- Do not refactor adjacent code unless it is necessary to complete the request safely.
- Clean up imports, variables, functions, tests, and generated artifacts made obsolete by your own changes.
- If you notice unrelated dead code or defects, mention them separately instead of fixing them opportunistically.
- Every changed line should trace back to the user request or to required verification.

Respect local conventions even when you would choose a different style in a new project.

## Reliability

Design fragile operations to fail predictably and recover safely.

- Use circuit breakers around unreliable external calls, network dependencies, third-party APIs, cloud service calls, and other operations where repeated failure can amplify load, cost, or user impact.
- Use exponential retry with jitter for transient failures when retrying is safe and likely to help.
- Do not retry non-idempotent operations unless they are explicitly made safe with idempotency keys, deduplication, transactions, or another clear safeguard.
- Set bounded timeouts and retry limits. Infinite retries and unbounded waits are operational bugs.
- Surface partial failures and degraded states clearly so callers and operators can respond.
- Log enough context to diagnose repeated failures without leaking secrets or sensitive data.

Prefer small, composable reliability controls over broad catch-all error handling.

## Cost Awareness

For AWS deployments, infrastructure changes, or code changes that can materially affect cloud usage, review cost impact before deployment.

- Consider compute, concurrency, request volume, storage, data transfer, logs, metrics, queues, databases, caches, snapshots, and retained artifacts.
- Call out any change that could increase spend through higher throughput, longer runtime, larger memory, broader fan-out, more retries, larger retention windows, or additional managed services.
- Avoid cost-amplifying retry loops, polling loops, logging volume, and overprovisioning.
- Prefer cost-conscious defaults while preserving correctness, reliability, and security.
- Explicitly surface material cost implications in the final report or deployment notes.

Do not overstate cost risk for trivial edits, but do not deploy cost-impacting changes silently.

## Verification

Loop until the goal is verified.

- Define success criteria that can be checked.
- Run the smallest meaningful tests, linters, builds, smoke checks, or manual validations for the change.
- Add or update tests when behavior changes and the risk justifies it.
- For bug fixes, prefer a failing test or reproduction before the fix, then verify it passes afterward.
- For refactors, verify behavior before and after when practical.
- Report exactly what was verified and what was not verified.

If verification is blocked, explain the blocker and the remaining risk.

## Memory

- If it does not exist, you gonna create a folder called "memory" inside the projects folder. On there, for every change you make, you gonna write it into a file called "Current Date - Changes".md . Example: 20/05/2026. - Changes. On this file, you gonna note each round, results and what has been applied during that day. For each day, one file.