import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDataService{
  private storageKey = 'users';

  constructor() { 
    if (!this.getUsers().length) {
      const defaultUsers =   [
        {
          "usuarioId": 1,
          "nombre": "Juan Pérez",
          "email": "juan.perez@example.com",
          "password": "password123",
          "edad": 30,
          "habilidades": [
            { "habilidadId": 1, "nombre": "Angular" },
            { "habilidadId": 2, "nombre": "TypeScript" }
          ],
          "tarea": {
            "tareaId": 1,
            "descripcion": "Crear componentes en Angular"
          }
        },
        {
          "usuarioId": 2,
          "nombre": "María Gómez",
          "email": "maria.gomez@example.com",
          "password": "securePass1",
          "edad": 25,
          "habilidades": [
            { "habilidadId": 3, "nombre": "JavaScript" },
            { "habilidadId": 4, "nombre": "CSS" }
          ],
          "tarea": {
            "tareaId": 2,
            "descripcion": "Desarrollar el frontend con JavaScript"
          }
        },
        {
          "usuarioId": 3,
          "nombre": "Pedro Sánchez",
          "email": "pedro.sanchez@example.com",
          "password": "qwerty123",
          "edad": 28,
          "habilidades": [
            { "habilidadId": 5, "nombre": "React" },
            { "habilidadId": 1, "nombre": "Angular" }
          ],
          "tarea": {
            "tareaId": 3,
            "descripcion": "Implementar la vista con React"
          }
        },
        {
          "usuarioId": 4,
          "nombre": "Ana López",
          "email": "ana.lopez@example.com",
          "password": "password456",
          "edad": 32,
          "habilidades": [
            { "habilidadId": 6, "nombre": "Vue.js" },
            { "habilidadId": 4, "nombre": "CSS" }
          ],
          "tarea": {
            "tareaId": 4,
            "descripcion": "Diseñar el estilo del proyecto en CSS"
          }
        },
        {
          "usuarioId": 5,
          "nombre": "Carlos Rivera",
          "email": "carlos.rivera@example.com",
          "password": "myPassword789",
          "edad": 35,
          "habilidades": [
            { "habilidadId": 2, "nombre": "TypeScript" },
            { "habilidadId": 3, "nombre": "JavaScript" }
          ],
          "tarea": {
            "tareaId": 5,
            "descripcion": "Escribir scripts en TypeScript"
          }
        },
        {
          "usuarioId": 6,
          "nombre": "Lucía Fernández",
          "email": "lucia.fernandez@example.com",
          "password": "luciaPass123",
          "edad": 29,
          "habilidades": [
            { "habilidadId": 7, "nombre": "Node.js" },
            { "habilidadId": 5, "nombre": "React" }
          ],
          "tarea": {
            "tareaId": 6,
            "descripcion": "Desarrollar el backend con Node.js"
          }
        }
      ];   
      this.setUsers(defaultUsers);
    }
  }

  getUsers() {
    const usersJson = localStorage.getItem(this.storageKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }
  
  setUsers(users: any[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }
  
  // updateUser(usuarioId: number, updatedUser: any) {
  //   const users = this.getUsers();
  //   const index = users.findIndex(user => user.usuarioId === usuarioId);
  //   if (index !== -1) {
  //     users[index] = { ...users[index], ...updatedUser };
  //     this.setUsers(users); // Actualiza localStorage
  //   }
  // }
  
  addUser(newUser: any) {
    const users = this.getUsers();
    // Agrega y actualiza localStorage
    this.setUsers([...users, newUser]); 
  }
 
}
