export function getRelativeTime(date: string | Date | undefined, lang: string = 'en') {
    if (!date) return "";

    const timeMs = new Date(date).getTime();
    const nowMs = new Date().getTime();
    const diffInSeconds = Math.floor((timeMs - nowMs) / 1000);

    const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
        { unit: 'year', seconds: 31536000 },
        { unit: 'month', seconds: 2592000 },
        { unit: 'week', seconds: 604800 },
        { unit: 'day', seconds: 86400 },
        { unit: 'hour', seconds: 3600 },
        { unit: 'minute', seconds: 60 },
        { unit: 'second', seconds: 1 },
    ];

    const rtf = new Intl.RelativeTimeFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
        numeric: 'auto',
    });

    for (const { unit, seconds } of units) {
        if (Math.abs(diffInSeconds) >= seconds || unit === 'second') {
            return rtf.format(Math.round(diffInSeconds / seconds), unit);
        }
    }
    return "";
}