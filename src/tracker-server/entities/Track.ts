import { IsArray, IsString, IsUrl, IsDate } from "class-validator";
import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class Track {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column({ type: "string" })
  @IsString()
  event: string;

  @Column({ type: "simple-array" })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Column({ type: "string" })
  @IsUrl({ require_tld: false })
  url: string;

  @Column({ type: "string" })
  @IsString()
  title: string;

  @Column({ type: "timestamp" })
  @IsDate()
  ts: Date;
}
