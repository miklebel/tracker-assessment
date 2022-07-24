import { IsNumber, ValidateNested } from "class-validator";
import { Track } from "./Track";

// Тестовое конечно же маленькое, но было бы неплохо как-то отделять сессии/пользователей.
export class SessionBuffer {
  @IsNumber()
  sessionId: number;

  @ValidateNested()
  tracks: Track[];
}
