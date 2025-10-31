export type Column<T> = {
    key: keyof T;
    label: string;
    render: (value: T[keyof T]) => React.ReactNode;
  };
  
  export type SortDirection = 'asc' | 'desc' | 'none';
  
  export type Sort<T> = {
    key: keyof T;
    direction: SortDirection;
  };
  
  export type Filter<T> = {
    key: keyof T;
    value: string;
  } | null;
  
  export type Pagination = {
    page: number;
    pageSize: number;
  };
  
  export type GroceryItem = {
    id: number;
    name: string;
    section: string;
    price: number;
    weight: number;
  };
  