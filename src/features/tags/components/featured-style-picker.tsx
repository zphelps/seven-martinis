import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FEATURED_THEMES, FEATURED_ICONS, getFeaturedTheme } from "../lib/featured-themes"

interface FeaturedStylePickerProps {
    theme: string
    icon: string | null
    tagline: string | null
    onThemeChange: (theme: string) => void
    onIconChange: (icon: string | null) => void
    onTaglineChange: (tagline: string) => void
    onTaglineBlur?: () => void
}

export function FeaturedStylePicker({
    theme,
    icon,
    tagline,
    onThemeChange,
    onIconChange,
    onTaglineChange,
    onTaglineBlur,
}: FeaturedStylePickerProps) {
    const activeTheme = getFeaturedTheme(theme)

    return (
        <div className="space-y-3 rounded-md border p-3">
            <div>
                <Label>Featured Style</Label>
                <p className="text-xs text-gray-500">
                    How this tag&apos;s highlighted section looks on the menu.
                </p>
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                    {FEATURED_THEMES.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => onThemeChange(t.key)}
                            className={cn(
                                "rounded-md h-10 border-2 flex items-center justify-center px-1 text-center text-[10px] font-medium leading-tight text-white",
                                t.panelGradientClassName,
                                theme === t.key ? "border-primary ring-2 ring-primary/30" : "border-transparent"
                            )}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs text-gray-500">Icon (optional — falls back to the tag image)</Label>
                <div className="grid grid-cols-6 gap-2">
                    <button
                        type="button"
                        onClick={() => onIconChange(null)}
                        title="Auto (use tag image)"
                        className={cn(
                            "rounded-md h-9 border flex items-center justify-center text-[9px] text-gray-500",
                            !icon ? "border-primary ring-2 ring-primary/30" : "border-input"
                        )}
                    >
                        Auto
                    </button>
                    {Object.entries(FEATURED_ICONS).map(([key, { label, Icon }]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onIconChange(key)}
                            title={label}
                            className={cn(
                                "rounded-md h-9 border flex items-center justify-center",
                                icon === key ? "border-primary ring-2 ring-primary/30" : "border-input"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="tag-tagline" className="text-xs text-gray-500">Tagline</Label>
                <Input
                    id="tag-tagline"
                    value={tagline ?? ""}
                    onChange={(e) => onTaglineChange(e.target.value)}
                    onBlur={onTaglineBlur}
                    placeholder={activeTheme.defaultTagline}
                />
            </div>
        </div>
    )
}
