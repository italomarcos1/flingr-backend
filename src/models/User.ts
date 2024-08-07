import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
// import { Match } from "./Match";
// import { Chat } from "./Chat";
// import { Like } from "./Like";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text', { nullable: true })
  name: string;
  
  @Column('text', { nullable: true, unique: true })
  email: string;  
  
  password: string;

  @Column('text', { nullable: true })
  passwordHash: string;
  
  @Column('text', { nullable: true })
  profilePicture?: string;
  
  @Column('text', { nullable: true })
  bio: string;
  
  @Column('integer', { nullable: true })
  age: number;
  
  @Column('text', { nullable: true })
  gender: string;

  @CreateDateColumn("")
  createdAt: string

  @BeforeInsert()
  private async hashPassword() {
    this.passwordHash = await bcrypt.hash(this.password, 8);
  }
}

export class UserPayload {
  id: string;

  name: string;
  
  email: string;  
  
  password: string;

  passwordHash: string;
  
  profilePicture?: string;
  
  bio: string;
  
  age: number;
  
  gender: string;
}