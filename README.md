# Simple Table

A modern, feature-rich table component built with React, TypeScript, and Tailwind CSS. This project demonstrates a well-architected, reusable table component with sorting, filtering, and pagination capabilities.

## ✨ Features

- 📊 **Dynamic Data Display** - Automatically generates columns from data
- 🔄 **Sorting** - Click column headers to sort ascending/descending
- 🔍 **Filtering** - Filter data by any column
- 📄 **Pagination** - Navigate through large datasets with customizable page sizes
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🧩 **Modular Architecture** - Split into reusable hooks and components
- 🔒 **Type-Safe** - Built with TypeScript for enhanced developer experience
- ✅ **Testable** - Component architecture designed for easy testing

## 📋 Requirements

- **Node.js**: v22.20.0 or higher
- **pnpm**: 10.19.0 or higher

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build

```bash
# Build for production
pnpm build
```

The optimized production build will be generated in the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
pnpm preview
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

### Linting

```bash
# Run ESLint
pnpm lint
```

## 🧩 Table Component Usage

### Basic Example

```tsx
import Table from './components/Table';

const data = [
  { id: 1, name: 'John Doe', age: 30, city: 'New York' },
  { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  { id: 3, name: 'Bob Johnson', age: 35, city: 'Chicago' },
];

function App() {
  return (
    <Table
      data={data}
      rowIdKey="id"
    />
  );
}
```

### Advanced Example with All Features

```tsx
import Table from './components/Table';
import type { Sort, Filter } from './types';

function App() {
  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
  };

  const handlePageSizeChange = (pageSize: number) => {
    console.log('Page size changed to:', pageSize);
  };

  const handleSortChange = (sort: Sort<YourDataType>) => {
    console.log('Sort changed:', sort);
  };

  const handleFilterChange = (filter: Filter<YourDataType>) => {
    console.log('Filter changed:', filter);
  };

  return (
    <Table
      title="My Data Table"
      data={yourData}
      rowIdKey="id"
      hideRowId={true}
      pagination={true}
      sort={true}
      filter={true}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
    />
  );
}
```

## 📖 API Reference

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `T[]` | ✅ | - | Array of data objects to display |
| `rowIdKey` | `keyof T` | ✅ | - | Key to use as unique identifier for rows |
| `title` | `string` | ❌ | - | Optional title displayed above the table |
| `hideRowId` | `boolean` | ❌ | `false` | Whether to hide the row ID column |
| `pagination` | `boolean` | ❌ | `false` | Enable pagination controls |
| `sort` | `boolean` | ❌ | `false` | Enable column sorting |
| `filter` | `boolean` | ❌ | `false` | Enable data filtering |
| `onPageChange` | `(page: number) => void` | ❌ | - | Callback when page changes |
| `onPageSizeChange` | `(pageSize: number) => void` | ❌ | - | Callback when page size changes |
| `onSortChange` | `(sort: Sort<T>) => void` | ❌ | - | Callback when sort changes |
| `onFilterChange` | `(filter: Filter<T>) => void` | ❌ | - | Callback when filter changes |

### Types

```typescript
// Column definition
type Column<T> = {
  key: keyof T;
  label: string;
  render: (value: T[keyof T]) => React.ReactNode;
};

// Sort configuration
type Sort<T> = {
  key: keyof T;
  direction: 'asc' | 'desc' | 'none';
};

// Filter configuration
type Filter<T> = {
  key: keyof T;
  value: string;
} | null;

// Pagination configuration
type Pagination = {
  page: number;
  pageSize: number;
};
```

## 🏗️ Architecture

The table component follows a modular architecture with separation of concerns:

### Component Structure

```
Table/
├── index.tsx                 # Main orchestrator component
├── hooks/                    # Custom hooks for business logic
│   ├── useTableColumns.ts    # Column management
│   ├── useTableData.ts       # Data processing (filter, sort, paginate)
│   ├── useTableSort.ts       # Sorting state and logic
│   ├── useTableFilter.ts     # Filtering state and logic
│   ├── useTablePagination.ts # Pagination state and logic
│   └── index.ts              # Barrel export
└── components/               # Presentational components
    ├── TableHead.tsx         # Table header with sort controls
    ├── TableBody.tsx         # Table rows rendering
    ├── Pagination.tsx        # Pagination controls
    └── TableFilter.tsx       # Filter UI component
```

### Custom Hooks

Each hook is responsible for a specific concern and can be tested independently:

- **`useTableColumns`** - Generates column configuration from data
- **`useTableData`** - Processes data (filtering, sorting, pagination)
- **`useTableSort`** - Manages sort state and provides toggle function
- **`useTableFilter`** - Manages filter state and application
- **`useTablePagination`** - Manages page and page size state

### Benefits

1. **Separation of Concerns** - Logic separated from presentation
2. **Testability** - Each component and hook can be tested in isolation
3. **Reusability** - Hooks and components can be reused in different contexts
4. **Maintainability** - Smaller files are easier to understand and modify
5. **Type Safety** - Full TypeScript support throughout

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript 5.9** - Type safety and better DX
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting
- **pnpm** - Fast, efficient package manager

## 📝 Development Guidelines

### Adding New Features

1. **Business Logic** - Create a new hook in `hooks/` directory
2. **UI Components** - Create presentational components in `components/`
3. **Keep Main Component Clean** - The main `Table` component should orchestrate, not implement
4. **Type Safety** - Always use TypeScript types and interfaces
5. **Testing** - Write tests for new hooks and components

### Code Style

- Use functional components with hooks
- Extract logic into custom hooks (not inline in components)
- Keep components small and focused on presentation
- Use component composition to build complex UIs from simpler pieces
- Use TypeScript generics for reusable components
- Follow ESLint rules (run `pnpm lint` before committing)

## 🤝 Contributing

This is a personal project. If you have suggestions or find bugs, feel free to open an issue or submit a pull request.

---

Built with ❤️ using React and TypeScript

