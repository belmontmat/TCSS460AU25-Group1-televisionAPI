/**
 * Server management code for Group 1 Television API
 * 
 * @author Preston Sia, Mathew Belmont, Sean Miller, Abdul Hassan
 */

import createApp from '@/app';          // Import from app.ts

const PORT = process.env.PORT || 8000;  // FIXME BAD PRACTICE PLEASE FIX

const app = createApp();                // launch the Express app

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown

