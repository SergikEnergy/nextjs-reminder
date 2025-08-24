import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { invoices, customers, revenue, users } from '../lib/placeholder-data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function seedUsers(sql: postgres.Sql) {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    );
  `;

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );
    console.log('doneUsers');

    return insertedUsers;
  } catch (err) {
    console.log('catchUsers', err);
    throw err;
  }
}

async function seedInvoices(sql: postgres.Sql) {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      customer_id UUID NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    );
  `;

    const insertedInvoices = await Promise.all(
      invoices.map(
        (invoice) => sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `
      )
    );
    console.log('doneInvoices');

    return insertedInvoices;
  } catch (error) {
    console.log('catchInvoices', error);
    throw error;
  }
}

async function seedCustomers(sql: postgres.Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    );
  `;

  const insertedCustomers = await Promise.all(
    customers.map(
      (customer) => sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );
  console.log('doneCustomers');

  return insertedCustomers;
}

async function seedRevenue(sql: postgres.Sql) {
  try {
    await sql`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );
  `;

    const insertedRevenue = await Promise.all(
      revenue.map(
        (rev) => sql`
        INSERT INTO revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `
      )
    );
    console.log('doneRevenue');

    return insertedRevenue;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GET() {
  try {
    // Create extension once at the beginning
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Use a single transaction for all operations
    const result = await sql.begin(async (tx) => {
      await seedUsers(tx);
      await seedCustomers(tx);
      await seedInvoices(tx);
      await seedRevenue(tx);
      return { message: 'Database seeded successfully' };
    });

    console.log('try');
    return Response.json(result);
  } catch (error) {
    console.log('catch', error);
    return Response.json({ error }, { status: 500 });
  }
}
