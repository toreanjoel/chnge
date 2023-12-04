export enum TransactionType {
  income = 'income',
  expense = 'expense',
}

export enum TransactionRating {
  bad = 0,
  good = 1,
}

export interface TransactionItem {
  id: string;
  title: string;
  description: string;
  type: TransactionType;
  rating: TransactionRating;
}

export interface TransactionHistory {
  items: Record<string, TransactionItem>;
  overview: string;
  readonly: boolean;
}

export interface Transactions {
  current: string;
  selected: string;
  history: Record<string, TransactionHistory>;
}
