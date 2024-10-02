import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDataService } from '../../../servicios/application-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from '../../general/close-dialog/close-dialog.component';
import { iUsuarioSinIdDTO } from '../../../interfaces/iUsuarioSinIdDTO';
import { UsuarioTransferService } from '../../../servicios/usuario-transfer.service';
import { iUsuario } from '../../../interfaces/iUsuario';

@Component({
  selector: 'app-guardar-usuario',
  templateUrl: './guardar-usuario.component.html',
  styleUrl: './guardar-usuario.component.css'
})
export class GuardarUsuarioComponent implements OnInit{
  myForm!: FormGroup; 
  submitted = false; 
  selectedUsuarioId!: number;
  selectedRolId: number = 0;
  
  usuarioNuevo: iUsuario = {
    usuarioId: 0,  
    nombre: '',  
    email: '',
    password: '',
    edad: 0,
    habilidades: [], 
    tarea: []  
  };
  
  constructor(
    private formBuilder: FormBuilder,
    private applicationDataService: ApplicationDataService,
    private router: Router,
    public dialog: MatDialog,
    private usuarioTransferService: UsuarioTransferService    
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {       
  }

  private initializeForm(): void {
    this.myForm = this.formBuilder.group({     
      //Número único 
      usuarioid: [Math.floor(Math.random() * 1000)],                          
      nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/), Validators.minLength(8), Validators.maxLength(30)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        this.validarContrasena 
      ]],
      edad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3), this.validarEdad]],
      habilidades: this.formBuilder.array([ // Inicializamos como un FormArray
        this.formBuilder.group({
          habilidadId: [Math.floor(Math.random() * 1000)],  
          nombre: ['Angular', Validators.required]
        })      
      ])
    });
  }

  validarEdad(control: AbstractControl) {
    const edadIngresada = control.value;        
    return edadIngresada > 18 ? null : { 'edadInvalida': true };    
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

  public async onSubmit(): Promise<void> {
    this.submitted = true;    
    //console.log("Form value ", this.myForm.value);        

    if (this.myForm.invalid) {
      //console.log('Error de validación')          
      this.dialog.open(CloseDialogComponent, {            
        data: { message: "Revisa los valores del formulario" } 
      });
      return;
    }            
    this.crearUsuarioNuevo();
    this. applicationDataService.addUser(this.usuarioNuevo);   
    this.dialog.open(CloseDialogComponent, {            
      data: { message: "Usuario grabado" } 
    });
    this.router.navigate(['/obtener-todos-usuarios']);
  }

  crearUsuarioNuevo(): void{
    this.usuarioNuevo = {
      usuarioId: this.myForm.get('usuarioId')?.value,
      nombre: this.myForm.get('nombre')?.value,
      email: this.myForm.get('email')?.value,
      password: this.myForm.get('password')?.value,
      edad: this.myForm.get('edad')?.value,
      habilidades: (this.myForm.get('habilidades') as FormArray).value, 
      tarea: []
    };
  }

  get form(): { [key: string]: AbstractControl; }
  {
      return this.myForm.controls;
  }
}

