import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  try {
    console.log('🔐 Creating admin user...');

    const { data, error } = await supabase.auth.admin.createUser({
      email: 'chitudanutvalentin@gmail.com',
      password: 'Admin12345!',
      email_confirm: true
    });

    if (error) {
      console.error('❌ Error creating admin:', error.message);
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: chitudanutvalentin@gmail.com');
    console.log('🔑 Password: Admin12345!');
    console.log('');
    console.log('You can now login at /admin-panel or /admin');

  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

createAdmin();
