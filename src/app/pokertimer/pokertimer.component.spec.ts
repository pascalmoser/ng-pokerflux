import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PokertimerComponent } from './pokertimer.component';

describe('PokertimerComponent', () => {
  let component: PokertimerComponent;
  let fixture: ComponentFixture<PokertimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PokertimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PokertimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
