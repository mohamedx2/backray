const {createClient} = require('@supabase/supabase-js')

// Create a single supabase client for interacting with your database
const supabase = createClient('https://pgljrarxwfwyfdgepxay.supabase.co', process.env.SUPABASE_KEY)
module.exports = supabase