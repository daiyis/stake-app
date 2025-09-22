import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap, delay } from 'rxjs/operators';
import { StockService } from '../shared/services/stock.service';
import * as StockActions from './stock.actions';

@Injectable()
export class StockEffects {

  constructor(
    private actions$: Actions,
    private stockService: StockService
  ) {}

  loadPortfolio$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.loadPortfolio),
      switchMap(() =>
        this.stockService.getPortfolio().pipe(
          map(response => {
            if (response.success) {
              return StockActions.loadPortfolioSuccess({ portfolio: response.data });
            } else {
              return StockActions.loadPortfolioFailure({ 
                error: response.message || 'Failed to load portfolio' 
              });
            }
          }),
          catchError(error => 
            of(StockActions.loadPortfolioFailure({ 
              error: error.message || 'Failed to load portfolio' 
            }))
          )
        )
      )
    )
  );

  loadTrendingStocks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.loadTrendingStocks),
      switchMap(() =>
        this.stockService.getTrendingStocks().pipe(
          map(response => {
            if (response.success) {
              return StockActions.loadTrendingStocksSuccess({ stocks: response.data });
            } else {
              return StockActions.loadTrendingStocksFailure({ 
                error: response.message || 'Failed to load trending stocks' 
              });
            }
          }),
          catchError(error => 
            of(StockActions.loadTrendingStocksFailure({ 
              error: error.message || 'Failed to load trending stocks' 
            }))
          )
        )
      )
    )
  );

  loadStock$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.loadStock),
      switchMap(() =>
        this.stockService.getStocks().pipe(
          map(response => {
            if (response.success) {
              return StockActions.loadStockSuccess({ stocks: response.data });
            } else {
              return StockActions.loadStockFailure({ 
                error: response.message || 'Failed to load stocks' 
              });
            }
          }),
          catchError(error => 
            of(StockActions.loadStockFailure({ 
              error: error.message || 'Failed to load stocks' 
            }))
          )
        )
      )
    )
  );

  searchStocks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.searchStocks),
      switchMap(({ query }) =>
        this.stockService.searchStocks(query).pipe(
          map(response => {
            if (response.success) {
              return StockActions.searchStocksSuccess({ results: response.data });
            } else {
              return StockActions.searchStocksFailure({ 
                error: response.message || 'Failed to search stocks' 
              });
            }
          }),
          catchError(error => 
            of(StockActions.searchStocksFailure({ 
              error: error.message || 'Failed to search stocks' 
            }))
          )
        )
      )
    )
  );

  loadRecentSearches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.loadRecentSearches),
      switchMap(() =>
        this.stockService.getRecentSearches().pipe(
          map(response => {
            if (response.success) {
              return StockActions.loadRecentSearchesSuccess({ searches: response.data });
            } else {
              return StockActions.loadRecentSearchesSuccess({ searches: [] });
            }
          }),
          catchError(() => 
            of(StockActions.loadRecentSearchesSuccess({ searches: [] }))
          )
        )
      )
    )
  );

  addToRecentSearches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.addToRecentSearches),
      tap(({ stock }) => {
        this.stockService.addToRecentSearches(stock);
      })
    ),
    { dispatch: false }
  );

  placeOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.placeOrder),
      switchMap(({ order }) =>
        this.stockService.placeOrder(order).pipe(
          map(response => {
            if (response.success) {
              return StockActions.placeOrderSuccess({ order });
            } else {
              return StockActions.placeOrderFailure({ 
                error: response.message || 'Failed to place order' 
              });
            }
          }),
          catchError(error => 
            of(StockActions.placeOrderFailure({ 
              error: error.message || 'Failed to place order' 
            }))
          )
        )
      )
    )
  );

  clearOrderAfterSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StockActions.placeOrderSuccess),
      switchMap(() => 
        of(StockActions.clearBuyOrder()).pipe(delay(100))
      )
    )
  );
}