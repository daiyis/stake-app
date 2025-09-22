import { render, screen, fireEvent } from '@testing-library/angular';
import { CommonModule } from '@angular/common';
import { InstrumentComponent } from './instrument.component';
import { StockInstrument, PortfolioHolding } from '../models/stock.model';

// Mock data for testing
const mockStock: StockInstrument = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 150.25,
  changePercent: '+2.5%',
  logo: 'apple-logo.png',
  marketCap: 2500000000000,
  volume: 50000000,
  dayRange: {
    low: 148.50,
    high: 152.00
  }
};

const mockHolding: PortfolioHolding = {
  stock: mockStock,
  shares: 10.5,
  currentValue: 1577.625
};

describe('InstrumentComponent', () => {
  it('should render stock symbol and name in list mode', async () => {
    await render(InstrumentComponent, {
      imports: [CommonModule],
      declarations: [InstrumentComponent],
      componentProperties: {
        stock: mockStock,
        mode: 'list'
      }
    });

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
  });

  it('should display stock price when provided', async () => {
    await render(InstrumentComponent, {
      imports: [CommonModule],
      declarations: [InstrumentComponent],
      componentProperties: {
        stock: mockStock,
        mode: 'list'
      }
    });

    expect(screen.getByText('$150.25')).toBeInTheDocument();
  });

  it('should display holding information when holding is provided', async () => {
    await render(InstrumentComponent, {
      imports: [CommonModule],
      declarations: [InstrumentComponent],
      componentProperties: {
        stock: mockStock,
        holding: mockHolding,
        mode: 'holding'
      }
    });

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('10.5000 shares')).toBeInTheDocument();
    expect(screen.getByText('$150.25')).toBeInTheDocument();
    expect(screen.getByText('+2.5%')).toBeInTheDocument();
  });

  it('should trigger click handler when clickable is true', async () => {
    const { fixture } = await render(InstrumentComponent, {
      imports: [CommonModule],
      declarations: [InstrumentComponent],
      componentProperties: {
        stock: mockStock,
        clickable: true
      }
    });

    const component = fixture.componentInstance;
    jest.spyOn(component.instrumentClick, 'emit');

    const instrumentContainer = screen.getByText('AAPL').closest('.instrument-container');
    expect(instrumentContainer).toBeInTheDocument();

    fireEvent.click(instrumentContainer!);

    expect(component.instrumentClick.emit).toHaveBeenCalledWith(mockStock);
  });

  it('should not trigger click handler when clickable is false', async () => {
    const { fixture } = await render(InstrumentComponent, {
      imports: [CommonModule],
      declarations: [InstrumentComponent],
      componentProperties: {
        stock: mockStock,
        clickable: false
      }
    });

    const component = fixture.componentInstance;
    jest.spyOn(component.instrumentClick, 'emit');

    const instrumentContainer = screen.getByText('AAPL').closest('.instrument-container');
    expect(instrumentContainer).toBeInTheDocument();

    fireEvent.click(instrumentContainer!);

    expect(component.instrumentClick.emit).not.toHaveBeenCalled();
  });

  it('should apply correct CSS classes', async () => {
    await render(InstrumentComponent, {
      imports: [CommonModule],
      declarations: [InstrumentComponent],
      componentProperties: {
        stock: mockStock,
        size: 'large',
        clickable: true
      }
    });

    const instrumentContainer = screen.getByText('AAPL').closest('.instrument-container');
    expect(instrumentContainer).toHaveClass('large');
    expect(instrumentContainer).toHaveClass('clickable');
  });

  it('should display stock name when no holding is provided', async () => {
    await render(InstrumentComponent, {
      imports: [CommonModule],
      declarations: [InstrumentComponent],
      componentProperties: {
        stock: mockStock,
        holding: undefined,
        mode: 'list'
      }
    });

    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.queryByText(/shares/)).not.toBeInTheDocument();
  });

  it('should hide pricing section in compact mode', async () => {
    await render(InstrumentComponent, {
      imports: [CommonModule],
      declarations: [InstrumentComponent],
      componentProperties: {
        stock: mockStock,
        mode: 'compact'
      }
    });

    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.queryByText('$150.25')).not.toBeInTheDocument();
  });

  describe('computed properties', () => {
    it('should return holding stock when holding is provided', async () => {
      const { fixture } = await render(InstrumentComponent, {
        imports: [CommonModule],
        declarations: [InstrumentComponent],
        componentProperties: {
          stock: mockStock,
          holding: mockHolding
        }
      });

      expect(fixture.componentInstance.displayStock).toEqual(mockStock);
    });

    it('should return main stock when no holding is provided', async () => {
      const { fixture } = await render(InstrumentComponent, {
        imports: [CommonModule],
        declarations: [InstrumentComponent],
        componentProperties: {
          stock: mockStock,
          holding: undefined
        }
      });

      expect(fixture.componentInstance.displayStock).toEqual(mockStock);
    });

    it('should return correct shares count', async () => {
      const { fixture } = await render(InstrumentComponent, {
        imports: [CommonModule],
        declarations: [InstrumentComponent],
        componentProperties: {
          stock: mockStock,
          holding: mockHolding
        }
      });

      expect(fixture.componentInstance.shares).toBe(10.5);
    });

    it('should return 0 shares when no holding', async () => {
      const { fixture } = await render(InstrumentComponent, {
        imports: [CommonModule],
        declarations: [InstrumentComponent],
        componentProperties: {
          stock: mockStock,
          holding: undefined
        }
      });

      expect(fixture.componentInstance.shares).toBe(0);
    });
  });

  describe('onInstrumentClick method', () => {
    it('should emit instrumentClick when clickable is true', async () => {
      const { fixture } = await render(InstrumentComponent, {
        imports: [CommonModule],
        declarations: [InstrumentComponent],
        componentProperties: {
          stock: mockStock,
          clickable: true
        }
      });

      const component = fixture.componentInstance;
      jest.spyOn(component.instrumentClick, 'emit');

      component.onInstrumentClick();

      expect(component.instrumentClick.emit).toHaveBeenCalledWith(mockStock);
    });

    it('should not emit instrumentClick when clickable is false', async () => {
      const { fixture } = await render(InstrumentComponent, {
        imports: [CommonModule],
        declarations: [InstrumentComponent],
        componentProperties: {
          stock: mockStock,
          clickable: false
        }
      });

      const component = fixture.componentInstance;
      jest.spyOn(component.instrumentClick, 'emit');

      component.onInstrumentClick();

      expect(component.instrumentClick.emit).not.toHaveBeenCalled();
    });
  });
});