import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const [, , emailArg, passwordArg] = process.argv;
const email = String(emailArg ?? '').trim().toLowerCase();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !passwordArg || passwordArg.length < 8) {
    console.log('Usage: node scripts/createAdmin.js <email> <password (8+ characters)>');
    process.exit(1);
}

try {
    const hash = await bcrypt.hash(passwordArg, 10);
    await pool.query('INSERT INTO admin(email, password_hash) VALUES (?, ?)', [email, hash]);
    console.log(`Admin created: ${email}`);
} catch (e) {
    console.log(e.code === 'ER_DUP_ENTRY' ? 'That email already exists.' : e);
} finally {
    await pool.end();
}