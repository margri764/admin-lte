import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebMastersComponent } from './web-masters.component';

describe('WebMastersComponent', () => {
  let component: WebMastersComponent;
  let fixture: ComponentFixture<WebMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebMastersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
