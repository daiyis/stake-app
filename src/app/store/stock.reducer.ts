import { createReducer, on } from '@ngrx/store';
import { StockState, initialStockState } from './app.state';
import * as StockActions from './stock.actions';

export const stockReducer = createReducer(
  initialStockState,

  // Portfolio reducers
  on(StockActions.loadPortfolio, (state) => ({
    ...state,
    portfolioLoading: { isLoading: true, error: null }
  })),
  on(StockActions.loadPortfolioSuccess, (state, { portfolio }) => ({
    ...state,
    portfolio,
    portfolioLoading: { isLoading: false, error: null }
  })),
  on(StockActions.loadPortfolioFailure, (state, { error }) => ({
    ...state,
    portfolioLoading: { isLoading: false, error }
  })),

  // Trending stocks reducers
  on(StockActions.loadTrendingStocks, (state) => ({
    ...state,
    trendingLoading: { isLoading: true, error: null }
  })),
  on(StockActions.loadTrendingStocksSuccess, (state, { stocks }) => ({
    ...state,
    trendingStocks: stocks,
    trendingLoading: { isLoading: false, error: null }
  })),
  on(StockActions.loadTrendingStocksFailure, (state, { error }) => ({
    ...state,
    trendingLoading: { isLoading: false, error }
  })),

  // Load stocks reducers
  on(StockActions.loadStock, (state) => ({
    ...state,
    stocksLoading: { isLoading: true, error: null }
  })),
  on(StockActions.loadStockSuccess, (state, { stocks }) => ({
    ...state,
    stocks,
    stocksLoading: { isLoading: false, error: null }
  })),
  on(StockActions.loadStockFailure, (state, { error }) => ({
    ...state,
    stocksLoading: { isLoading: false, error }
  })),

  // Search reducers
  on(StockActions.searchStocks, (state, { query }) => ({
    ...state,
    searchQuery: query,
    searchLoading: { isLoading: true, error: null }
  })),
  on(StockActions.searchStocksSuccess, (state, { results }) => ({
    ...state,
    searchResults: results,
    searchLoading: { isLoading: false, error: null }
  })),
  on(StockActions.searchStocksFailure, (state, { error }) => ({
    ...state,
    searchLoading: { isLoading: false, error }
  })),
  on(StockActions.clearSearchResults, (state) => ({
    ...state,
    searchResults: [],
    searchQuery: ''
  })),

  // Recent searches reducers
  on(StockActions.loadRecentSearchesSuccess, (state, { searches }) => ({
    ...state,
    recentSearches: searches
  })),
  on(StockActions.addToRecentSearches, (state, { stock }) => {
    const existingIndex = state.recentSearches.findIndex(
      search => search.stock.symbol === stock.symbol
    );
    let updatedSearches = [...state.recentSearches];
    
    if (existingIndex !== -1) {
      updatedSearches.splice(existingIndex, 1);
    }
    
    updatedSearches.unshift({
      stock,
    });
    
    return {
      ...state,
      recentSearches: updatedSearches.slice(0, 5) // Keep only 5 recent searches
    };
  }),

  // Buy order reducers
  on(StockActions.clearBuyOrder, (state) => ({
    ...state,
    pendingBuyOrder: null,
    buyOrderSuccess: false,
    buyOrderLoading: { isLoading: false, error: null }
  })),

  // Place order reducers
  on(StockActions.placeOrder, (state) => ({
    ...state,
    buyOrderLoading: { isLoading: true, error: null }
  })),
  on(StockActions.placeOrderSuccess, (state, { order }) => {
    if (!state.portfolio) {
      return {
        ...state,
        buyOrderLoading: { isLoading: false, error: null },
        buyOrderSuccess: true
      };
    }

    // Find if we already have this stock in our holdings
    const existingHoldingIndex = state.portfolio.holdings.findIndex(
      holding => holding.stock.symbol === order.stock.symbol
    );

    let updatedHoldings = [...state.portfolio.holdings];
    let updatedTotalEquity = state.portfolio.totalEquity;

    if (existingHoldingIndex !== -1) {
      // Update existing holding
      const existingHolding = updatedHoldings[existingHoldingIndex];
      const newTotalShares = existingHolding.shares + order.shares;
      const newCurrentValue = newTotalShares * order.stock.price;

      updatedHoldings[existingHoldingIndex] = {
        ...existingHolding,
        shares: newTotalShares,
        currentValue: newCurrentValue
      };
    } else {
      // Add new holding
      const newHolding = {
        stock: order.stock,
        shares: order.shares,
        currentValue: order.shares * order.stock.price
      };
      updatedHoldings.push(newHolding);
    }

    // Update portfolio totals
    updatedTotalEquity += order.estimatedTotal;

    const updatedPortfolio = {
      ...state.portfolio,
      totalEquity: updatedTotalEquity,
      holdings: updatedHoldings
    };

    return {
      ...state,
      portfolio: updatedPortfolio,
      buyOrderLoading: { isLoading: false, error: null },
      buyOrderSuccess: true,
      pendingBuyOrder: null
    };
  }),
  on(StockActions.placeOrderFailure, (state, { error }) => ({
    ...state,
    buyOrderLoading: { isLoading: false, error },
    buyOrderSuccess: false
  })),

  // UI reducers
  on(StockActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query
  }))
);