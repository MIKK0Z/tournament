import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqdrvubqzsuvkmdmiuhj.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZHJ2dWJxenN1dmttZG1pdWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY1MzMwNDQsImV4cCI6MjAzMjEwOTA0NH0.1B76cEr-O2MDLJM5InKzhz4b2XtMh_6oCdHtdklCB7M";
export const supabase = createClient(supabaseUrl, supabaseKey);
