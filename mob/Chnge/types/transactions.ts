enum TransactionType {
  income,
  expense,
}

export interface TransactionItem {
  title: string;
  description: string;
  type: TransactionType;
  score: number;
}

export interface TransactionHistory {
  items: TransactionItem[];
  overview: string;
  readonly: boolean;
}

export interface Transactions {
  current: string;
  selected: string;
  history: Record<string, TransactionHistory>;
}
