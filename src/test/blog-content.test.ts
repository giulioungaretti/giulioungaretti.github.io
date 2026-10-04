import { describe, expect, it } from 'vitest'
import { isCalendarDate, parsePost, publishPosts } from '@/lib/blog-content'

function source({
  date = '2026-04-25',
  extra = '',
  body = 'A real Markdown body.',
} = {}) {
  return `---\ntitle: "A post"\ndate: ${date}\ndescription: "A short description."\ntags: [software, software]\n${extra}\n---\n\n${body}`
}

describe('Markdown publication contract', () => {
  it('parses metadata, keeps Markdown, and derives stable original URLs', () => {
    expect(parsePost(source(), '2026-04-25-a-post.md')).toMatchObject({
      slug: 'a-post',
      date: '2026-04-25',
      tags: ['software'],
      legacyPath: '/2026/04/a-post/',
      readingMinutes: 1,
      markdown: 'A real Markdown body.',
    })
  })
  it('infers the date from the filename when frontmatter omits it', () => {
    const text = source().replace('date: 2026-04-25\n', '')
    expect(parsePost(text, '2026-04-25-a-post.md').date).toBe('2026-04-25')
  })
  it('excludes drafts and future bodies before the browser module is generated', () => {
    const published = publishPosts(
      {
        '2026-04-25-visible.md': source(),
        '2026-04-26-hidden.md': source({
          date: '2026-04-26',
          extra: 'draft: true',
          body: 'PRIVATE_DRAFT_FIXTURE',
        }),
        '2026-10-05-later.md': source({
          date: '2026-10-05',
          body: 'FUTURE_BODY_FIXTURE',
        }),
      },
      '2026-10-04',
    )
    expect(published.map((post) => post.slug)).toEqual(['visible'])
    expect(JSON.stringify(published)).not.toMatch(
      /PRIVATE_DRAFT_FIXTURE|FUTURE_BODY_FIXTURE/,
    )
  })
  it('publishes on the UTC calendar day and orders recent posts first', () => {
    const files = {
      '2026-04-25-first.md': source(),
      '2026-10-04-second.md': source({ date: '2026-10-04' }),
    }
    expect(publishPosts(files, '2026-10-04').map((post) => post.slug)).toEqual([
      'second',
      'first',
    ])
    expect(publishPosts(files, '2026-10-03').map((post) => post.slug)).toEqual([
      'first',
    ])
  })
  it.each(['2026-02-30', '2025-02-29', '2026-13-01', '2026-1-01'])(
    'rejects invalid calendar date %s',
    (date) => {
      expect(isCalendarDate(date)).toBe(false)
    },
  )
  it('supports valid leap dates', () => {
    expect(isCalendarDate('2024-02-29')).toBe(true)
  })
  it('fails clearly for filename/date disagreement, missing metadata, and empty bodies', () => {
    expect(() =>
      parsePost(source({ date: '2026-04-26' }), '2026-04-25-post.md'),
    ).toThrow(/must match the filename/)
    expect(() => parsePost('No metadata', '2026-04-25-post.md')).toThrow(
      /missing YAML frontmatter/,
    )
    expect(() => parsePost(source({ body: '' }), '2026-04-25-post.md')).toThrow(
      /post body is empty/,
    )
  })
  it('rejects duplicate and unsafe URL slugs instead of overwriting pages', () => {
    expect(() =>
      publishPosts(
        {
          '2026-04-25-one.md': source({ extra: 'slug: same' }),
          '2026-04-26-two.md': source({
            date: '2026-04-26',
            extra: 'slug: same',
          }),
        },
        '2026-10-04',
      ),
    ).toThrow(/Duplicate post slug/)
    expect(() =>
      parsePost(source({ extra: 'slug: ../../escape' }), '2026-04-25-post.md'),
    ).toThrow(/slug/)
  })
  it('rejects misspelled frontmatter fields and missing descriptions', () => {
    expect(() =>
      parsePost(source({ extra: 'drfat: true' }), '2026-04-25-post.md'),
    ).toThrow(/Unrecognized key/)
    expect(() =>
      parsePost(
        source().replace('description: "A short description."\n', ''),
        '2026-04-25-post.md',
      ),
    ).toThrow(/description/)
  })
  it('rejects an invalid publication cutoff', () => {
    expect(() => publishPosts({}, 'tomorrow')).toThrow(/Publication cutoff/)
  })
  it('identifies the source file for malformed YAML', () => {
    expect(() =>
      parsePost('---\ntitle: "Unclosed\n---\n\nBody', '2026-04-25-broken.md'),
    ).toThrow(/2026-04-25-broken.md: invalid YAML/)
  })
})
