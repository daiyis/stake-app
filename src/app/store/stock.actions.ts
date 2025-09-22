import { createAction, props } from '@ngrx/store';
import { Portfolio, StockInstrument, SearchResult, BuyOrder, TrendingStock } from '../shared/models/stock.model';

export const loadPortfolio = createAction('[Portfolio] Load Portfolio');
export const loadPortfolioSuccess = createAction(
  '[Portfolio] Load Portfolio Success',
  props<{ portfolio: Portfolio }>()
);
export const loadPortfolioFailure = createAction(
  '[Portfolio] Load Portfolio Failure',
  props<{ error: string }>()
);

export const loadTrendingStocks = createAction('[Stocks] Load Trending Stocks');
export const loadTrendingStocksSuccess = createAction(
  '[Stocks] Load Trending Stocks Success',
  props<{ stocks: TrendingStock[] }>()
);
export const loadTrendingStocksFailure = createAction(
  '[Stocks] Load Trending Stocks Failure',
  props<{ error: string }>()
);

export const loadStock = createAction('[Stocks] Load Stock');
export const loadStockSuccess = createAction(
  '[Stocks] Load Stock Success',
  props<{ stocks: StockInstrument[] }>()
);
export const loadStockFailure = createAction(
  '[Stocks] Load Stock Failure',
  props<{ error: string }>()
);

export const searchStocks = createAction(
  '[Search] Search Stocks',
  props<{ query: string }>()
);
export const searchStocksSuccess = createAction(
  '[Search] Search Stocks Success',
  props<{ results: SearchResult[] }>()
);
export const searchStocksFailure = createAction(
  '[Search] Search Stocks Failure',
  props<{ error: string }>()
);
export const clearSearchResults = createAction('[Search] Clear Search Results');

export const loadRecentSearches = createAction('[Search] Load Recent Searches');
export const loadRecentSearchesSuccess = createAction(
  '[Search] Load Recent Searches Success',
  props<{ searches: SearchResult[] }>()
);
export const addToRecentSearches = createAction(
  '[Search] Add To Recent Searches',
  props<{ stock: StockInstrument }>()
);

export const clearBuyOrder = createAction('[Orders] Clear Buy Order');

export const placeOrder = createAction(
  '[Orders] Place Order',
  props<{ order: BuyOrder }>()
);
export const placeOrderSuccess = createAction(
  '[Orders] Place Order Success',
  props<{ order: BuyOrder }>()
);
export const placeOrderFailure = createAction(
  '[Orders] Place Order Failure',
  props<{ error: string }>()
);

export const setSearchQuery = createAction(
  '[UI] Set Search Query',
  props<{ query: string }>()
);