import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StockState } from './app.state';
import { StockInstrument } from '../shared/models/stock.model';

export const selectStockState = createFeatureSelector<StockState>('stocks');

export const selectPortfolio = createSelector(
  selectStockState,
  (state) => state.portfolio
);

export const selectPortfolioLoading = createSelector(
  selectStockState,
  (state) => state.portfolioLoading.isLoading
);

export const selectPortfolioError = createSelector(
  selectStockState,
  (state) => state.portfolioLoading.error
);

export const selectStocks = createSelector(
  selectStockState,
  (state) => state.stocks
);

export const selectStocksLoading = createSelector(
  selectStockState,
  (state) => state.stocksLoading.isLoading
);

export const selectStocksError = createSelector(
  selectStockState,
  (state) => state.stocksLoading.error
);

export const selectTrendingStocksList = createSelector(
  selectStockState,
  (state) => state.trendingStocks
);

export const selectTrendingStocks = createSelector(
  selectTrendingStocksList,
  selectStocks,
  (trendingList, allStocks) => {
    return trendingList.map(trending => {
      const stockDetails = allStocks.find(stock => stock.symbol === trending.symbol);
      return stockDetails || null;
    }).filter(stock => stock !== null) as StockInstrument[];
  }
);

export const selectTrendingLoading = createSelector(
  selectStockState,
  (state) => state.trendingLoading.isLoading
);

export const selectTrendingError = createSelector(
  selectStockState,
  (state) => state.trendingLoading.error
);

export const selectTop3StocksByVolume = createSelector(
  selectStocks,
  (stocks) => {
    return stocks
      .filter(stock => stock.volume !== undefined && stock.volume !== null)
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 3);
  }
);

export const selectSearchResults = createSelector(
  selectStockState,
  (state) => state.searchResults
);

export const selectRecentSearches = createSelector(
  selectStockState,
  (state) => state.recentSearches
);

export const selectSearchLoading = createSelector(
  selectStockState,
  (state) => state.searchLoading.isLoading
);

export const selectSearchError = createSelector(
  selectStockState,
  (state) => state.searchLoading.error
);

export const selectSearchQuery = createSelector(
  selectStockState,
  (state) => state.searchQuery
);

export const selectPendingBuyOrder = createSelector(
  selectStockState,
  (state) => state.pendingBuyOrder
);

export const selectBuyOrderLoading = createSelector(
  selectStockState,
  (state) => state.buyOrderLoading.isLoading
);

export const selectBuyOrderSuccess = createSelector(
  selectStockState,
  (state) => state.buyOrderSuccess
);

export const selectBuyOrderError = createSelector(
  selectStockState,
  (state) => state.buyOrderLoading.error
);

export const selectDashboardData = createSelector(
  selectPortfolio,
  selectTrendingStocks,
  selectPortfolioLoading,
  selectTrendingLoading,
  (portfolio, trendingStocks, portfolioLoading, trendingLoading) => ({
    portfolio,
    trendingStocks,
    isLoading: portfolioLoading || trendingLoading
  })
);

export const selectSearchData = createSelector(
  selectSearchResults,
  selectRecentSearches,
  selectSearchLoading,
  selectSearchQuery,
  (searchResults, recentSearches, isLoading, query) => ({
    searchResults,
    recentSearches,
    isLoading,
    query
  })
);