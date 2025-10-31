import { describe, it, expect } from 'vitest';
import { sortList } from '@/utils/sortList';

describe('sortList', () => {
  const testData = [
    { id: 3, name: 'Charlie', age: 30 },
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 35 },
  ];

  it('should return the original list when direction is "none"', () => {
    const result = sortList(testData, 'id', 'none');
    expect(result).toEqual(testData);
  });

  it('should sort numbers in ascending order', () => {
    const result = sortList(testData, 'id', 'asc');
    expect(result).toEqual([
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 35 },
      { id: 3, name: 'Charlie', age: 30 },
    ]);
  });

  it('should sort numbers in descending order', () => {
    const result = sortList(testData, 'age', 'desc');
    expect(result).toEqual([
      { id: 2, name: 'Bob', age: 35 },
      { id: 3, name: 'Charlie', age: 30 },
      { id: 1, name: 'Alice', age: 25 },
    ]);
  });

  it('should sort strings in ascending order', () => {
    const result = sortList(testData, 'name', 'asc');
    expect(result).toEqual([
      { id: 1, name: 'Alice', age: 25 },
      { id: 2, name: 'Bob', age: 35 },
      { id: 3, name: 'Charlie', age: 30 },
    ]);
  });

  it('should sort strings in descending order', () => {
    const result = sortList(testData, 'name', 'desc');
    expect(result).toEqual([
      { id: 3, name: 'Charlie', age: 30 },
      { id: 2, name: 'Bob', age: 35 },
      { id: 1, name: 'Alice', age: 25 },
    ]);
  });

  it('should not mutate the original array', () => {
    const original = [...testData];
    sortList(testData, 'name', 'asc');
    expect(testData).toEqual(original);
  });

  it('should handle empty array', () => {
    const result = sortList([], 'id', 'asc');
    expect(result).toEqual([]);
  });

  it('should handle single item array', () => {
    const singleItem = [{ id: 1, name: 'Alice', age: 25 }];
    const result = sortList(singleItem, 'name', 'asc');
    expect(result).toEqual(singleItem);
  });

  it('should do nothing when sorting non-string and non-number values', () => {
    const mixedData = [
      { id: 1, value: null },
      { id: 2, value: undefined },
    ];
    const result = sortList(mixedData, 'value', 'asc');
    expect(result).toEqual(mixedData);
  });
});
