import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity("dislikes")
export class Dislike extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('text', { nullable: true })
  senderId: string;
  
  @Column('text', { nullable: true })
  receiverId: string;

  @ManyToOne(() => User)
  sender: User;
  
  @ManyToOne(() => User)
  receiver: User;
  
  @CreateDateColumn("")
  createdAt: string;
}
