import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPerfilAdminComponent } from './editar-perfil-admin.component';

describe('EditarPerfilAdminComponent', () => {
  let component: EditarPerfilAdminComponent;
  let fixture: ComponentFixture<EditarPerfilAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarPerfilAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPerfilAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
