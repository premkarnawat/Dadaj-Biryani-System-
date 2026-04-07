#!/usr/bin/env node
/**
 * Run ONCE to create the admin user in Supabase:
 *   node scripts/create-admin.js
 */
require('dotenv').config();
const bcrypt   = require('bcryptjs');
const supabase = require('../lib/supabase');

async function main() {
  const email    = process.env.ADMIN_EMAIL    || 'admin@dadajbiryani.com';
  const name     = process.env.ADMIN_NAME     || 'Super Admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const hash = await bcrypt.hash(password, 10);
  console.log('Hash generated:', hash.slice(0,20)+'...');

  const { data, error } = await supabase
    .from('admin_users')
    .upsert({ email, name, password_hash: hash }, { onConflict: 'email' })
    .select().single();

  if (error) { console.error('Error:', error.message); process.exit(1); }
  console.log('✅ Admin created/updated:', data.email);
}

main().catch(console.error);
