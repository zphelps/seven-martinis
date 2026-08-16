import {
    LucideIcon,
    Snowflake,
    Leaf,
    Flower2,
    Sun,
    Star,
    Flame,
    Martini,
    Wine,
    Sparkles,
    Settings,
} from "lucide-react"

export interface FeaturedTheme {
    key: string
    label: string
    panelGradientClassName: string
    panelBorderClassName: string
    subheadingClassName: string
    bodyMutedClassName: string
    numberBadgeBoxClassName: string
    numberBadgeTextClassName: string
    numberOutlineBadgeClassName: string
    circleIconBoxClassName: string
    circleIconTextClassName: string
    tagChipClassName: string
    buttonClassName: string
    buttonDisabledClassName: string
    skipTextClassName: string
    inputClassName: string
    defaultIcon: LucideIcon
    defaultTagline: string
}

export const FEATURED_THEMES: FeaturedTheme[] = [
    {
        key: "winter",
        label: "Winter Frost",
        panelGradientClassName: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900",
        panelBorderClassName: "border-blue-900/50",
        subheadingClassName: "text-blue-200/70",
        bodyMutedClassName: "text-blue-100/60",
        numberBadgeBoxClassName: "bg-blue-400/20 border border-blue-300/30",
        numberBadgeTextClassName: "text-blue-200",
        numberOutlineBadgeClassName: "border-blue-300/30 text-blue-200 bg-blue-400/10",
        circleIconBoxClassName: "bg-blue-400/20 border-blue-300/30",
        circleIconTextClassName: "text-blue-300",
        tagChipClassName: "bg-white/10 border border-white/20 text-blue-100",
        buttonClassName: "bg-blue-500 hover:bg-blue-400 shadow-blue-500/20",
        buttonDisabledClassName: "bg-blue-900/50 text-blue-300/50",
        skipTextClassName: "text-blue-200/60 hover:text-white hover:bg-white/10",
        inputClassName: "bg-white/10 border-blue-300/30 text-white placeholder:text-blue-200/30 focus:border-blue-400 focus:ring-blue-400/20",
        defaultIcon: Snowflake,
        defaultTagline: "Seasonal favorites to warm your spirit",
    },
    {
        key: "autumn",
        label: "Autumn Harvest",
        panelGradientClassName: "bg-gradient-to-br from-stone-900 via-orange-950 to-stone-900",
        panelBorderClassName: "border-orange-900/50",
        subheadingClassName: "text-orange-200/70",
        bodyMutedClassName: "text-orange-100/60",
        numberBadgeBoxClassName: "bg-orange-400/20 border border-orange-300/30",
        numberBadgeTextClassName: "text-orange-200",
        numberOutlineBadgeClassName: "border-orange-300/30 text-orange-200 bg-orange-400/10",
        circleIconBoxClassName: "bg-orange-400/20 border-orange-300/30",
        circleIconTextClassName: "text-orange-300",
        tagChipClassName: "bg-white/10 border border-white/20 text-orange-100",
        buttonClassName: "bg-orange-500 hover:bg-orange-400 shadow-orange-500/20",
        buttonDisabledClassName: "bg-orange-900/50 text-orange-300/50",
        skipTextClassName: "text-orange-200/60 hover:text-white hover:bg-white/10",
        inputClassName: "bg-white/10 border-orange-300/30 text-white placeholder:text-orange-200/30 focus:border-orange-400 focus:ring-orange-400/20",
        defaultIcon: Leaf,
        defaultTagline: "Warm spices and harvest classics",
    },
    {
        key: "spring",
        label: "Spring Bloom",
        panelGradientClassName: "bg-gradient-to-br from-emerald-950 via-green-950 to-emerald-900",
        panelBorderClassName: "border-emerald-900/50",
        subheadingClassName: "text-emerald-200/70",
        bodyMutedClassName: "text-emerald-100/60",
        numberBadgeBoxClassName: "bg-emerald-400/20 border border-emerald-300/30",
        numberBadgeTextClassName: "text-emerald-200",
        numberOutlineBadgeClassName: "border-emerald-300/30 text-emerald-200 bg-emerald-400/10",
        circleIconBoxClassName: "bg-emerald-400/20 border-emerald-300/30",
        circleIconTextClassName: "text-emerald-300",
        tagChipClassName: "bg-white/10 border border-white/20 text-emerald-100",
        buttonClassName: "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20",
        buttonDisabledClassName: "bg-emerald-900/50 text-emerald-300/50",
        skipTextClassName: "text-emerald-200/60 hover:text-white hover:bg-white/10",
        inputClassName: "bg-white/10 border-emerald-300/30 text-white placeholder:text-emerald-200/30 focus:border-emerald-400 focus:ring-emerald-400/20",
        defaultIcon: Flower2,
        defaultTagline: "Fresh, bright, and in full bloom",
    },
    {
        key: "summer",
        label: "Summer Sunset",
        panelGradientClassName: "bg-gradient-to-br from-purple-950 via-rose-950 to-orange-900",
        panelBorderClassName: "border-rose-900/50",
        subheadingClassName: "text-rose-200/70",
        bodyMutedClassName: "text-rose-100/60",
        numberBadgeBoxClassName: "bg-rose-400/20 border border-rose-300/30",
        numberBadgeTextClassName: "text-rose-200",
        numberOutlineBadgeClassName: "border-rose-300/30 text-rose-200 bg-rose-400/10",
        circleIconBoxClassName: "bg-rose-400/20 border-rose-300/30",
        circleIconTextClassName: "text-rose-300",
        tagChipClassName: "bg-white/10 border border-white/20 text-rose-100",
        buttonClassName: "bg-rose-500 hover:bg-rose-400 shadow-rose-500/20",
        buttonDisabledClassName: "bg-rose-900/50 text-rose-300/50",
        skipTextClassName: "text-rose-200/60 hover:text-white hover:bg-white/10",
        inputClassName: "bg-white/10 border-rose-300/30 text-white placeholder:text-rose-200/30 focus:border-rose-400 focus:ring-rose-400/20",
        defaultIcon: Sun,
        defaultTagline: "Cool sips for hot summer nights",
    },
    {
        key: "noir",
        label: "Classic Noir",
        panelGradientClassName: "bg-gradient-to-br from-black via-neutral-900 to-black",
        panelBorderClassName: "border-yellow-900/50",
        subheadingClassName: "text-yellow-200/70",
        bodyMutedClassName: "text-yellow-100/60",
        numberBadgeBoxClassName: "bg-yellow-400/20 border border-yellow-300/30",
        numberBadgeTextClassName: "text-yellow-200",
        numberOutlineBadgeClassName: "border-yellow-300/30 text-yellow-200 bg-yellow-400/10",
        circleIconBoxClassName: "bg-yellow-400/20 border-yellow-300/30",
        circleIconTextClassName: "text-yellow-300",
        tagChipClassName: "bg-white/10 border border-white/20 text-yellow-100",
        buttonClassName: "bg-yellow-600 hover:bg-yellow-500 shadow-yellow-600/20",
        buttonDisabledClassName: "bg-yellow-900/50 text-yellow-300/50",
        skipTextClassName: "text-yellow-200/60 hover:text-white hover:bg-white/10",
        inputClassName: "bg-white/10 border-yellow-300/30 text-white placeholder:text-yellow-200/30 focus:border-yellow-400 focus:ring-yellow-400/20",
        defaultIcon: Star,
        defaultTagline: "Our most requested favorites",
    },
    {
        key: "crimson",
        label: "Crimson Reserve",
        panelGradientClassName: "bg-gradient-to-br from-zinc-950 via-red-950 to-zinc-900",
        panelBorderClassName: "border-red-900/50",
        subheadingClassName: "text-red-200/70",
        bodyMutedClassName: "text-red-100/60",
        numberBadgeBoxClassName: "bg-red-400/20 border border-red-300/30",
        numberBadgeTextClassName: "text-red-200",
        numberOutlineBadgeClassName: "border-red-300/30 text-red-200 bg-red-400/10",
        circleIconBoxClassName: "bg-red-400/20 border-red-300/30",
        circleIconTextClassName: "text-red-300",
        tagChipClassName: "bg-white/10 border border-white/20 text-red-100",
        buttonClassName: "bg-red-600 hover:bg-red-500 shadow-red-600/20",
        buttonDisabledClassName: "bg-red-900/50 text-red-300/50",
        skipTextClassName: "text-red-200/60 hover:text-white hover:bg-white/10",
        inputClassName: "bg-white/10 border-red-300/30 text-white placeholder:text-red-200/30 focus:border-red-400 focus:ring-red-400/20",
        defaultIcon: Flame,
        defaultTagline: "Bold pours for a special occasion",
    },
]

export function getFeaturedTheme(themeKey: string | null | undefined): FeaturedTheme {
    return FEATURED_THEMES.find((theme) => theme.key === themeKey) ?? FEATURED_THEMES[0]
}

export const FEATURED_ICONS: Record<string, { label: string; Icon: LucideIcon }> = {
    snowflake: { label: "Snowflake", Icon: Snowflake },
    leaf: { label: "Leaf", Icon: Leaf },
    flower: { label: "Flower", Icon: Flower2 },
    sun: { label: "Sun", Icon: Sun },
    star: { label: "Star", Icon: Star },
    flame: { label: "Flame", Icon: Flame },
    martini: { label: "Martini", Icon: Martini },
    wine: { label: "Wine", Icon: Wine },
    sparkles: { label: "Sparkles", Icon: Sparkles },
    gear: { label: "Gear", Icon: Settings },
}

export function resolveFeaturedIcon(iconKey: string | null | undefined): LucideIcon | null {
    if (!iconKey) return null
    return FEATURED_ICONS[iconKey]?.Icon ?? null
}
