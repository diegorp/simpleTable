import { getSortDirection } from '@/utils/getSortDirection';

describe('getSortDirection', () => {
  it('should return "asc" when current direction is "none"', () => {
    const result = getSortDirection('none');
    expect(result).toBe('asc');
  });

  it('should return "desc" when current direction is "asc"', () => {
    const result = getSortDirection('asc');
    expect(result).toBe('desc');
  });

  it('should return "none" when current direction is "desc"', () => {
    const result = getSortDirection('desc');
    expect(result).toBe('none');
  });
});
