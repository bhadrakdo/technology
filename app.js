// 1. Initialize the Supabase Client
// Replace these with your actual project URL and Anon/Public Key from your Supabase settings
const SUPABASE_URL = 'https://supabase.co';
const SUPABASE_ANON_KEY = 'your-actual-anon-public-key';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Define your table name
const TABLE_NAME = 'your_table_name'; 

// 3. Start listening for real-time changes
const mySubscription = supabase
  .channel('any-room-name') // Name the channel anything you like
  .on(
    'postgres_changes', 
    { event: '*', schema: 'public', table: TABLE_NAME }, 
    (payload) => {
      console.log('Realtime change received!', payload);
      
      // Handle the data update based on the database event
      if (payload.eventType === 'INSERT') {
        addNewItemToUI(payload.new);
      } else if (payload.eventType === 'UPDATE') {
        updateItemInUI(payload.new);
      } else if (payload.eventType === 'DELETE') {
        removeItemFromUI(payload.old);
      }
    }
  )
  .subscribe();

// 4. Example: Function to write data to the database
async function sendDataToDatabase(inputValue) {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .insert([{ content: inputValue }]); // 'content' is an example column name

  if (error) console.error('Error sending data:', error);
}
