import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { Animation, AnimationController, GestureController } from '@ionic/angular';
import { StockInstrument, BuyOrder } from '../models/stock.model';

@Component({
  selector: 'app-buy-order',
  templateUrl: './buy-order.component.html',
  styleUrls: ['./buy-order.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuyOrderComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('modal', { static: false }) modal!: ElementRef;
  @ViewChild('buyButton', { static: false }) buyButton!: ElementRef;
  
  @Input() stock!: StockInstrument;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() orderPlaced = new EventEmitter<BuyOrder>();

  amount: number = 500;
  shares: number = 8.55;
  
  private slideUpAnimation?: Animation;
  private swipeGesture?: any;

  constructor(
    private animationCtrl: AnimationController,
    private gestureCtrl: GestureController
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true && !changes['isOpen'].previousValue) {
      setTimeout(() => {
        this.open();
      }, 0);
    }
    
    if (changes['stock'] && this.stock) {
      this.calculateShares();
    }
  }

  ngOnInit() {
    if (this.stock) {
      this.calculateShares();
    }
  }

  ngAfterViewInit() {
    if (this.isOpen) {
      this.initializeAnimations();
      this.setupSwipeGesture();
    }
  }

  private calculateShares() {
    if (this.stock && this.stock.price > 0) {
      this.shares = Math.round((this.amount / this.stock.price) * 100) / 100;
    }
  }

  private calculateAmount() {
    if (this.stock && this.stock.price > 0) {
      this.amount = Math.round(this.shares * this.stock.price * 100) / 100;
    }
  }

  private initializeAnimations() {
    if (this.modal) {
      this.slideUpAnimation = this.animationCtrl
        .create()
        .addElement(this.modal.nativeElement)
        .duration(300)
        .easing('ease-out')
        .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
    }
  }

  private setupSwipeGesture() {
    if (this.buyButton) {
      this.swipeGesture = this.gestureCtrl.create({
        el: this.buyButton.nativeElement,
        threshold: 15,
        gestureName: 'swipe-to-buy',
        onMove: (ev) => this.onSwipeMove(ev),
        onEnd: (ev) => this.onSwipeEnd(ev),
      });
      this.swipeGesture.enable();
    }
  }

  private onSwipeMove(ev: any) {
    if (!this.buyButton) return;
    
    const button = this.buyButton.nativeElement;
    const track = button.parentElement;
    const buttonWidth = button.offsetWidth;
    const trackWidth = track.offsetWidth;
    const maxSwipeDistance = trackWidth - buttonWidth - 8; // 8px for padding/margin
    const threshold = Math.max(maxSwipeDistance * 0.8, 150); // 80% of track or minimum 150px
    
    const deltaX = Math.max(0, ev.deltaX); // Only allow right movement
    const clampedDelta = Math.min(deltaX, maxSwipeDistance);
    
    // Update button position
    button.style.transform = `translateX(${clampedDelta}px)`;
    
    // Update text opacity based on swipe progress
    const swipeText = track.querySelector('.swipe-text');
    if (swipeText) {
      const textOpacity = Math.max(1 - (clampedDelta / (trackWidth * 0.6)), 0);
      swipeText.style.opacity = textOpacity.toString();
    }
  }

  private onSwipeEnd(ev: any) {
    if (!this.buyButton) return;
    
    const button = this.buyButton.nativeElement;
    const track = button.parentElement;
    const buttonWidth = button.offsetWidth;
    const trackWidth = track.offsetWidth;
    const maxSwipeDistance = trackWidth - buttonWidth - 8;
    const threshold = Math.max(maxSwipeDistance * 0.8, 150);
    
    if (ev.deltaX >= threshold) {

      this.completePurchase();
    } else {

      this.resetSwipeButton();
    }
  }

  private resetSwipeButton() {
    if (this.buyButton) {
      const button = this.buyButton.nativeElement;
      const track = button.parentElement;
      const swipeText = track?.querySelector('.swipe-text');
      
      button.style.transform = 'translateX(0px)';
      
      // Reset text opacity
      if (swipeText) {
        swipeText.style.opacity = '1';
      }
    }
  }

  open() {
    // Ensure animations are initialized when opening the modal
    // Use setTimeout to ensure DOM is updated before initializing animations
    setTimeout(() => {
      if (!this.slideUpAnimation && this.modal) {
        this.initializeAnimations();
      }
      if (!this.swipeGesture && this.buyButton) {
        this.setupSwipeGesture();
      }
      if (this.slideUpAnimation) {
        this.slideUpAnimation.play();
      }
    }, 0);
  }

  close() {
    if (this.slideUpAnimation) {
      this.slideUpAnimation.direction('reverse').play();
      setTimeout(() => {
        this.closeModal.emit();
      }, 300);
    } else {
      this.closeModal.emit();
    }
  }

  onAmountChange() {
    if (this.amount < 0) {
      this.amount = 0;
    }
    this.calculateShares();
  }

  onSharesChange() {
    if (this.shares < 0) {
      this.shares = 0;
    }
    this.calculateAmount();
  }

  completePurchase() {
    const order: BuyOrder = {
      stock: this.stock,
      shares: this.shares,
      orderType: 'market',
      estimatedTotal: this.amount
    };

    this.orderPlaced.emit(order);
    this.close();
    this.resetSwipeButton();
  }
}