import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import {
  SearchResult,
  StockInstrument,
  BuyOrder,
} from '../shared/models/stock.model';
import { AppState } from '../store/app.state';
import * as StockActions from '../store/stock.actions';
import * as StockSelectors from '../store/stock.selectors';

@Component({
  selector: 'app-tab-discover',
  templateUrl: 'tab-discover.page.html',
  styleUrls: ['tab-discover.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabDiscoverPage implements OnInit, OnDestroy {
  searchQuery = '';
  recentlySearched$: Observable<SearchResult[]>;
  searchResults$: Observable<SearchResult[]>;
  topVolumeStocks$: Observable<StockInstrument[]>;
  isSearching$: Observable<boolean>;
  showSearchResults = false;

  selectedStock: StockInstrument | null = null;
  isBuyOrderModalOpen = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private toastController: ToastController
  ) {
    this.recentlySearched$ = this.store.select(
      StockSelectors.selectRecentSearches
    );
    this.searchResults$ = this.store.select(StockSelectors.selectSearchResults);
    this.topVolumeStocks$ = this.store.select(
      StockSelectors.selectTop3StocksByVolume
    );
    this.isSearching$ = this.store.select(StockSelectors.selectSearchLoading);
  }

  ngOnInit() {
    this.loadDiscoverData();
    this.setupSearch();

    this.store
      .select(StockSelectors.selectBuyOrderSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
        if (success) {
          setTimeout(() => {
            this.store.dispatch(StockActions.clearBuyOrder());
          }, 100);
        }
      });

    this.store
      .select(StockSelectors.selectBuyOrderError)
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        if (error) {
          this.showErrorToast(`Failed to place order: ${error}`);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDiscoverData() {
    this.store.dispatch(StockActions.loadRecentSearches());
    this.store.dispatch(StockActions.loadTrendingStocks());
    this.store.dispatch(StockActions.loadStock());
  }

  private setupSearch() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        const trimmedQuery = query.trim();
        if (trimmedQuery.length === 0) {
          this.store.dispatch(StockActions.clearSearchResults());
        } else {
          this.store.dispatch(
            StockActions.searchStocks({ query: trimmedQuery })
          );
          // Note: showSearchResults is handled in onSearchInput
        }
      });
  }

  onSearchInput(event: any) {
    this.searchQuery = event.detail.value;
    this.store.dispatch(
      StockActions.setSearchQuery({ query: this.searchQuery })
    );

    if (this.searchQuery.trim().length > 0) {
      this.showSearchResults = true;
      this.searchSubject.next(this.searchQuery);
    } else {
      this.showSearchResults = false;
      this.store.dispatch(StockActions.clearSearchResults());
    }
  }

  onSearchFocus() {
    this.showSearchResults = true;

    if (this.searchQuery.trim().length > 0) {
    } else {
      this.store.dispatch(StockActions.clearSearchResults());
    }
  }

  onSearchBlur() {
  }

  onStockClick(stock: StockInstrument) {
    console.log('Stock clicked from search results:', stock);
    this.store.dispatch(StockActions.addToRecentSearches({ stock }));

    this.showSearchResults = false;
    this.searchQuery = '';
    this.store.dispatch(StockActions.clearSearchResults());
    this.store.dispatch(StockActions.setSearchQuery({ query: '' }));
  }

  onRecentSearchClick(stock: StockInstrument) {
    console.log('Recently searched stock clicked:', stock);

    this.showSearchResults = false;
    this.searchQuery = '';
    this.store.dispatch(StockActions.clearSearchResults());
    this.store.dispatch(StockActions.setSearchQuery({ query: '' }));
  }

  onCancelSearch() {
    this.searchQuery = '';
    this.showSearchResults = false;
    this.store.dispatch(StockActions.clearSearchResults());
    this.store.dispatch(StockActions.setSearchQuery({ query: '' }));
  }

  trackByStockSymbol(_index: number, item: any) {
    return item?.stock?.symbol || item?.symbol;
  }

  onStockCardClick(stock: StockInstrument) {
    console.log('Opening buy order for stock:', stock);
    this.selectedStock = stock;
    this.isBuyOrderModalOpen = true;
  }

  onBuyOrderClose() {
    this.isBuyOrderModalOpen = false;
    this.selectedStock = null;
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      cssClass: 'success-toast',
    });
    await toast.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      cssClass: 'error-toast',
    });
    await toast.present();
  }

  onOrderPlaced(order: BuyOrder) {
    console.log('Order placed:', order);

    this.store.dispatch(StockActions.placeOrder({ order }));
    this.onBuyOrderClose();
    this.showSuccessToast(`${order.stock.symbol} successfully purchased`);
  }
}
