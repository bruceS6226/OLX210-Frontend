import { Categoria } from "./categoria";

export class Subcategoria {
  constructor(
    public id_subcategoria: number,
    public id_categoria: number,
    public nombre_subcategoria: string,
    public descripcion_subcategoria: string,
    public categoria?: Categoria,
  ) { }
}
