export enum TransactionRating {
  bad = 0,
  good = 1,
}

export interface TransactionItem {
  id: string;
  title: string;
  description: string;
  rating: TransactionRating;
}

export interface TransactionHistory {
  items: Record<string, TransactionItem>;
  insight: string;
  readonly: boolean;
}

export interface Transactions {
  current: string;
  selected: string;
  history: Record<string, TransactionHistory>;
}
