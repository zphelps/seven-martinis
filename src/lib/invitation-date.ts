const ORDINAL_WORDS = [
    "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh",
    "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth",
    "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth",
    "Nineteenth", "Twentieth", "Twenty-First", "Twenty-Second", "Twenty-Third",
    "Twenty-Fourth", "Twenty-Fifth", "Twenty-Sixth", "Twenty-Seventh",
    "Twenty-Eighth", "Twenty-Ninth", "Thirtieth", "Thirty-First",
];

// eventDate is a Postgres `date` (YYYY-MM-DD); parsed as UTC midnight so the
// displayed day never shifts with the reader's timezone.
export function formatInvitationDate(eventDate: string | null): string | null {
    if (!eventDate) return null;

    const date = new Date(`${eventDate}T00:00:00Z`);
    const weekday = date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
    const month = date.toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });
    const dayWord = ORDINAL_WORDS[date.getUTCDate() - 1];

    return `${weekday}, the ${dayWord} of ${month}`;
}
