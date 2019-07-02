import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BennettComponent } from './bennett.component';

describe('BennettComponent', () => {
  let component: BennettComponent;
  let fixture: ComponentFixture<BennettComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BennettComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BennettComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
