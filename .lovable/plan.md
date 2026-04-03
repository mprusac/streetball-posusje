

## Problem
The "Amateri" card at the bottom spans `md:col-span-2` (full width of both columns), making it look too wide and stretched on laptop screens.

## Solution
Remove `md:col-span-2` so the card takes up only one column width, and center it below the other two cards using a wrapper or grid utility.

### Changes in `src/components/Prizes.tsx`
- **Line 111**: Replace `md:col-span-2` with `md:col-span-1` and add `md:mx-auto` to center it
- Wrap the bottom card in a full-width container that centers it, or use `md:col-start-1 md:col-end-3` with inner max-width constraint
- Best approach: Keep `md:col-span-2` but add `max-w-md mx-auto` to constrain the card's inner width while staying centered across both columns

### Specific change
Line 111: Add `max-w-md mx-auto w-full` to the className so the card stays centered but doesn't stretch to fill the full 2-column width.

