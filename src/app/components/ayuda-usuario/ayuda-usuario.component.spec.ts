import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaUsuarioComponent } from './ayuda-usuario.component';

describe('AyudaUsuarioComponent', () => {
  let component: AyudaUsuarioComponent;
  let fixture: ComponentFixture<AyudaUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyudaUsuarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AyudaUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
