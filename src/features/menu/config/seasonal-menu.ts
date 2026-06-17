/**
 * Seasonal menu configuration.
 *
 * To switch menus, change ACTIVE_SEASONAL_MENU to "winter" or "summer".
 * Tag drinks in the dashboard with the matching tag ("Winter" or "Summer").
 */

export type SeasonalMenuKey = "winter" | "summer";

/** Flip this when rotating seasonal menus */
export const ACTIVE_SEASONAL_MENU: SeasonalMenuKey = "summer";

export interface SeasonalMenuConfig {
    tag: string;
    title: string;
    subtitle: string;
    headerImage?: string;
    gradient: string;
    accentText: string;
    cardBg: string;
    cardBorder: string;
    cardHoverBg: string;
    cardHoverBorder: string;
    numberBadgeBg: string;
    numberBadgeBorder: string;
    numberBadgeText: string;
    drinkNameText: string;
    drinkDescriptionText: string;
}

export const SEASONAL_MENUS: Record<SeasonalMenuKey, SeasonalMenuConfig> = {
    winter: {
        tag: "Winter",
        title: "Seven For Winter",
        subtitle: "Seasonal favorites to warm your spirit",
        headerImage: "/winter.png",
        gradient: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900",
        accentText: "text-blue-200/70",
        cardBg: "bg-white/10 backdrop-blur-md",
        cardBorder: "border-white/20",
        cardHoverBg: "hover:bg-white/15",
        cardHoverBorder: "hover:border-white/30",
        numberBadgeBg: "bg-blue-400/20",
        numberBadgeBorder: "border-blue-300/30",
        numberBadgeText: "text-blue-200",
        drinkNameText: "text-white",
        drinkDescriptionText: "text-blue-100/60",
    },
    summer: {
        tag: "Summer",
        title: "Seven For Summer",
        subtitle: "Seasonal favorites to brighten your evening",
        headerImage: "/summer.png",
        gradient: "bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900",
        accentText: "text-amber-200/70",
        cardBg: "bg-white/10 backdrop-blur-md",
        cardBorder: "border-white/20",
        cardHoverBg: "hover:bg-white/15",
        cardHoverBorder: "hover:border-white/30",
        numberBadgeBg: "bg-amber-400/20",
        numberBadgeBorder: "border-amber-300/30",
        numberBadgeText: "text-amber-200",
        drinkNameText: "text-white",
        drinkDescriptionText: "text-amber-100/60",
    },
};

export interface SeasonalDialogTheme {
    sheet: string;
    closeButton: string;
    successIconBg: string;
    successIcon: string;
    heading: string;
    bodyText: string;
    tipIconBg: string;
    tipIcon: string;
    tipButton: string;
    ghostButton: string;
    badge: string;
    tagBadge: string;
    footer: string;
    label: string;
    input: string;
    orderButtonActive: string;
    orderButtonInactive: string;
}

export const SEASONAL_DIALOG_THEMES: Record<SeasonalMenuKey, SeasonalDialogTheme> = {
    winter: {
        sheet: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-blue-900/50",
        closeButton: "bg-white/20 hover:bg-white/30 text-white border border-white/30",
        successIconBg: "bg-blue-400/20 border-blue-300/30",
        successIcon: "text-blue-300",
        heading: "text-white",
        bodyText: "text-blue-200/80",
        tipIconBg: "bg-blue-400/20 border-blue-300/30",
        tipIcon: "text-blue-300",
        tipButton: "bg-blue-500 hover:bg-blue-400 text-white",
        ghostButton: "text-blue-200/60 hover:text-white hover:bg-white/10",
        badge: "border-blue-300/30 text-blue-200 bg-blue-400/10",
        tagBadge: "bg-white/10 border border-white/20 text-blue-100",
        footer: "bg-slate-900/80 backdrop-blur-sm border-blue-900/50",
        label: "text-blue-200/70",
        input: "bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200/30 focus:border-blue-400 focus:ring-blue-400/20",
        orderButtonActive: "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20",
        orderButtonInactive: "bg-blue-900/50 text-blue-300/50",
    },
    summer: {
        sheet: "bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900 border-amber-900/50",
        closeButton: "bg-white/20 hover:bg-white/30 text-white border border-white/30",
        successIconBg: "bg-amber-400/20 border-amber-300/30",
        successIcon: "text-amber-300",
        heading: "text-white",
        bodyText: "text-amber-200/80",
        tipIconBg: "bg-amber-400/20 border-amber-300/30",
        tipIcon: "text-amber-300",
        tipButton: "bg-amber-500 hover:bg-amber-400 text-white",
        ghostButton: "text-amber-200/60 hover:text-white hover:bg-white/10",
        badge: "border-amber-300/30 text-amber-200 bg-amber-400/10",
        tagBadge: "bg-white/10 border border-white/20 text-amber-100",
        footer: "bg-amber-950/80 backdrop-blur-sm border-amber-900/50",
        label: "text-amber-200/70",
        input: "bg-white/10 border-amber-300/30 text-white placeholder:text-amber-200/30 focus:border-amber-400 focus:ring-amber-400/20",
        orderButtonActive: "bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20",
        orderButtonInactive: "bg-amber-900/50 text-amber-300/50",
    },
};

export function getActiveSeasonalMenu(): SeasonalMenuConfig {
    return SEASONAL_MENUS[ACTIVE_SEASONAL_MENU];
}

export function getActiveSeasonalDialogTheme(): SeasonalDialogTheme {
    return SEASONAL_DIALOG_THEMES[ACTIVE_SEASONAL_MENU];
}

export function isActiveSeasonalDrink(tags?: string[]): boolean {
    return tags?.includes(getActiveSeasonalMenu().tag) ?? false;
}
