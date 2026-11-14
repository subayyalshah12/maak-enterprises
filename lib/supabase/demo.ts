import type { createClient } from './server';

import 'server-only';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type Row = Record<string, unknown>;
type DemoResult = { data: Row[] | Row | null; error: null };
type DemoQuery = PromiseLike<DemoResult> & {
  select(columns?: string): DemoQuery;
  insert(input: Row | Row[]): DemoQuery;
  update(input: Row): DemoQuery;
  delete(): DemoQuery;
  eq(column: string, value: unknown): DemoQuery;
  not(column: string, operator: string, value: unknown): DemoQuery;
  order(column: string, options?: { ascending?: boolean }): DemoQuery;
  limit(count: number): DemoQuery;
  maybeSingle(): DemoQuery;
};
type DemoClient = { from(table: string): DemoQuery };
type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

const now = new Date().toISOString();
const seedStore: Record<string, Row[]> = {
  properties: [{
    id: '10000000-0000-4000-8000-000000000001',
    title: 'DEMO ONLY — Sample property (not real inventory)',
    slug: 'demo-only-sample-property',
    property_type: 'Demo apartment',
    purpose: 'sale',
    price: null,
    currency: 'PKR',
    location: 'DEMO DATA — replace with verified location',
    size: 'Demo size',
    bedrooms: 2,
    bathrooms: 1,
    description: 'Illustrative admin record only. Not a MAAK listing.',
    image_urls: [],
    featured: false,
    status: 'archived',
    published_at: null,
    created_at: now,
    updated_at: now,
  }],
  construction_projects: [{
    id: '20000000-0000-4000-8000-000000000001',
    title: 'DEMO ONLY — Sample project (not a company project)',
    slug: 'demo-only-sample-project',
    division: 'construction',
    location: 'DEMO DATA — replace with verified location',
    status: 'Example status',
    description: 'Illustrative admin record only. Not a MAAK project.',
    image_urls: [],
    is_published: false,
    created_at: now,
    updated_at: now,
  }],
  inquiries: [{
    id: '30000000-0000-4000-8000-000000000001',
    name: 'DEMO CUSTOMER — not a real person',
    email: 'demo@example.invalid',
    phone: '0000000000',
    division: 'general',
    property_id: null,
    message: 'DEMO ONLY — do not contact.',
    consent: true,
    source: 'demo',
    status: 'new',
    internal_notes: null,
    follow_up_at: null,
    created_at: now,
  }],
  admin_users: [],
};

const demoDataPath = join(process.cwd(), '.maak-demo-data.json');

function readDemoStore(): Record<string, Row[]> {
  try {
    const parsed: unknown = JSON.parse(readFileSync(demoDataPath, 'utf8'));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, Row[]>;
    }
  } catch {
    // First local demo run: initialise a clearly labelled fixture dataset.
  }
  const initial = structuredClone(seedStore);
  writeFileSync(demoDataPath, JSON.stringify(initial, null, 2), { encoding: 'utf8', mode: 0o600 });
  return initial;
}

function writeDemoStore(store: Record<string, Row[]>): void {
  writeFileSync(demoDataPath, JSON.stringify(store, null, 2), { encoding: 'utf8', mode: 0o600 });
}

/** Local file-backed demo records, excluded from Git and available only in development. */
export function createDemoClient(): SupabaseServerClient {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('The MAAK demo data adapter is only available in local development.');
  }
  const demoClient: DemoClient = {
    from(table: string): DemoQuery {
      let operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
      let values: Row[] = [];
      const filters: Array<(row: Row) => boolean> = [];
      const ordering: Array<{ column: string; ascending: boolean }> = [];
      let maxRows: number | undefined;
      let single = false;

      const execute = async (): Promise<DemoResult> => {
        const store = readDemoStore();
        const rows = store[table] ?? (store[table] = []);
        if (operation === 'insert') {
          const inserted = values.map((value) => ({
            id: crypto.randomUUID(),
            created_at: now,
            updated_at: now,
            ...value,
          }));
          rows.push(...inserted);
          writeDemoStore(store);
          return { data: inserted, error: null };
        }

        const selected = rows.filter((row) => filters.every((filter) => filter(row)));
        if (operation === 'update') {
          selected.forEach((row) => Object.assign(row, values[0], { updated_at: new Date().toISOString() }));
          writeDemoStore(store);
          return { data: selected, error: null };
        }
        if (operation === 'delete') {
          store[table] = rows.filter((row) => !filters.every((filter) => filter(row)));
          writeDemoStore(store);
          return { data: selected, error: null };
        }

        let result = [...selected];
        for (const sort of ordering) {
          result.sort((a, b) => {
            const compared = String(a[sort.column] ?? '').localeCompare(
              String(b[sort.column] ?? ''),
              undefined,
              { numeric: true },
            );
            return sort.ascending ? compared : -compared;
          });
        }
        if (maxRows !== undefined) result = result.slice(0, maxRows);
        return { data: single ? result[0] ?? null : result, error: null };
      };

      const query: DemoQuery = {
        select: () => query,
        insert: (input) => {
          operation = 'insert';
          values = Array.isArray(input) ? input : [input];
          return query;
        },
        update: (input) => {
          operation = 'update';
          values = [input];
          return query;
        },
        delete: () => {
          operation = 'delete';
          return query;
        },
        eq: (column, value) => {
          filters.push((row) => row[column] === value);
          return query;
        },
        not: (column, operator, value) => {
          if (operator === 'is' && value === null) {
            filters.push((row) => row[column] !== null && row[column] !== undefined);
          }
          return query;
        },
        order: (column, options) => {
          ordering.push({ column, ascending: options?.ascending ?? true });
          return query;
        },
        limit: (count) => {
          maxRows = count;
          return query;
        },
        maybeSingle: () => {
          single = true;
          return query;
        },
        then: (onfulfilled, onrejected) => execute().then(onfulfilled, onrejected),
      };
      return query;
    },
  };

  // The adapter implements only the query surface used by this app; cast at this boundary
  // so the admin pages share the same typed client contract in local demo and Supabase modes.
  return demoClient as unknown as SupabaseServerClient;
}
