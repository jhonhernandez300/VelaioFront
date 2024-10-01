import { Component, OnInit } from '@angular/core';
import { UsuarioTransferService } from '../../../servicios/usuario-transfer.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { iUsuarioConRolDTO } from '../../../interfaces/iUsuarioConRolDTO';
import { ApplicationDataService } from '../../../servicios/application-data.service';
import { iRol } from '../../../interfaces/iRol';
import { iUsuario } from '../../../interfaces/iUsuario';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.component.html',
  styleUrl: './actualizar-usuario.component.css'
})
export class ActualizarUsuarioComponent implements OnInit{
  usuario: iUsuario | null = null;
  myForm!: FormGroup;
  selectedRolId!: number;
  submitted = false;
  selectedUsuarioId!: number;      

  usuarioNuevo: iUsuario = {
    usuarioId: this.usuario?.usuarioId || 0,  
    nombre: '',  
    email: '',
    password: '',
    edad: 0,
    habilidades: [], 
    tarea: []  
  };

  constructor(
    private usuarioTransferService: UsuarioTransferService,    
    private formBuilder: FormBuilder,    
    private router: Router,
    public dialog: MatDialog,
    private applicationDataService: ApplicationDataService
  ){this.initializeForm();}

  ngOnInit(): void {
    this.obtenerUsuarioAEditar();    
  }

obtenerUsuarioAEditar(): void{
  this.usuarioTransferService.currentUser.subscribe(usuario => {
      
    if(usuario != null){
      this.usuario = usuario;       
      //console.log("usuario recibido ", this.usuario);     
      this.myForm.patchValue(usuario);            
    }      
  });  
}

eliminarHabilidad(habilidadId: number): void {
  if (this.usuario) {    
    if (this.usuario.habilidades.length > 1) {
      this.usuario.habilidades = this.usuario.habilidades.filter(
        (h) => h.habilidadId !== habilidadId
      );
    } else {
      // Mostrar modal si solo hay una habilidad
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Debe quedar al menos una habilidad" }  
      });
    }
  }
}

  private initializeForm(): void {
    this.myForm = this.formBuilder.group({                                      
      habilidadNueva: ['', [Validators.minLength(3), Validators.maxLength(30)]]
    });
  }

  validarContrasena(control: any) {
    const contrasena = control.value;
    const tieneMayuscula = /[A-Z]/.test(contrasena);
    const tieneMinuscula = /[a-z]/.test(contrasena);
    const tieneNumero = /\d/.test(contrasena);

    const esValido = tieneMayuscula && tieneMinuscula && tieneNumero;
    //console.log("Contraseña esValido ", esValido);
    return esValido ? null : { 'Al menos 1 mayúscula, 1 minúscula y 1 número': true };
  }


  public onReset(): void {
    this.submitted = false;
    this.myForm.reset();
  }

  agregarHabilidad() {
    if (this.myForm.get('habilidadNueva')?.invalid) {
      this.submitted = true;
      // No agregar si el campo es inválido
      return;  
    }

    const nuevaHabilidad = {
      nombre: this.myForm.get('habilidadNueva')?.value,
      // Ejemplo para generar un ID único temporalmente
      habilidadId: Date.now()  
    };

    if(this.usuario?.habilidades != null){
      this.usuario.habilidades.push(nuevaHabilidad);
    }    
    
    this.myForm.get('habilidadNueva')?.reset();
  }

  public async onSubmit(): Promise<void> {
    this.submitted = true;
  
    if (this.myForm.invalid) {
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Revise los valores del formulario" } 
      });
      return;
    }             
    
    await this.eliminarUsuarioYCrearNuevo(); 
  }
  
  async eliminarUsuarioYCrearNuevo(): Promise<void> {
    if (!this.usuario) {
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "No hay un usuario para actualizar" }  
      });
      return;
    }
  
    // Elimina el usuario existente
    this.applicationDataService.deleteUser(this.usuario.usuarioId);
    
    // Crea el nuevo usuario
    this.crearNuevoUsuario();
  }
  

  crearNuevoUsuario(): void {   
    if (!this.usuario) {
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "No hay un usuario para actualizar" }  
      });
      return;
    }
      
    this.usuarioNuevo = {
      usuarioId: this.usuario.usuarioId,
      nombre: this.myForm.get('nombre')?.value || this.usuario.nombre,
      email: this.myForm.get('email')?.value || this.usuario.email,
      password: this.myForm.get('password')?.value || this.usuario.password,
      edad: this.myForm.get('edad')?.value || this.usuario.edad,
      habilidades: this.usuario.habilidades, 
      tarea: this.usuario.tarea 
    };

    this.applicationDataService.addUser(this.usuarioNuevo);
    this.dialog.open(CloseDialogComponent, {            
      data: { message: "Usuario actualizado exitosamente." }  
    });
  
    this.router.navigate(['/obtener-todos-usuarios']);
  }
  

  get form(): { [key: string]: AbstractControl; }
  {
      return this.myForm.controls;
  }
}