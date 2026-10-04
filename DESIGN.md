---
name: Home design system
description: A Braun-inspired appliance fascia for a personal site, Markdown writing, and local-only controls.
colors:
  palette-frost: '#FFF5F5'
  palette-sun: '#FFC62B'
  palette-orange: '#FE6900'
  palette-red: '#C82000'
  palette-chocolate: '#261914'
  background: '#F3F4F2'
  card: '#FCFCFA'
  muted: '#E9EAE7'
  muted-foreground: '#62635E'
  foreground: '#261914'
  primary: '#261914'
  primary-foreground: '#FCFCFA'
  secondary: '#FFC62B'
  destructive: '#C82000'
  border: '#B9BCB4'
  input: '#D6D8D1'
  ring: '#261914'
  surface-highlight: '#FFFFFF'
  signal: '#FE6900'
typography:
  display:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 'clamp(50px, 6.2vw, 82px)'
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: '-0.04em'
  headline:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 'clamp(36px, 5vw, 62px)'
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: '-0.04em'
  title:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '24px'
    fontWeight: 500
    letterSpacing: '-0.025em'
  body:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '16px'
    lineHeight: 1.7
  label:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '14px'
    fontWeight: 500
  subheading:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '19px'
    fontWeight: 500
  record:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '15px'
    lineHeight: 1.75
  support:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '13px'
    lineHeight: 1.6
  code:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"
    fontSize: '12px'
    lineHeight: 1.7
  reading-code:
    fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"
    fontSize: '13px'
    lineHeight: 1.7
  fascia-monogram:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '64px'
    fontWeight: 700
  fascia-monogram-mobile:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '54px'
    fontWeight: 700
  fascia-title:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '34px'
    fontWeight: 500
  fascia-title-mobile:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '29px'
    fontWeight: 500
  fascia-body:
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: '17px'
    lineHeight: 1.8
rounded:
  panel: '0.1875rem'
  circular: '50%'
spacing:
  compact: '12px'
  control-gap: '16px'
  section-gap: '24px'
  section: '40px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.primary-foreground}'
    rounded: '{rounded.panel}'
    padding: '8px 20px'
  button-outline:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.panel}'
    padding: '8px 20px'
  button-secondary:
    backgroundColor: '{colors.secondary}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.panel}'
    padding: '8px 20px'
  button-ghost:
    backgroundColor: 'transparent'
    textColor: '{colors.foreground}'
    rounded: '{rounded.panel}'
    padding: '8px 20px'
  button-destructive:
    backgroundColor: '{colors.card}'
    textColor: '{colors.destructive}'
    rounded: '{rounded.panel}'
    padding: '8px 20px'
  button-link:
    textColor: '{colors.foreground}'
    rounded: '{rounded.panel}'
    padding: '8px 20px'
  field:
    backgroundColor: '{colors.card}'
    rounded: '{rounded.panel}'
    padding: '12px 14px'
  panel:
    backgroundColor: '{colors.card}'
    rounded: '{rounded.panel}'
---

# Design System: Home design system

## Overview

**Creative North Star: "The Braun appliance fascia"**

The settled identity comes from real Braun appliances and Dieter Rams: neutral enamel surfaces, chocolate lettering, machined rules, circular physical controls and restrained raised/recessed depth. Reading surfaces stay open and typographic; operational surfaces concentrate controls into lightly rounded panels. No image assets are necessary for this pinned material grammar: the vents, dial and indicator lights are built in CSS.

**Source authority:** `src/styles/tokens.css` is the single normative source for semantic tokens. `src/styles/appliance.css` supplies material and layout rules; `src/index.css` maps those tokens to Tailwind. Frontmatter is a machine-readable documentation snapshot, not independent CSS authority. Update it and `.impeccable/design.json` from the implementation, never the reverse. Aliases above are resolved to literal colors for portability; the CSS retains their relationships. Declared but currently unused `surface-recessed` and `alert-surface` are not promoted into this snapshot. Sidecar tonal ramps are synthesized preview metadata, not implemented CSS scales.

**Key Characteristics:**

- Neutral enamel panels with crisp borders.
- Circular icon controls and minimally rounded text controls.
- Helvetica-led hierarchy with generous reading measure.
- Mechanical depth communicates control state.

The personal site combines homepage `/`, CV `/cv`, writing `/blog`, and Markdown articles (Read). Those personal pages share navigation and may link to one another. Demo entry `/login`, admin `/admin` (Operate), and showcase `/design-system` (Read/Experience) remain independent, without links to the personal site or each other. All share components, tokens, and structural `PageFrame`. The demo is local only: no server or authentication; entry is an in-memory gate. The CV is extracted from the supplied original PDF; preserve its factual content.

