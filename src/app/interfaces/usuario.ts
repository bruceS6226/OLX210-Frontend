import { ClasesUsuario } from "./clasesUsuario";
import { TiposDocumento } from "./tiposDocumento";
import { TiposUsuario } from "./tiposUsuario";
import { Rol } from "./rol";
import { Comportamiento } from "./comportamiento";
import { EstadoDatos } from "./estadoDatos";

export class Usuario {
  constructor(
    public id_usuario: number,
    public foto: string,
    public nombre: string,
    public nombre_cuenta: string,
    public apellido: string,
    public correo: string,
    public telefono: string,
    public genero: string,
    public contrasenia: string,
    public fecha_nacimiento: string,
    public ubicacion: string,
    public numero_documento: string,
    public correo_verificado: boolean,
    public bloqueado: boolean,
    public id_tipo_usuario: number,
    public id_tipo_documento: number,
    public id_clase_usuario: number,
    public id_rol: number,
    public id_comportamiento: number,
    public id_estado_datos: number,
    public tipo_usuario?: TiposUsuario,
    public tipo_documento?: TiposDocumento,
    public clase_usuario?: ClasesUsuario,
    public comportamiento?: Comportamiento,
    public estado_datos?: EstadoDatos,
    public rol?: Rol,
  ) { }
}
