import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Chat } from "./Chat";

@Entity("matches")
export class Match extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  matchName: string;

  matchProfilePicture: string;

  @Column('text', { nullable: true })
  status: string;
  
  @Column('text', { nullable: true })
  likedId: string;
  
  @Column('text', { nullable: true })
  matchedId: string;

  @ManyToOne(() => User)
  liked: User
  
  @ManyToOne(() => User)
  matched: User
  
  @OneToOne(() => Chat)
  chat: Chat

  @CreateDateColumn("")
  createdAt: string
}

export class MatchPayload {
  matchName: string
  matchProfilePicture: string
}