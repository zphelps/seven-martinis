"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { InvitationView } from "@/components/invitation/InvitationView";
import { AnimationRegistryItem, Event, EventDetailItem, EventStatus } from "@/types/invitation";
import { toast } from "@/components/ui/use-toast";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";

interface DraftDetailItem {
    id: string;
    key: string;
    value: string;
}

interface DraftAnimation {
    key: string;
    name: string;
    enabled: boolean;
    config: Record<string, any>;
}

export interface InvitationSavePayload {
    title: string;
    event_date: string | null;
    event_time_label: string | null;
    greeting: string | null;
    secret_note: string | null;
    footnote: string | null;
    status: EventStatus;
    animations: { key: string; config: Record<string, any> }[];
    details: { key: string; value: string; sort_order: number }[];
}

interface InvitationEditorProps {
    initialEvent?: Event;
    initialDetails?: EventDetailItem[];
    onSave: (payload: InvitationSavePayload) => Promise<void>;
    saving?: boolean;
}

let tempIdCounter = 0;
function tempId() {
    tempIdCounter += 1;
    return `temp-${tempIdCounter}`;
}

const DEFAULT_GREETING =
    "You are cordially invited to an evening of refined indulgence and clandestine revelry during an exclusive and intoxicatingly elegant event at";

const DEFAULT_FOOTNOTE =
    "Access to Seven Martinis is by invitation only and may be obtained through a concealed entrance on the lower level of the Phelps Residence. Those in the know will find their way...seek where the wood whispers and the panels part.";

const DEFAULT_DETAILS: DraftDetailItem[] = [
    { id: tempId(), key: "Location", value: "Lower level of the Phelps Residence\n10895 Holliday Farms Blvd., Zionsville, IN 46077" },
    { id: tempId(), key: "Access", value: "Upon arrival to the Holliday Farms neighborhood, stop at the gate house and mention you are here for the “Phelps Residence.” Remember, Seven Martinis is a secret." },
    { id: tempId(), key: "Attire", value: "Cocktail attire is often spotted, but it is certainly not required. Dress like you are here for a good drink and an even better story. We’ve seen suits and denim at the same party — both ordered a second round." },
    { id: tempId(), key: "Selection", value: "The Seven Martinis mixologists will serve its Spring Seven menu, featuring exquisite seasonal flavors and craft cocktails, as well as old favorites and new specials." },
];

