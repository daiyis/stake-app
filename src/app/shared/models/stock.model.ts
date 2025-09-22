export interface StockInstrument {
  symbol: string;
  name: string;
  price: number;
  changePercent: string;
  shares?: number;
  logo?: string;
  marketCap?: number;
  volume?: number;
  dayRange?: {
    low: number;
    high: number;
  };
}

export interface TrendingStock {
  id: number;
  symbol: string;
}

export interface Portfolio {
  totalEquity: number;
  holdings: PortfolioHolding[];
}

export interface PortfolioHolding {
  stock: StockInstrument;
  shares: number;
  currentValue: number;
}

export interface SearchResult {
  stock: StockInstrument;
}

export interface BuyOrder {
  stock: StockInstrument;
  shares: number;
  orderType: 'market' | 'limit';
  limitPrice?: number;
  estimatedTotal: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
}