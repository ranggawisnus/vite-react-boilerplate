# Types

Folder ini berisi semua type definitions yang digunakan di seluruh aplikasi.

## Struktur

### `api.ts`

Types untuk API responses dan error handling:

- `ApiResponse<T>` - Standard API response structure
- `ApiErrorResponse` - Error response structure

### `bak-files.ts`

Types untuk operasi BAK files:

- `BakFile` - Structure untuk BAK file item
- `StreamEvent` - Event structure untuk streaming progress
- `ConvertFileRequest` - Request body untuk convert file
- `ConvertFileStreamRequest` - Request body untuk convert file stream

### `table.ts`

Types untuk TanStack Table:

- `Person` - Person data structure untuk table showcase

### `index.ts`

Central export untuk semua types. Import types dari sini:

```typescript
import type { ApiResponse, BakFile, Person } from "../types";
```

## Usage

Selalu import types dari `types/index.ts` untuk konsistensi:

```typescript
import type { ApiResponse, BakFile } from "../types";
```

## Best Practices

1. **Organize by domain**: Group types berdasarkan domain/fitur (api, bak-files, table, dll)
2. **Use descriptive names**: Nama type harus jelas dan deskriptif
3. **Export from index**: Semua types harus di-export melalui `index.ts`
4. **Document complex types**: Tambahkan JSDoc comments untuk types yang kompleks
5. **Keep types focused**: Setiap file types harus fokus pada satu domain
