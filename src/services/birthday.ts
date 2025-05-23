import 'server-only';

import { eq } from 'drizzle-orm';
import { db, birthdays, type NewBirthday, type Birthday } from '~/lib/db';

/**
 * Fetches all birthdays from the database.
 * @returns A promise that resolves to an array of Birthday objects.
 */
async function getBirthdays(userId: string): Promise<{ birthdays: Birthday[] }> {
  const birthdayRecords = await db.select().from(birthdays).where(eq(birthdays.userId, userId));

  return {
    birthdays: birthdayRecords as Birthday[]
  };
}

/**
 * Adds a new birthday record.
 * @param birthday - The birthday object to be added
 * @returns A promise that resolves to the added Birthday object
 */
async function addBirthday(birthday: Omit<NewBirthday, 'id'>) {
  const [newBirthday] = await db.insert(birthdays).values({
    name: birthday.name,
    date: birthday.date,
    userId: birthday.userId
  }).returning();

  return newBirthday as Birthday;
}

/**
 * Deletes a birthday record from the database.
 * @param id - The unique identifier of the birthday record to be deleted
 * @returns A promise that resolves to the id of the deleted birthday record
 */
async function deleteBirthday(id: string) {
  const [deletedBirthday] = await db.delete(birthdays).where(eq(birthdays.id, id)).returning({ id: birthdays.id });

  return deletedBirthday?.id;
}

export {
  getBirthdays,
  addBirthday,
  deleteBirthday,
};
