---
name: publish-blog-article
description: Prepare and submit a complete blog article proposal to the Guionardo Furlan website repository through its GitHub issue workflow.
metadata:
  short-description: Submit a blog article proposal by GitHub issue
---

# Submit a blog article proposal

Use this skill when the user asks to publish, submit, or propose an article for
the Guionardo Furlan blog. The repository workflow turns a valid issue into a
branch and pull request; do not create those manually.

## Repository

Target repository: `guionardo/guionardofurlan.com.br`.

Read the current requirements before preparing the issue:

- [Article proposal instructions](https://github.com/guionardo/guionardofurlan.com.br/blob/main/README.md#propor-artigos-por-issue)
- [Issue template](https://github.com/guionardo/guionardofurlan.com.br/blob/main/.github/ISSUE_TEMPLATE/article-proposal.md)

## Required result

When the user explicitly authorizes submission:

1. Prepare the article as three complete Markdown texts, one for each language:
   `pt`, `en`, and `es`.
2. Keep the same `translationKey` in all three files. Each file must declare
   `title`, `description`, `date`, `slug`, `tags`, `draft: true`, `lang`, and
   `translationKey` in YAML frontmatter.
3. Ensure the body starts with `##`, not `#`; preserve commands, URLs, facts,
   sources, caveats, and useful image alt text.
4. Ask for or infer the destination only when unambiguous: `blog` or an
   existing `series:<seriesKey>`.
5. Put the three Markdown texts in the issue body under `## Artigo pt`,
   `## Artigo en`, and `## Artigo es`, each inside a fenced code block using at
   least four backticks. Use a title beginning with `[artigo]` and include the
   destination and a concise description in the issue body. Images and other
   assets must be referenced by accessible URLs; GitHub issue attachments are
   not part of this workflow.

Do not claim that the article was published. Opening the issue starts review;
the generated pull request still requires review and merge.

## Boundaries

- Do not open the issue until the user has asked to submit it.
- Do not add secrets, credentials, private data, or unlicensed third-party
  material.
- Do not invent missing translations, facts, sources, or personal experiences.
- If one of the three language versions or a required asset URL is missing,
  stop and report the missing item instead of submitting a partial issue.
- If the destination is not `blog` or an existing series, report that the
  repository workflow does not support it yet.
