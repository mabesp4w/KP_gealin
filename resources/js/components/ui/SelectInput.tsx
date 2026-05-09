import { useEffect, useRef, useState } from 'react';
import ReactSelect, {
    type GroupBase,
    mergeStyles,
    type Props as ReactSelectProps,
    type StylesConfig,
} from 'react-select';

interface SelectInputProps<
    Option = unknown,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
> extends Omit<ReactSelectProps<Option, IsMulti, Group>, 'menuShouldScrollIntoView'> {
    label?: string;
    error?: string;
    menuShouldScrollIntoView?: boolean;
}

function SelectInput<
    Option = unknown,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
>({
    label,
    error,
    className,
    menuPortalTarget,
    menuPosition,
    menuShouldScrollIntoView = false,
    styles,
    ...props
}: SelectInputProps<Option, IsMulti, Group>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [resolvedMenuPortalTarget, setResolvedMenuPortalTarget] = useState<HTMLElement | undefined>(undefined);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const dialog = container.closest('dialog');

        if (dialog instanceof HTMLElement) {
            setResolvedMenuPortalTarget(dialog);
            return;
        }

        if (menuPortalTarget instanceof HTMLElement) {
            setResolvedMenuPortalTarget(menuPortalTarget);
            return;
        }

        setResolvedMenuPortalTarget(typeof document !== 'undefined' ? document.body : undefined);
    }, [menuPortalTarget]);

    const defaultStyles: StylesConfig<Option, IsMulti, Group> = {
        menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
        }),
    };

    return (
        <div ref={containerRef} className="form-control w-full">
            {label && (
                <label className="label">
                    <span className="label-text">{label}</span>
                </label>
            )}
            <ReactSelect<Option, IsMulti, Group>
                className={`react-select-container ${className || ''}`}
                classNamePrefix="react-select"
                menuPortalTarget={resolvedMenuPortalTarget}
                menuPosition={menuPosition ?? 'fixed'}
                menuShouldScrollIntoView={menuShouldScrollIntoView}
                styles={mergeStyles(defaultStyles, styles ?? {})}
                {...props}
            />
            {error && (
                <label className="label">
                    <span className="label-text-alt text-error">{error}</span>
                </label>
            )}
        </div>
    );
}

export { SelectInput, type SelectInputProps };
