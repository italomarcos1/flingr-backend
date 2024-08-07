import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Match } from "./Match";
import { User } from "./User";

@Entity("chats")
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column('text', { nullable: true })
  starterId: string;

  @Column('text', { nullable: true })
  receiverId: string;

  @Column('text', { nullable: true })
  matchId: string;

  @ManyToOne(() => User)
  starter: User
  
  @ManyToOne(() => User)
  receiver: User

  @OneToOne(() => Match)
  match: Match

  @CreateDateColumn("")
  createdAt: string
}