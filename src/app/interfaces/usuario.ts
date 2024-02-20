import { ClasesUsuario } from "./clasesUsuario";
import { TiposDocumento } from "./tiposDocumento";
import { TiposUsuario } from "./tiposUsuario";

export class Usuario {
  constructor(
    public id_usuario: number,
    public foto: string,
    public nombre: string,
    public apellido: string,
    public correo: string,
    public telefono: string,
    public genero: string,
    public contrasenia: string,
    public fecha_nacimiento: string,
    public ubicacion: string,
    public numero_documento: string,
    public id_tipo_usuario: number,
    public id_tipo_documento: number,
    public id_clase_usuario: number,
    public tipo_usuario?: TiposUsuario,
    public tipo_documento?: TiposDocumento,
    public clase_usuario?: ClasesUsuario,
  ) { }
}