## Colors

The exact Never-Setting-Sun palette is **by Halifax**, [COLOURlovers palette 3060721](https://www.colourlovers.com/palette/3060721/Never-Setting-Sun), **CC-BY**. Its five colors and attribution were verified from the supplied screenshot; they are not provisional. Surface whites and grays are derived semantic neutrals, not additional Halifax colors.

### Primary

- **Chocolate:** foreground, primary actions and focus rings.

### Secondary

- **Sun:** secondary controls, checked switches and text selection.

### Tertiary

- **Orange:** active indicator lights, not the default button fill.
- **Red:** destructive text/borders, alert states and the wordmark dot.
- **Frost:** palette specimen and declared alert-surface alias; not a general panel background.

### Neutral

- **Background / card / muted:** chassis, raised enamel and inset tracks or selected rows.
- **Muted foreground:** supporting copy and inactive indicators.
- **Border / input:** dividers and strokes; unchecked switch track.
- **Surface highlight:** white edge highlights in material shadows.

**The Enamel and Signal Rule.** Keep the broad surfaces neutral; use the palette's saturated colors for the implemented controls and indicators. The showcase's full-color swatches are deliberate specimens.

## Typography

Helvetica Neue, Helvetica, Arial and sans-serif form the display/body stack. SFMono-Regular, Consolas, Liberation Mono and monospace serve code. The hierarchy is role-based, not a geometric modular scale.

- **Identity fascia:** the user-selected wide-fascia composition replaces the old oversized CV name and vented identity tile. Its `gu.` monogram is 64px/700 (54px on mobile), title 34px/500 (29px on mobile), and introduction 17px/1.8 (15px on mobile). This compact precision-appliance typography is specific to the accepted identity plate; article and component-reference scales remain unchanged.
- **Headline / title:** page headings use the headline ramp; section and detail headings use the title role. CV employer names are smaller (19px, weight 500).
- **Body:** introductions use the body role with a 65ch measure. CV summary and record copy use line-height 1.75; record copy is 15px and up to 75ch. Mobile summary copy becomes 15px.
- **Labels:** field labels are 14px/500; helper/error text is 13px/1.6. Page-shell labels are 14px, becoming 12px on mobile. Status, credits and code use 12px. Button/tab labels use 14px/20px, weight 500.
- **Writing:** archive titles and article section headings reuse the 24px title step; article subheadings reuse the 19px employer/subheading step. Article body is 16px with 1.85 leading and a 72ch maximum measure. Descriptions use 16px; dates use the existing 13px supporting-copy step. Reading code uses the 13px step in the existing monospace family.

Headings balance their wrapping; paragraphs use pretty wrapping. Type is sentence case rather than a system-wide uppercase label treatment.

## Layout

The centered shell caps at 1200px with 48px side gutters. The topbar is at least 106px tall; page padding is 68px above and 80px below. Recurring internal gaps are 12–24px, with larger section separation around 40px. Panels have contextual padding rather than one universal inset.

- **Up to 1000px:** shell gutters become 32px. CV opening narrows from a 328px plate column/68px gap to 260px/40px. The admin's 320px detail column drops below the service list, with its contents arranged in two columns.
- **Up to 700px:** gutters become 20px; the article/demo topbar wraps and shrinks to an 88px minimum. Page padding becomes 40px/56px. CV record rows, education/community, detail and showcase sections stack. The accepted identity fascia remains visible on mobile; its controls wrap and its rotary selector centers below the actions. Service rows retain their controls while redundant inline status text hides. Palette specimens change from five to three columns; the footer stacks.
- **Reading versus operation:** the CV uses dated rows separated by rules, not a stack of cards. The demo entry is capped at 650px; the showcase pairs a 230px explanatory column with specimens until mobile stacking.
- **Writing:** articles center within 760px; their prose is capped at 72ch. Archive rows reuse the CV's 178px date column and ruled-record grammar, stacking on mobile. Tables and code scroll horizontally inside keyboard-focusable regions, never across the page.

The body has a 320px minimum width. These are the custom CSS breakpoints, not Tailwind's default breakpoint names.

## Elevation & Depth

Depth is structural: subtle panel lift, raised keys, inset switch/tab tracks, fine white edge highlights and debossed text controls. This world deliberately uses shadows and borders; neither is prohibited.

- **Panel:** `--shadow-panel` combines a short contact shadow and a low-opacity broad shadow.
- **Control:** `--shadow-control` combines an inset white top edge and a short exterior shadow.
- **Pressed:** `--shadow-pressed` reverses the material cue to an inset shadow with a white lower edge.
- **Primary:** the dark key uses its own translucent light edge and darker contact shadow. The switch thumb retains Tailwind's small shadow.

Exact shadow values are recorded in the sidecar and originate in CSS.

**The Physical State Rule.** Raised controls depress by 1px on activation or `aria-pressed="true"`; flat controls keep no shadow. An active tab remains a raised key in an inset track.

## Shapes

Panels, fields, text buttons and tab keys share the small panel radius. Tailwind's `rounded-sm`, `rounded-md` and `rounded-lg` all map to that same semantic radius here. Icon buttons are circles (48px or 64px); indicator dots and the decorative dial are circular too. Switch tracks are pill-shaped because they contain a travelling circular thumb—not a reason to round every panel into a pill. Borders are generally 1px.

## Components

The shadcn-generated Radix sources are customized to the appliance material. `Button` uses Radix Slot for `asChild`; tabs, switches and tooltips retain Radix semantics. Typed variants use `cva`; the standard `cn` combines `clsx` with `tailwind-merge`. `Panel`, `Status`, `IconButton` and `PageHeading` are the local reusable layer.

- **Buttons:** default is chocolate, outline is raised enamel, secondary is Sun, ghost is transparent with muted hover fill, destructive is enamel with red text/stroke, and link is underlined. Default/small buttons have a 44px minimum height; large buttons 52px. Horizontal padding is 20px/12px/24px respectively. Icon sizes are 48px/64px with 16px/20px icons. `IconButton` supplies an accessible label and tooltip.
- **Panels:** raised panels use card fill, border and panel shadow; recessed panels use muted fill and no shadow. Panel-heading insets are 22px/26px; detail and entry panels use their own responsive insets.
- **Fields:** 48px minimum height, card fill, inset contact shadow and the shared radius. Invalid fields get a destructive border; helper/error copy accompanies examples. Disabled fields use 50% opacity; buttons and tab keys use 45%.
- **Tabs:** default is an inset muted track (48px minimum height) with 40px minimum-height keys. Active keys gain card fill, border and raised shadow. The line variant removes the track fill/border; it does not introduce a new visual world.
- **Switches:** 48×28px inset track; 20px card-colored thumb. Checked uses Sun fill and 24px thumb translation; unchecked translates 2px. The exposed `size` prop currently does not alter geometry.
- **Page shells:** the personal `gu.` wordmark links to the personal homepage, alongside Home/CV/Blog navigation. Active personal links have a chocolate underline. Admin uses the non-interactive `home.` label, and the showcase uses non-interactive `form.`. Neither links to the personal site. Headers/footers stay relevant to their own surface; entry/exit remain in the admin flow.
- **Markdown:** GFM is rendered with the shared typography, muted code/table surfaces, crisp rules, and existing radius. Raw HTML is displayed as text, not executed. Task lists have real labels; code/table overflow regions have keyboard focus. No prose introduces extra colors or unrelated card styling.
- **Status / signature material:** orange means on, muted means off, red means alert; text accompanies the dot. The identity plate's CSS vents, dial and lamp are decorative, not interactive controls.

Control shadow and transform transitions use 160ms with `--ease-mechanical`; background color uses 160ms with the CSS default ease. Hover darkens controls via brightness 0.97. Switch-thumb transform uses Tailwind's 150ms `cubic-bezier(0.4, 0, 0.2, 1)` default. Tabs have no added custom transition. Reduced motion disables all animations/transitions and restores automatic scroll behavior.

Global visible focus is a 2px chocolate outline offset by 4px. Preserve the skip link, keyboard operation, meaningful labels and focus transfer to main after route changes; material state is not a substitute for accessible state.

## Do's and Don'ts

### Do:

- **Do** take semantic values from `src/styles/tokens.css` and use its Tailwind mappings.
- **Do** preserve circular physical icon controls and minimally rounded panels.
- **Do** pair indicator color with text and preserve visible keyboard focus.
- **Do** keep the original CV facts, demo-only labeling and Halifax attribution intact.

### Don't:

- **Don't** substitute a different palette or present the verified colors as provisional.
- **Don't** flatten away the material shadows or turn every panel into a pill.
- **Don't** introduce credential collection or imply these local controls administer a real server.
- **Don't** treat documentation snapshots or synthesized sidecar preview ramps as new CSS tokens.
