import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import {
  Portfolio,
  StockInstrument,
  BuyOrder,
} from '../shared/models/stock.model';
import { AppState } from '../store/app.state';
import * as StockActions from '../store/stock.actions';
import * as StockSelectors from '../store/stock.selectors';

@Component({
  selector: 'app-tab-invest',
  templateUrl: 'tab-invest.page.html',
  styleUrls: ['tab-invest.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabInvestPage implements OnInit, OnDestroy {
  portfolio$: Observable<Portfolio | null>;
  trendingStocks$: Observable<StockInstrument[]>;
  isLoading$: Observable<boolean>;

  selectedStock: StockInstrument | null = null;
  isBuyOrderModalOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private toastController: ToastController
  ) {
    this.portfolio$ = this.store.select(StockSelectors.selectPortfolio);
    this.trendingStocks$ = this.store.select(
      StockSelectors.selectTrendingStocks
    );
    this.isLoading$ = this.store
      .select(StockSelectors.selectDashboardData)
      .pipe(
        map((data) => data.isLoading),
        takeUntil(this.destroy$)
      );
  }

  ngOnInit() {
    this.loadDashboardData();

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

  private loadDashboardData() {
    this.store.dispatch(StockActions.loadStock());
    this.store.dispatch(StockActions.loadPortfolio());
    this.store.dispatch(StockActions.loadTrendingStocks());
  }

  onRefresh(event: any) {
    this.loadDashboardData();
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  onStockClick(stock: StockInstrument) {
    console.log('Stock clicked:', stock);
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
