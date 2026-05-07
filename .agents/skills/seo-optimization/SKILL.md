---
name: seo-optimization
description: >
  Full-stack SEO optimization skill. Use this skill whenever the user wants to
  improve search rankings, optimize content for search engines, audit a page for
  SEO issues, research keywords, write SEO-friendly content, or improve meta tags,
  headings, or internal linking. Trigger this skill for ANY mention of SEO,
  search engine optimization, Google rankings, organic traffic, keywords, meta
  descriptions, title tags, content optimization, or on-page SEO — even if the
  user only pastes a URL or raw content and says "optimize this." Also trigger
  for requests like "help me rank higher", "make this more searchable", "improve
  my blog post for Google", or "what keywords should I target."
---

# SEO Optimization Skill

A comprehensive skill for on-page SEO, content optimization, technical SEO
audits, and keyword research — for blog posts, product pages, landing pages,
and any web content.

---

## Workflow Overview

When triggered, identify which of the four SEO modes applies (or combine them):

| Mode | Trigger signals |
|------|----------------|
| **A. On-Page SEO** | "optimize my page", "fix my meta tags", paste of HTML/content |
| **B. Content Writing & Optimization** | "write SEO content", "rewrite this", "improve my article" |
| **C. Technical SEO Audit** | "audit my site", "why isn't Google indexing me", "check my SEO" |
| **D. Keyword Research & Strategy** | "what keywords should I target", "keyword ideas for X" |

Multiple modes can run in a single response. Always end with a **Priority Action List**.

---

## MODE A — On-Page SEO

Analyze and optimize the core on-page elements. For each element, give:
- ✅ Current status (Good / Needs Work / Missing)
- 💡 Specific recommendation
- ✏️ Rewritten version (when applicable)

### Elements to audit:

**1. Title Tag**
- Length: 50–60 characters
- Primary keyword near the front
- Unique, compelling, matches search intent
- Format: `Primary Keyword – Secondary Keyword | Brand`

**2. Meta Description**
- Length: 150–160 characters
- Includes primary keyword naturally
- Has a clear call-to-action
- Summarizes the page value

**3. URL Slug**
- Short, lowercase, hyphens only
- Contains primary keyword
- No stop words (the, a, and…) unless necessary

**4. H1 Tag**
- Exactly one H1 per page
- Contains primary keyword
- Matches search intent

**5. Heading Hierarchy (H2–H6)**
- Logical outline structure
- Secondary/LSI keywords in H2s
- No skipped heading levels

**6. Keyword Usage**
- Primary keyword in first 100 words
- Keyword density: 1–2% (not stuffed)
- LSI / semantic keywords present
- Keywords in image alt text

**7. Internal Links**
- At least 2–3 internal links
- Descriptive anchor text (not "click here")
- Link to relevant related pages

**8. Image Optimization**
- Alt text present and descriptive
- File names are keyword-relevant (not `IMG_001.jpg`)
- Images compressed (flag if unknown)

**9. Content Length**
- Compare against typical top-ranking pages for the topic
- Flag if significantly shorter than competitors

**Output format for Mode A:**
```
## On-Page SEO Report

### SEO Score: XX/100

| Element        | Status       | Issue |
|----------------|--------------|-------|
| Title Tag      | ✅ Good       | —     |
| Meta Desc      | ⚠️ Needs Work | Too short (89 chars) |
| ...            |              |       |

### Rewrites
**Optimized Title Tag:**
> Your optimized title here (XX chars)

**Optimized Meta Description:**
> Your optimized meta description here (XXX chars)

**Suggested H1:**
> Your H1 here
```

---

## MODE B — Content Writing & Optimization

### For rewriting existing content:
1. Identify the **target keyword** (ask user if not provided)
2. Analyze the content for: thin content, keyword gaps, readability, structure
3. Rewrite or enhance with:
   - Keyword-rich introduction (primary KW in first 100 words)
   - Proper heading structure (H2 for main sections, H3 for sub-points)
   - LSI keywords woven naturally
   - Short paragraphs (3–4 sentences max)
   - Bullet points / numbered lists for scanability
   - A strong conclusion with a CTA or summary
   - FAQ section if relevant (targets "People Also Ask" boxes)

### For writing new SEO content:
Ask for (or infer from context):
- Target keyword
- Content type (blog post, product page, landing page)
- Word count target
- Audience / tone

Then produce a full piece with:
```
[SEO-Optimized Title]
[Meta Description]
[H1]
[Introduction — keyword in first sentence]
[H2 Section 1]
  [H3 sub-point if needed]
[H2 Section 2]
...
[FAQ Section]
[Conclusion + CTA]
```

