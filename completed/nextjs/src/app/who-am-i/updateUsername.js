"use server";
import { AsyncDatabase } from "promised-sqlite3";
import { redirect } from "next/navigation";

export default async function updateUsername(formData) {
  console.log("updateUsername called", formData);

  const username = formData.get("username");

  if (!username) {
    throw new Error("Username is required");
  }

  const db = await AsyncDatabase.open("./notes.db");
  await db.run("UPDATE users SET name = ?", [username]);
  redirect("/");
}
