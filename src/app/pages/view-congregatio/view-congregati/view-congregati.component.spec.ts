import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCongregatiComponent } from './view-congregati.component';

describe('ViewCongregatiComponent', () => {
  let component: ViewCongregatiComponent;
  let fixture: ComponentFixture<ViewCongregatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCongregatiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCongregatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
