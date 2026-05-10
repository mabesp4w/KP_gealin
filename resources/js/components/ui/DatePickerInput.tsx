import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
import { useState, useEffect, useRef } from 'react';

// Register Indonesian locale
registerLocale('id-ID', id);

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
    minAge?: number;
}

// ── Months list ────────────────────────────────────────────
const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// ──── Main Component ─────────────────────────────────────────

function DatePickerInput({
    label,
    error,
    selected,
    onChange,
    color,
    inputSize,
    className = '',
    placeholder,
    dateFormat = 'd MMM yyyy',
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
    minAge,
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

    // Calculate maxDate based on minAge (if provided)
    const getMaxDate = () => {
        if (maxDate) return maxDate;
        if (minAge) {
            const date = new Date();
            date.setFullYear(date.getFullYear() - minAge);
            return date;
        }
        return undefined;
    };

    const calculatedMaxDate = getMaxDate();

    // Calculate initial viewed month
    const getInitialViewedMonth = (): Date => {
        if (selected) return selected;
        if (minAge) {
            const defaultDate = new Date();
            defaultDate.setFullYear(defaultDate.getFullYear() - minAge);
            return defaultDate;
        }
        return new Date();
    };

    // Track the currently viewed month/year in the picker
    const [viewedMonth, setViewedMonth] = useState<Date>(getInitialViewedMonth());

    // Track when dropdown changes year/month
    const currentViewRef = useRef<{ year: number; month: number }>({
        year: getInitialViewedMonth().getFullYear(),
        month: getInitialViewedMonth().getMonth(),
    });

    // Update ref when viewedMonth changes
    useEffect(() => {
        currentViewRef.current = {
            year: viewedMonth.getFullYear(),
            month: viewedMonth.getMonth(),
        };
    }, [viewedMonth]);

    // Update viewedMonth when selected changes externally
    useEffect(() => {
        if (selected) {
            setViewedMonth(selected);
        }
    }, [selected]);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            // Use the year and month from our tracked view state
            const { year, month } = currentViewRef.current;
            const newDate = new Date(year, month, date.getDate(), date.getHours(), date.getMinutes());
            onChange(newDate);
        } else {
            onChange(null);
        }
    };

    const handleMonthChange = (date: Date) => {
        setViewedMonth(date);
    };

    const handleYearChange = (date: Date) => {
        setViewedMonth(date);
    };

    // ── Custom header with month/year dropdowns ────────────────
    const renderCustomHeader = ({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
    }: {
        date: Date;
        changeYear: (year: number) => void;
        changeMonth: (month: number) => void;
        decreaseMonth: () => void;
        increaseMonth: () => void;
        prevMonthButtonDisabled: boolean;
        nextMonthButtonDisabled: boolean;
    }) => {
        const years: number[] = [];
        for (let y = yearEnd; y >= yearStart; y--) {
            years.push(y);
        }

        const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newYear = Number(e.target.value);
            changeYear(newYear);
            // Update our tracked view
            const newView = new Date(newYear, date.getMonth(), 1);
            setViewedMonth(newView);
            currentViewRef.current = { year: newYear, month: date.getMonth() };
        };

        const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newMonth = Number(e.target.value);
            changeMonth(newMonth);
            // Update our tracked view
            const newView = new Date(date.getFullYear(), newMonth, 1);
            setViewedMonth(newView);
            currentViewRef.current = { year: date.getFullYear(), month: newMonth };
        };

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
                        onChange={handleMonthChange}
                    >
                        {MONTHS.map((month, i) => (
                            <option key={month} value={i}>{month}</option>
                        ))}
                    </select>

                    <select
                        className="select select-xs select-bordered font-semibold"
                        value={date.getFullYear()}
                        onChange={handleYearChange}
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
    };

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
                    onChange={handleDateChange}
                    onMonthChange={handleMonthChange}
                    onYearChange={handleYearChange}
                    openToDate={selected || viewedMonth}
                    dateFormat={dateFormat}
                    autoComplete="off"
                    placeholderText={placeholder}
                    showTimeSelect={showTimeSelect}
                    timeIntervals={timeIntervals}
                    minDate={minDate}
                    maxDate={calculatedMaxDate}
                    isClearable={isClearable}
                    disabled={disabled}
                    name={name}
                    id={id}
                    showMonthYearPicker={showMonthYearPicker}
                    showYearPicker={showYearPicker}
                    locale={locale ?? 'id-ID'}
                    inline={inline}
                    renderCustomHeader={renderCustomHeader}
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
