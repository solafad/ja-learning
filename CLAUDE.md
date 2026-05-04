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

### Formatting Rules

- Vocabulary table: include furigana in parentheses for kanji entries — e.g. `幸せ（しあわせ）`
- Grammar patterns: wrap syntax in inline code backticks, romaji examples in *italics*
- File naming: `docs/chapter-NN-[topic]/section-NN.md` (zero-padded, e.g. `docs/chapter-01-emotions/section-05.md`)
- Create the chapter directory if it doesn't exist yet
- No comments, no extra prose — keep it clean and scannable
- Apply without asking for confirmation when the user pastes raw lesson content
