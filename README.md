# ja-learning

A personal structured note repository for studying Japanese on [Busuu](https://www.busuu.com), currently progressing through the **Intermediate B1** course.

Each lesson is captured as a clean, scannable markdown file covering vocabulary, grammar patterns, learning context, and progress tracking.

---

## Repository Structure

```
ja-learning/
├── docs/
│   └── chapter-01-emotions/
│       ├── section-01.md   # Emotions: うれしい, かなしい, しあわせ
│       ├── section-02.md   # Emotions: はずかしい, さびしい, negative adjectives
│       ├── section-03.md   # Emotions: くやしい, おこる, past tense
│       └── section-04.md   # Emotions: 幸せ, 今, pronoun 僕
├── CLAUDE.md             # AI tool instructions and chapter generator format
└── README.md
```

---

## Course Progress

| Level          | Course                          | Chapter        | Completion |
|----------------|---------------------------------|----------------|------------|
| Intermediate B1 | Complete Japanese — Busuu      | Chapter 1: Emotions | ~28%  |

---

## Chapter Format

Every chapter note follows a consistent four-section structure:

### 1. Vocabulary List
A table of new words with Japanese, romaji, and English translation. Kanji entries include furigana in parentheses.

### 2. Grammar & Sentences
The core grammar rule of the lesson, broken down into:
- Pattern structure with inline code formatting
- Key phrases and example sentences with romaji and English translation

### 3. Learning Context
Nuance notes, situational context, and performance highlights — the "why" behind the vocabulary and grammar.

### 4. Progress Tracker
A snapshot of course completion and latest lesson score at the time of the note.

---

## Chapters

| File | Topic | Key Grammar | Score |
|------|-------|-------------|-------|
| [section-01.md](docs/chapter-01-emotions/section-01.md) | Expressing emotions & reasons | から (because) + なぜなら | — |
| [section-02.md](docs/chapter-01-emotions/section-02.md) | Negative emotions & denial | i-adjective negative: 〜くないです | 100% |
| [section-03.md](docs/chapter-01-emotions/section-03.md) | Frustration & anger | i-adjective past: 〜かったです | 100% |
| [section-04.md](docs/chapter-01-emotions/section-04.md) | Current state & pronouns | 今 + emotion + です | 100% |

---

## AI Tool Integration

This repo includes a [CLAUDE.md](CLAUDE.md) that instructs AI tools (Claude Code, Cursor, Copilot Workspace, etc.) to automatically format new lesson notes into the standard chapter structure when given raw content.

To add a new chapter, paste your raw Busuu lesson notes and ask:

```
generate for chaps N
[raw lesson content]
```

The AI will create `docs/b1-chapterNN.md` with the correct format applied.
