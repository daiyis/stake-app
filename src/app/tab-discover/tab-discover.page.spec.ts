import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabDiscoverPage } from './tab-discover.page';

describe('TabDiscoverPage', () => {
  let component: TabDiscoverPage;
  let fixture: ComponentFixture<TabDiscoverPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabDiscoverPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TabDiscoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
