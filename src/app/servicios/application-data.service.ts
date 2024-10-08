import { Injectable } from '@angular/core';
import { iUsuario } from '../interfaces/iUsuario';
import { Observable, of } from 'rxjs';
import { iTarea } from '../interfaces/iTarea';

@Injectable({
  providedIn: 'root'
})
export class ApplicationDataService {
  private storageKey = 'users';

  constructor() { 
    if (!this.getUsers().length) {
      const defaultUsers: iUsuario[] = [
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
          "tarea": [
            {
              "tareaId": 1,
              "descripcion": "Crear componentes en Angular",
              "estado": "En proceso"
            },
            {
              "tareaId": 2,
              "descripcion": "Mejorar el rendimiento de la aplicación",
              "estado": "Terminada"
            }
          ]
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
          "tarea": [
            {
              "tareaId": 3,
              "descripcion": "Desarrollar el frontend con JavaScript",
              "estado": "En proceso"
            }
          ]
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
          "tarea": [
            {
              "tareaId": 4,
              "descripcion": "Implementar la vista con React",
              "estado": "En proceso"
            }
          ]
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
          "tarea": [
            {
              "tareaId": 5,
              "descripcion": "Diseñar el estilo del proyecto en CSS",
              "estado": "Terminada"
            }
          ]
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
          "tarea": [
            {
              "tareaId": 6,
              "descripcion": "Escribir scripts en TypeScript",
              "estado": "En proceso"
            }
          ]
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
          "tarea": [
            {
              "tareaId": 7,
              "descripcion": "Desarrollar el backend con Node.js",
              "estado": "Terminada"
            }
          ]
        },
        {
          "usuarioId": 1,
          "nombre": "Juan Pérez",
          "email": "juan.perezcastro@example.com",
          "password": "password123",
          "edad": 30,
          "habilidades": [
            { "habilidadId": 8, "nombre": "Angular" }            
          ],
          "tarea": [
            {
              "tareaId": 8,
              "descripcion": "Crear componentes en Angular",
              "estado": "En proceso"
            },
            {
              "tareaId": 9,
              "descripcion": "Mejorar el rendimiento de la aplicación",
              "estado": "Terminada"
            }
          ]
        },
      ];
      this.setUsers(defaultUsers);
    }
  }

  getUserByTaskId(tareaId: number): iUsuario | undefined {
    const users = this.getUsers();     
    return users.find(user => user.tarea.some(tarea => tarea.tareaId === tareaId));
  }

  getUsers(): iUsuario[] {    
    const users: iUsuario[] = JSON.parse(localStorage.getItem(this.storageKey) || '[]');

    // Asegurarse de que cada usuario tenga un arreglo de tareas
    return users.map((user: iUsuario) => ({
      ...user,
      tarea: Array.isArray(user.tarea) ? user.tarea : [] // Validar que 'tarea' sea un arreglo
    }));
  }
  
  setUsers(users: iUsuario[]): void {    
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }
  
  addTaskToUser(usuarioId: number, nuevaTarea: iTarea): void {
    const users = this.getUsers(); // Obtener la lista de usuarios
    const userIndex = users.findIndex(user => user.usuarioId === usuarioId);
    
    if (userIndex !== -1) {
      // Verifica si 'tarea' es un arreglo antes de hacer push
      if (!Array.isArray(users[userIndex].tarea)) {
        // Si no es un arreglo, inicialízalo como un arreglo vacío
        users[userIndex].tarea = [];
      }
      
      users[userIndex].tarea.push(nuevaTarea); // Agregar la nueva tarea
      this.setUsers(users); // Guardar los cambios en localStorage
    } else {
      console.error("Usuario no encontrado."); // Mensaje de error si no se encuentra el usuario
    }
  } 
  
  addUser(newUser: iUsuario) {
    const users = this.getUsers();
    // Agrega y actualiza localStorage
    this.setUsers([...users, newUser]); 
  }

  deleteUser(usuarioId: number): void {
    const users = this.getUsers();
    const updatedUsers = users.filter(user => user.usuarioId !== usuarioId);
    this.setUsers(updatedUsers);
  }
}