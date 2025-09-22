import { Portfolio, StockInstrument, SearchResult, BuyOrder, TrendingStock } from '../shared/models/stock.model';

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface StockState {
  portfolio: Portfolio | null;
  portfolioLoading: LoadingState;

  stocks: StockInstrument[];
  stocksLoading: LoadingState;

  trendingStocks: TrendingStock[];
  trendingLoading: LoadingState;

  searchResults: SearchResult[];
  recentSearches: SearchResult[];
  searchLoading: LoadingState;
  searchQuery: string;

  pendingBuyOrder: BuyOrder | null;
  buyOrderLoading: LoadingState;
  buyOrderSuccess: boolean;
}

export interface AppState {
  stocks: StockState;
}

export const initialStockState: StockState = {
  portfolio: null,
  portfolioLoading: { isLoading: false, error: null },

  stocks: [],
  stocksLoading: { isLoading: false, error: null },

  trendingStocks: [],
  trendingLoading: { isLoading: false, error: null },

  searchResults: [],
  recentSearches: [],
  searchLoading: { isLoading: false, error: null },
  searchQuery: '',

  pendingBuyOrder: null,
  buyOrderLoading: { isLoading: false, error: null },
  buyOrderSuccess: false
};