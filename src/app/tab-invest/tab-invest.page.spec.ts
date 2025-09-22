import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { TabInvestPage } from './tab-invest.page';

describe('TabInvestPage', () => {
  let component: TabInvestPage;
  let fixture: ComponentFixture<TabInvestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabInvestPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TabInvestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
