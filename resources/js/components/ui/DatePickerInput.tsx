import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerInputProps {
    label?: string;
    error?: string;
    selected?: Date | null;
    onChange: (date: Date | null) => void;
    color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
    inputSize?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
    placeholder?: string;
    dateFormat?: string;
    showTimeSelect?: boolean;
    timeIntervals?: number;
    minDate?: Date;
    maxDate?: Date;
    isClearable?: boolean;
    disabled?: boolean;
    name?: string;
    id?: string;
    showMonthYearPicker?: boolean;
    showYearPicker?: boolean;
    locale?: string;
    inline?: boolean;
    yearRange?: { start: number; end: number };
}

// ── Months list ────────────────────────────────────────────
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// ── Custom header with month/year dropdowns ────────────────
function CustomHeader({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    yearStart,
    yearEnd,
}: {
    date: Date;
    changeYear: (year: number) => void;
    changeMonth: (month: number) => void;
    decreaseMonth: () => void;
    increaseMonth: () => void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
    yearStart: number;
    yearEnd: number;
}) {
    const years: number[] = [];
    for (let y = yearEnd; y >= yearStart; y--) {
        years.push(y);
    }

    return (
        <div className="flex items-center justify-between gap-2 px-2 py-1">
            <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="btn btn-ghost btn-xs btn-circle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className="flex items-center gap-1">
                <select
                    className="select select-xs select-bordered font-semibold"
                    value={date.getMonth()}
                    onChange={(e) => changeMonth(Number(e.target.value))}
                >
                    {MONTHS.map((month, i) => (
                        <option key={month} value={i}>{month}</option>
                    ))}
                </select>

                <select
                    className="select select-xs select-bordered font-semibold"
                    value={date.getFullYear()}
                    onChange={(e) => changeYear(Number(e.target.value))}
                >
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="btn btn-ghost btn-xs btn-circle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────

function DatePickerInput({
    label,
    error,
    selected,
    onChange,
    color,
    inputSize,
    className = '',
    placeholder,
    dateFormat = 'dd/MM/yyyy',
    showTimeSelect,
    timeIntervals = 15,
    minDate,
    maxDate,
    isClearable,
    disabled,
    name,
    id,
    showMonthYearPicker,
    showYearPicker,
    locale,
    inline,
    yearRange,
}: DatePickerInputProps) {
    const inputClasses = [
        'input',
        'w-full',
        color && `input-${color}`,
        inputSize && `input-${inputSize}`,
        error && 'input-error',
    ]
        .filter(Boolean)
        .join(' ');

    const yearStart = yearRange?.start ?? 1945;
    const yearEnd = yearRange?.end ?? new Date().getFullYear() + 5;

    return (
        <div className={`form-control w-full ${className}`}>
            {label && (
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
            )}
            <div className="w-full">
                <ReactDatePicker
                    className={inputClasses}
                    wrapperClassName="w-full"
                    selected={selected}
                    onChange={(date: Date | null) => onChange(date)}
                    dateFormat={dateFormat}
                    autoComplete="off"
                    placeholderText={placeholder}
                    showTimeSelect={showTimeSelect}
                    timeIntervals={timeIntervals}
                    minDate={minDate ?? undefined}
                    maxDate={maxDate ?? undefined}
                    isClearable={isClearable}
                    disabled={disabled}
                    name={name}
                    id={id}
                    showMonthYearPicker={showMonthYearPicker}
                    showYearPicker={showYearPicker}
                    locale={locale}
                    inline={inline}
                    renderCustomHeader={(params) => (
                        <CustomHeader {...params} yearStart={yearStart} yearEnd={yearEnd} />
                    )}
                />
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
}

export { DatePickerInput, type DatePickerInputProps };
