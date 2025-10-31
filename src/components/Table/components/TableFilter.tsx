import SettingsIcon from '@/components/SettingsIcon';
import { ENTER_KEY } from '@/constants';
import type { Column, Filter } from '@/types';
import { useRef, useState } from 'react';

interface Props<T> {
  initialFilter: Filter<T>;
  filterCategories: Column<T>[];
  onFilterChange: (filter: Filter<T>) => void;
}

export default function TableFilter<T>({
  initialFilter,
  filterCategories,
  onFilterChange,
}: Props<T>) {
  const filterField = useRef<HTMLInputElement>(null);
  const filterCategory = useRef<HTMLSelectElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState(initialFilter?.key as string ?? '');
  const [filterValue, setFilterValue] = useState(initialFilter?.value ?? '');

  const isApplyDisabled = !selectedCategory || !filterValue;

  const getButtonText = () => {
    if (initialFilter?.key) {
      const category = filterCategories.find(cat => cat.key === initialFilter.key);
      return `Filter by ${category?.label ?? String(initialFilter.key)}`;
    }
    return 'Filter';
  };

  const handleApply = () => {
    const category = filterCategory.current?.value as keyof T;
    const value = filterField.current?.value ?? '';

    if (category && value) {
      onFilterChange({ key: category, value });
    }

    popoverRef.current?.hidePopover();
  };

  const handleClear = () => {
    if (filterField.current) filterField.current.value = '';
    if (filterCategory.current) filterCategory.current.value = '';
    setSelectedCategory('');
    setFilterValue('');
    onFilterChange(null);

    popoverRef.current?.hidePopover();
  };

  return (
    <>
      <button
        popoverTarget='filter-popover'
        popoverTargetAction='toggle'
        className='flex items-center gap-2 h-[32px] text-[13px] px-4 py-2 rounded cursor-pointer bg-transparent border border-[#E2E8F0] hover:bg-gray-100 transition-colors duration-200 ease-in-out '
        style={{ anchorName: '--filter-btn' } as React.CSSProperties}
        aria-label={getButtonText()}
      >
        <SettingsIcon /> <span>{getButtonText()}</span>
      </button>
      <div
        ref={popoverRef}
        popover=''
        id='filter-popover'
        role='dialog'
        aria-label='Filter table data by category and value'
        style={
          {
            positionAnchor: '--filter-btn',
            left: 'anchor(right)',
            top: 'anchor(bottom)',
            translate: '-100%',
          } as React.CSSProperties
        }
      >
        <section className='flex flex-col gap-2 p-4 border border-[#E2E8F0] rounded shadow-lg bg-white z-30 mt-1 w-[250px]'>
          <div className='flex gap-2 shrink-0'>
            <span className='text-sm font-medium shrink-0'>Filter by:</span>
            <select
              className='shrink-0 cursor-pointer'
              ref={filterCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              defaultValue={selectedCategory}
              aria-label='Select a category for filtering'
            >
              <option value=''>Select a category</option>
              {filterCategories.map(category => (
                <option
                  key={category.key as string}
                  value={category.key as string}
                >
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <input
            type='text'
            placeholder='Filter value...'
            ref={filterField}
            onChange={e => setFilterValue(e.target.value)}
            aria-label='Filter value...'
            onKeyDown={e => {
              if (e.key === ENTER_KEY && !isApplyDisabled) {
                e.preventDefault();
                handleApply();
              }
            }}
            defaultValue={filterValue}
          />
          <button
            className='px-3 py-1 border border-neutral-300 text-black rounded transition-colors duration-200 ease-in-out bg-transparent hover:bg-neutral-100 disabled:opacity-50 cursor-pointer disabled:hover:bg-transparent disabled:cursor-not-allowed'
            onClick={handleApply}
            disabled={isApplyDisabled}
            aria-label='Apply filter'
          >
            Apply
          </button>
          <button
            className='px-3 py-1 bg-neutral-800 border border-neutral-800 text-white rounded transition-colors duration-200 ease-in-out hover:bg-neutral-900 cursor-pointer'
            onClick={handleClear}
            aria-label='Clear filter'
          >
            Clear
          </button>
        </section>
      </div>
    </>
  );
}
