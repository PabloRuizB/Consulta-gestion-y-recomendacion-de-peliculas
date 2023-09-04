import { CastRoleEnum } from "./movie-cast-role";

export class MovieCast {

  constructor(
    public name: string,
    public role: CastRoleEnum
  ){}
}
