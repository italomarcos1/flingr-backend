import { createConnection } from "typeorm";

export async function connect() {
  await createConnection();
}
