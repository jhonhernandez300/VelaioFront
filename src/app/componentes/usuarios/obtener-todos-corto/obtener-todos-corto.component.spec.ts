import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObtenerTodosCortoComponent } from './obtener-todos-corto.component';

describe('ObtenerTodosCortoComponent', () => {
  let component: ObtenerTodosCortoComponent;
  let fixture: ComponentFixture<ObtenerTodosCortoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObtenerTodosCortoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObtenerTodosCortoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
