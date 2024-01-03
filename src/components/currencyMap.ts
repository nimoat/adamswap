export type Currency = {
  name: string;
  icon: string;
  address?: string;
  symbol?: string;
  decimal?: number;
  banlanceValue?: bigint;
  banlanceFormatted?: string;
};

export interface CurrencyV extends Partial<Currency> {
  value: bigint;
  formatted: string;
}
