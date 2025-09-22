import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
  StockInstrument, 
  Portfolio, 
  PortfolioHolding, 
  SearchResult, 
  BuyOrder, 
  ApiResponse,
  TrendingStock
} from '../models/stock.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private recentSearches: StockInstrument[] = [];
  private readonly RECENT_SEARCHES_KEY = 'app_recent_searches_v1';
  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {
    try {
      const cached = localStorage.getItem(this.RECENT_SEARCHES_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
            this.recentSearches = parsed.filter(s => !!s.symbol && !!s.name && typeof s.price === 'number');
        }
      }
    } catch (e) {
      console.warn('Failed to load recent searches from storage', e);
    }
  }

  getPortfolio(): Observable<ApiResponse<Portfolio>> {
    return this.http.get<any>(`${this.baseUrl}/portfolio`).pipe(
      map(portfolioData => {
        
        const portfolioHoldings: PortfolioHolding[] = portfolioData.positions.map((position: any) => {
          const changePercent = position.changePercent || 0;
          
          return {
            stock: {
              symbol: position.symbol,
              name: '',
              price: position.currentPrice,
              changePercent: changePercent > 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`,
              volume: 0,
              marketCap: 0,
              logo: ''
            },
            shares: position.quantity,
            currentValue: position.marketValue
          } as PortfolioHolding;
        });
        
        const portfolio: Portfolio = {
          totalEquity: portfolioData.totalValue,
          holdings: portfolioHoldings
        };

        return {
          data: portfolio,
          success: true,
          timestamp: new Date()
        };
      })
    );
  }

  getStocks(): Observable<ApiResponse<StockInstrument[]>> {
    return this.http.get<any[]>(`${this.baseUrl}/stocks`).pipe(
      map(stocks => {
        const allStocks = stocks.map(stock => {
          const change = stock.close - stock.open;
          const changePercent = ((change / stock.open) * 100);
          
          return {
            symbol: stock.symbol,
            name: stock.fullName,
            price: stock.ask,
            change: change > 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`,
            changePercent: changePercent > 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`,
            volume: stock.volume,
            marketCap: stock.marketCap / 1000000,
            logo: stock.logo,
            dayRange: {
              low: stock.low,
              high: stock.high
            }
          } as StockInstrument;
        });

        return {
          data: allStocks,
          success: true,
          timestamp: new Date()
        };
      })
    );
  }

  getTrendingStocks(): Observable<ApiResponse<TrendingStock[]>> {
    return this.http.get<any>(`${this.baseUrl}/trending`).pipe(
      map(trendingData => {
        return {
          data: trendingData,
          success: true,
          timestamp: new Date()
        };
      })
    );
  }

  /**
   * GET /api/v1/search?q={query}&type=stocks
   * Real-world: This would use services like Alpha Vantage Symbol Search or similar
   */
  searchStocks(query: string): Observable<ApiResponse<SearchResult[]>> {
    if (!query.trim()) {
      return of({
        data: [],
        success: true,
        timestamp: new Date()
      });
    }

    return this.http.get<any[]>(`${this.baseUrl}/stocks`).pipe(
      map(stocks => {
        // Filter stocks that match the search query (symbol or name)
        const filteredStocks = stocks.filter(stock => 
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.fullName.toLowerCase().includes(query.toLowerCase())
        );

        const searchResults: SearchResult[] = filteredStocks.map(stock => {
          const change = stock.close - stock.open;
          const changePercent = ((change / stock.open) * 100);
          
          return {
            stock: {
              symbol: stock.symbol,
              name: stock.fullName,
              price: stock.ask,
              change: change > 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`,
              changePercent: changePercent > 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`,
              volume: stock.volume,
              marketCap: stock.marketCap / 1000000, // Convert to millions
              logo: stock.logo,
              dayRange: {
                low: stock.low,
                high: stock.high
              }
            },
            searchType: 'search' as const
          };
        });

        return {
          data: searchResults,
          success: true,
          timestamp: new Date()
        };
      })
    );
  }

  /**
   * GET /api/v1/search/recent
   * Real-world: This would be stored in user preferences or local storage
   */
  getRecentSearches(): Observable<ApiResponse<SearchResult[]>> {
    const recentResults: SearchResult[] = this.recentSearches.map(stock => ({
      stock,
      searchType: 'recent' as const
    }));

    return of({
      data: recentResults,
      success: true,
      timestamp: new Date()
    }).pipe(delay(100));
  }

  placeOrder(order: BuyOrder): Observable<ApiResponse<any>> {
    console.log('Placing order:', order);
    
    return of({
      data: { 
        orderId: 'ORD-' + Date.now(), 
        status: 'filled',
        executedPrice: order.stock.price,
        executedShares: order.shares,
        executedAt: new Date()
      },
      success: true,
      message: `Successfully purchased ${order.shares} shares of ${order.stock.symbol}`,
      timestamp: new Date()
    }).pipe(delay(500));
  }

  addToRecentSearches(stock: StockInstrument): void {
    const existingIndex = this.recentSearches.findIndex(s => s.symbol === stock.symbol);
    if (existingIndex !== -1) {
      this.recentSearches.splice(existingIndex, 1);
    }
    this.recentSearches.unshift(stock);
    this.recentSearches = this.recentSearches.slice(0, 5);
    try {
      localStorage.setItem(this.RECENT_SEARCHES_KEY, JSON.stringify(this.recentSearches));
    } catch (e) {
      console.warn('Failed to persist recent searches', e);
    }
  }
}