export function InvitationEditor({ initialEvent, initialDetails = [], onSave, saving = false }: InvitationEditorProps) {
    const [registryLoaded, setRegistryLoaded] = useState(false);

    const [title, setTitle] = useState(initialEvent?.title ?? "");
    const [eventDate, setEventDate] = useState(initialEvent?.event_date ?? "");
    const [eventTimeLabel, setEventTimeLabel] = useState(initialEvent?.event_time_label ?? "");
    const [greeting, setGreeting] = useState(initialEvent ? (initialEvent.greeting ?? "") : DEFAULT_GREETING);
    const [secretNote, setSecretNote] = useState(initialEvent?.secret_note ?? "");
    const [footnote, setFootnote] = useState(initialEvent ? (initialEvent.footnote ?? "") : DEFAULT_FOOTNOTE);
    const [status, setStatus] = useState<EventStatus>(initialEvent?.status ?? "draft");
    const [details, setDetails] = useState<DraftDetailItem[]>(
        initialDetails.length > 0
            ? initialDetails.map((d) => ({ id: d.id, key: d.key, value: d.value }))
            : DEFAULT_DETAILS
    );
    const [animations, setAnimations] = useState<DraftAnimation[]>([]);

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                const response = await fetch("/api/animations");
                const result = await response.json();
                if (response.ok) {
                    const items = result.data as AnimationRegistryItem[];
                    setAnimations(items.map((item) => {
                        const existing = initialEvent?.animations?.find((a) => a.key === item.key);
                        return {
                            key: item.key,
                            name: item.name,
                            enabled: Boolean(existing),
                            config: existing?.config ?? item.default_config,
                        };
                    }));
                }
            } finally {
                setRegistryLoaded(true);
            }
        };

        fetchRegistry();
        // Only ever runs once per mount -- each invitation gets a fresh editor instance.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const previewEvent: Event = {
        id: initialEvent?.id ?? "preview",
        created_at: initialEvent?.created_at ?? new Date(0).toISOString(),
        token: initialEvent?.token ?? "",
        title,
        event_date: eventDate || null,
        event_time_label: eventTimeLabel || null,
        greeting: greeting || null,
        secret_note: secretNote || null,
        footnote: footnote || null,
        animations: animations.filter((a) => a.enabled).map((a) => ({ key: a.key, config: a.config })),
        status,
    };

    const previewDetails: EventDetailItem[] = details
        .filter((d) => d.key.trim() || d.value.trim())
        .map((d, index) => ({
            id: d.id,
            event_id: previewEvent.id,
            key: d.key,
            value: d.value,
            sort_order: index,
        }));

    const updateDetail = (id: string, field: "key" | "value", value: string) => {
        setDetails((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
    };

    const addDetail = () => {
        setDetails((prev) => [...prev, { id: tempId(), key: "", value: "" }]);
    };

    const removeDetail = (id: string) => {
        setDetails((prev) => prev.filter((d) => d.id !== id));
    };

    const moveDetail = (index: number, direction: -1 | 1) => {
        setDetails((prev) => {
            const target = index + direction;
            if (target < 0 || target >= prev.length) return prev;
            const next = [...prev];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const toggleAnimation = (key: string, enabled: boolean) => {
        setAnimations((prev) => prev.map((a) => (a.key === key ? { ...a, enabled } : a)));
    };

    const updateAnimationConfig = (key: string, config: Record<string, any>) => {
        setAnimations((prev) => prev.map((a) => (a.key === key ? { ...a, config } : a)));
    };

    const handleSave = async () => {
        if (!title.trim()) {
            toast({ title: "Title is required", variant: "destructive" });
            return;
        }

        try {
            await onSave({
                title,
                event_date: eventDate || null,
                event_time_label: eventTimeLabel || null,
                greeting: greeting || null,
                secret_note: secretNote || null,
                footnote: footnote || null,
                status,
                animations: animations.filter((a) => a.enabled).map((a) => ({ key: a.key, config: a.config })),
                details: details
                    .filter((d) => d.key.trim())
                    .map((d, index) => ({ key: d.key, value: d.value, sort_order: index })),
            });
            toast({ title: "Invitation saved" });
        } catch (e: any) {
            toast({ title: "Failed to save invitation", description: e.message, variant: "destructive" });
        }
    };

    const publicUrl = initialEvent?.token && typeof window !== "undefined"
        ? `${window.location.origin}/invitation/${initialEvent.token}`
        : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 h-screen overflow-hidden">
            <div className="overflow-y-auto p-6 space-y-6 bg-background">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{initialEvent ? "Edit Invitation" : "New Invitation"}</h1>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                </div>

                {publicUrl && (
                    <div className="flex items-center gap-2">
                        <Input readOnly value={publicUrl} className="text-xs" />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                navigator.clipboard.writeText(publicUrl);
                                toast({ title: "Link copied" });
                            }}
                        >
                            Copy link
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                        <Label>Title (internal label)</Label>
                        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New Year's Eve 2027" />
                    </div>
                    <div className="space-y-2">
                        <Label>Event Date</Label>
                        <Input type="date" value={eventDate ?? ""} onChange={(e) => setEventDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as EventStatus)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label>Time Label</Label>
                        <Input
                            value={eventTimeLabel ?? ""}
                            onChange={(e) => setEventTimeLabel(e.target.value)}
                            placeholder="Eight o'clock in the evening until past midnight*"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Greeting</Label>
                    <Textarea rows={3} value={greeting ?? ""} onChange={(e) => setGreeting(e.target.value)} />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Details</Label>
                        <Button type="button" size="sm" variant="secondary" onClick={addDetail}>
                            <Plus className="w-4 h-4 mr-1" /> Add
                        </Button>
                    </div>
                    {details.map((detail, index) => (
                        <div key={detail.id} className="flex gap-2 items-start border rounded-md p-3">
                            <div className="flex-1 space-y-2">
                                <Input
                                    value={detail.key}
                                    onChange={(e) => updateDetail(detail.id, "key", e.target.value)}
                                    placeholder="Label (e.g. Location)"
                                />
                                <Textarea
                                    rows={2}
                                    value={detail.value}
                                    onChange={(e) => updateDetail(detail.id, "value", e.target.value)}
                                    placeholder="Content"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Button type="button" size="icon" variant="ghost" onClick={() => moveDetail(index, -1)}>
                                    <ArrowUp className="w-4 h-4" />
                                </Button>
                                <Button type="button" size="icon" variant="ghost" onClick={() => moveDetail(index, 1)}>
                                    <ArrowDown className="w-4 h-4" />
                                </Button>
                                <Button type="button" size="icon" variant="ghost" onClick={() => removeDetail(detail.id)}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <Label>Secret Entrance Note (N.B.)</Label>
                    <Textarea rows={3} value={secretNote ?? ""} onChange={(e) => setSecretNote(e.target.value)} />
                </div>

                <div className="space-y-2">
                    <Label>Footnote (N.B.)</Label>
                    <Textarea rows={2} value={footnote ?? ""} onChange={(e) => setFootnote(e.target.value)} />
                </div>

                <div className="space-y-3">
                    <Label>Animations</Label>
                    {!registryLoaded && <p className="text-sm text-muted-foreground">Loading animations...</p>}
                    {animations.map((animation) => (
                        <div key={animation.key} className="border rounded-md p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{animation.name}</span>
                                <Switch
                                    checked={animation.enabled}
                                    onCheckedChange={(checked) => toggleAnimation(animation.key, checked)}
                                />
                            </div>
                            {animation.enabled && (
                                <AnimationConfigFields
                                    config={animation.config}
                                    onChange={(config) => updateAnimationConfig(animation.key, config)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto border-l">
                <InvitationView event={previewEvent} details={previewDetails} />
            </div>
        </div>
    );
}

function AnimationConfigFields({ config, onChange }: { config: Record<string, any>; onChange: (config: Record<string, any>) => void }) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {Object.entries(config).map(([key, value]) => (
                <div key={key} className="space-y-1">
                    <Label className="text-xs capitalize">{key}</Label>
                    {typeof value === "boolean" ? (
                        <Switch checked={value} onCheckedChange={(checked) => onChange({ ...config, [key]: checked })} />
                    ) : (
                        <Input
                            type={typeof value === "number" ? "number" : "text"}
                            value={value}
                            onChange={(e) => onChange({
                                ...config,
                                [key]: typeof value === "number" ? Number(e.target.value) : e.target.value,
                            })}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
