export interface StockData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  marketCap: string;
  peRatio: string;
  description: string;
  sector: string;
  high52: string;
  low52: string;
  chartData: {
    time: string;
    value: number;
  }[];
}

export interface SearchResult {
  data: StockData | null;
  analysis: string;
  sources: { uri: string; title: string }[];
}

export enum ViewState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}