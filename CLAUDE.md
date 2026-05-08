# CLAUDE.md — ja-learning

This repository stores structured Japanese learning notes from the Busuu Intermediate B1 course.

## Japanese Chapter Generator

When given raw lesson content and asked to generate a section, save it to `docs/chapter-NN-[topic]/section-NN.md` (zero-padded, e.g. `docs/chapter-01-emotions/section-05.md`) using this structure:

```markdown
# Learning Summary

## 1. Vocabulary List

| Japanese | Romaji | English |
|----------|--------|---------|
| ...      | ...    | ...     |

---

## 2. Grammar & Sentences

**[Grammar Point Title]:** [Explanation]

- **Structure:** `[Pattern]` + suffix
- **Key Phrase / Example:** 日本語。*(Romaji.)* — "English translation."

---

## 3. Learning Context

- **[Label]:** [Detail]

---

## 4. Progress Tracker

| Field              | Detail |
|--------------------|--------|
| Current Level      | ...    |
| Chapter / Topic    | ...    |
| Completion         | ...    |
| Latest Performance | ...    |
```

### Chapter Title Reference

Derive the `[topic]` slug for file naming from `chapters-lessons.md` in the repo root. That file lists every chapter and its official title (e.g. `Chapter 6: Conditionals` → slug `conditionals`). Lowercase the title and replace spaces with hyphens. Example: Chapter 6 → `docs/chapter-06-conditionals/`.

### Formatting Rules

- Vocabulary table: include furigana in parentheses for kanji entries — e.g. `幸せ（しあわせ）`
- Grammar patterns: wrap syntax in inline code backticks, romaji examples in *italics*
- File naming: `docs/chapter-NN-[topic]/section-NN.md` (zero-padded, e.g. `docs/chapter-01-emotions/section-05.md`)
- Always look up the chapter title in `chapters-lessons.md` to determine the correct `[topic]` slug
- Create the chapter directory if it doesn't exist yet
- No comments, no extra prose — keep it clean and scannable
- Apply without asking for confirmation when the user pastes raw lesson content