### Readability standards:
- Flesch Reading Ease: aim for 60–70 (plain language)
- Avg sentence length: under 20 words
- Avoid passive voice where possible
- Use transition words (therefore, however, for example…)

---

## MODE C — Technical SEO Audit

When the user provides a URL or describes their site, audit these areas:

### Core Technical Checks

**Crawlability & Indexation**
- Is robots.txt blocking important pages?
- Is there a sitemap.xml? Is it submitted to Google Search Console?
- Are canonical tags correct? (no self-referencing issues, no duplicate canonicals)
- Are there noindex tags where they shouldn't be?

**Page Speed**
- Flag Core Web Vitals: LCP, FID/INP, CLS
- Recommend: image compression, lazy loading, minify CSS/JS, use CDN
- Tool recommendation: Google PageSpeed Insights, GTmetrix

**Mobile-Friendliness**
- Responsive design check
- Font size / tap target size
- No intrusive interstitials

**HTTPS & Security**
- Site served over HTTPS?
- No mixed content warnings?

**Structured Data / Schema Markup**
- Is schema present? (Article, Product, FAQ, BreadcrumbList, etc.)
- Validate with Google's Rich Results Test
- Recommend schema types relevant to content type

**Core SEO Architecture**
- Flat URL structure (max 3 clicks from homepage)
- Pagination handled correctly (rel=next/prev or canonical)
- Hreflang tags if multilingual
- Duplicate content issues (www vs non-www, trailing slashes)

**Output format for Mode C:**
```
## Technical SEO Audit

### Critical Issues 🔴
- [Issue]: [Fix]

### Warnings ⚠️
- [Issue]: [Recommendation]

### Passed ✅
- HTTPS: OK
- ...

### Tools to Use
- [Tool name]: [What to check]
```

---

## MODE D — Keyword Research & Strategy

### Step 1: Seed Keyword Expansion
Given a topic or seed keyword, generate:
- 5–10 **primary keyword** candidates (high intent, moderate-high volume)
- 10–15 **long-tail keywords** (lower competition, high intent)
- 5–8 **LSI / semantic keywords** (related terms Google associates with the topic)
- 3–5 **question keywords** (who/what/how/why — targets featured snippets)

### Step 2: Keyword Classification
Group keywords by **search intent**:

| Intent | Description | Example |
|--------|-------------|---------|
| Informational | User wants to learn | "how to do SEO" |
| Navigational | User wants a specific site | "Ahrefs login" |
| Commercial | User is researching before buying | "best SEO tools" |
| Transactional | User is ready to buy/act | "buy SEO course" |

### Step 3: Keyword Prioritization Matrix
Score each keyword on:
- **Search Volume**: High / Medium / Low
- **Competition**: High / Medium / Low
- **Business Relevance**: High / Medium / Low
- **Quick Win Potential**: Yes / No (existing page can be optimized)

### Step 4: Content Gap Analysis
Identify topics the user should cover but hasn't yet.
Suggest a **content cluster** structure:
```
Pillar Page: [Broad topic]
├── Cluster 1: [Subtopic A]
├── Cluster 2: [Subtopic B]
├── Cluster 3: [Subtopic C]
└── Cluster 4: [Subtopic D]
```

**Output format for Mode D:**
```
## Keyword Research Report

### Primary Keywords
| Keyword | Est. Volume | Competition | Intent |
|---------|-------------|-------------|--------|
| ...     | High        | Medium      | Info   |

### Long-Tail Keywords
...

### Question Keywords (Featured Snippet Opportunities)
...

### Recommended Content Cluster
...
```

---

## Priority Action List (Always Include)

End every SEO response with this section:

```
## 🎯 Priority Action List

**Do This First (High Impact, Quick):**
1. [Action]
2. [Action]

**Do This Next (High Impact, More Effort):**
3. [Action]
4. [Action]

**Nice to Have (Lower Priority):**
5. [Action]
```

Order by: impact × ease. Quick wins always first.

---

## Handling Ambiguous Requests

- **Only a URL given**: Run Mode A + Mode C. Ask if they also want keyword research.
- **Only a keyword given**: Run Mode D. Offer to write content around it (Mode B).
- **Raw content pasted**: Run Mode A + Mode B (optimize the content).
- **"Audit my SEO"**: Run all four modes with a brief summary of each.
- **Missing target keyword**: Always ask before proceeding with Mode A or B.

---

## Tone & Format Rules

- Use tables for comparisons and audits
- Use code blocks for rewritten HTML/meta tags
- Use bullet points for lists of 3+ items
- Keep recommendations specific and actionable — never vague ("improve your content")
- Cite character counts for title tags and meta descriptions
- When rewriting content, preserve the user's brand voice unless asked to change it
