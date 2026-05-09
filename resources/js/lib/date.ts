/**
 * Utility functions for date formatting in Indonesian locale
 */

/**
 * Format date to Indonesian format (e.g., "9 Mei 2026")
 * @param date - Date string, Date object, or null/undefined
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string or fallback
 */
export function formatDate(
    date: string | Date | null | undefined,
    options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleDateString('id-ID', options);
}

/**
 * Format date to short format (e.g., "9 Mei 2026")
 */
export function formatDateShort(date: string | Date | null | undefined): string {
    return formatDate(date, { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Format date to very short format (e.g., "09/05/2026")
 */
export function formatDateNumeric(date: string | Date | null | undefined): string {
    return formatDate(date, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Format date with time (e.g., "9 Mei 2026, 14:30")
 */
export function formatDateTime(
    date: string | Date | null | undefined,
    showSeconds = false
): string {
    return formatDate(date, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...(showSeconds && { second: '2-digit' }),
    });
}

/**
 * Format date with day name (e.g., "Sabtu, 9 Mei 2026")
 */
export function formatDateWithDay(date: string | Date | null | undefined): string {
    return formatDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Format time only (e.g., "14:30")
 */
export function formatTime(date: string | Date | null | undefined): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get relative time (e.g., "2 jam yang lalu", "3 hari yang lalu")
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
    if (!date) return '-';

    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '-';

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
    return `${Math.floor(diffDays / 365)} tahun yang lalu`;
}

/**
 * Parse "YYYY-MM-DD" or ISO string to Date, returns null if invalid
 * Uses local time to avoid timezone issues
 */
export function parseDate(v: string | null | undefined): Date | null {
    if (!v) return null;

    // Split the date string to avoid UTC parsing issues
    // "1990-05-15" -> [1990, 4, 15] (month is 0-indexed)
    const parts = v.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const day = parseInt(parts[2], 10);

        // Create date using local time (not UTC)
        const d = new Date(year, month, day);

        // Validate the date
        if (isNaN(d.getTime()) || d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
            return null;
        }

        // Set time to noon to avoid DST issues
        d.setHours(12, 0, 0, 0);

        return d;
    }

    // Fallback for ISO strings with time
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * Format Date to "YYYY-MM-DD" string for backend
 * Uses local date components to avoid timezone issues
 */
export function toDateString(d: Date | null): string {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}
