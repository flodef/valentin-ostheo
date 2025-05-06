# CSS Refactoring Plan for styles.css

## Proposed Structure

1. **Variables & Base Styles**
   - CSS Variables (--colors)
   - Base element styles (body, *, etc.)

2. **Layout & Common Elements**
   - Common section containers (.section-header, .separator)
   - Common buttons (.btn-rdv)
   - Loading states and error messages

3. **Header & Navigation**
   - Header styles
   - Desktop navigation
   - Mobile navigation

4. **Hero Section**
   - Hero container and layout
   - Hero content and text

5. **About Section**
   - About layout
   - About content elements

6. **Soins/Care Section**
   - Cards layout
   - Care details

7. **Meeting/RDV Section**
   - Calendar styles
   - Location cards
   - Booking form

8. **Contact Section**
   - Contact form
   - Contact information

9. **Info Section**
   - Accordion styles
   - Info links

10. **Media Queries**
    - Grouped by breakpoint (992px, 768px, 576px)
    - Organized by component

## Duplications to Resolve
- `.section-header` (lines 180, 1341, etc.)
- `.separator` (lines 193, 262, 1354, etc.)
- Section containers (about-section, soins-section, etc.)
- Button styles (.btn-rdv)
- Media queries for common elements

## Implementation Strategy
1. Create a backup of the original CSS file
2. Refactor each section individually
3. Validate functionality after each section change
4. Consolidate media queries at the end
