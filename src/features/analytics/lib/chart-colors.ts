// Single validated magnitude hue for bars/lines: the app's own brand navy
// (matches --primary / --chart-1 in globals.css). Contrast vs a white card
// surface is ~15.3:1, well clear of the dataviz skill's 3:1 mark floor.
// Per the skill's color-formula rule, ranking one metric across items
// (drinks, tags) is a single-series magnitude encoding — every bar takes the
// same hue rather than spending the identity channel re-encoding rank.
export const CHART_PRIMARY = "#00254C"
export const CHART_PRIMARY_WASH = "#00254C1A" // ~10% wash for area fills

// Documented sequential/ordinal blue ramp (dataviz skill reference palette,
// steps 250/350/450/550/650). Star ratings are ordinal (order is meaning), so
// this ramp's lightness carries the 1-5 order. Lightest step clears the 2:1
// ordinal floor against a white surface.
export const RATING_ORDINAL_STEPS = ["#86b6ef", "#5598e7", "#2a78d6", "#1c5cab", "#104281"]

export const CHART_GRID = "hsl(var(--border))"
export const CHART_AXIS_TEXT = "hsl(var(--muted-foreground))"
export const CHART_TOOLTIP_BG = "hsl(var(--popover))"
export const CHART_TOOLTIP_BORDER = "hsl(var(--border))"
export const CHART_TOOLTIP_TEXT = "hsl(var(--popover-foreground))"
