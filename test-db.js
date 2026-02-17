import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n📊 Fetching site_settings...');
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (settingsError) {
      console.error('❌ Settings Error:', settingsError);
    } else {
      console.log('✅ Settings:', settings?.hero_title);
    }

    console.log('\n📦 Fetching portfolio_items...');
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('display_order');

    if (portfolioError) {
      console.error('❌ Portfolio Error:', portfolioError);
    } else {
      console.log(`✅ Portfolio: ${portfolio?.length} items`);
    }

    console.log('\n🎬 Fetching video_reels...');
    const { data: videos, error: videosError } = await supabase
      .from('video_reels')
      .select('*')
      .eq('is_active', true)
      .order('order_index');

    if (videosError) {
      console.error('❌ Videos Error:', videosError);
    } else {
      console.log(`✅ Videos: ${videos?.length} items`);
    }

    console.log('\n🎯 Fetching services...');
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (servicesError) {
      console.error('❌ Services Error:', servicesError);
    } else {
      console.log(`✅ Services: ${services?.length} items`);
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

testConnection();
