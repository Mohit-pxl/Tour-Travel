require('dotenv').config();
const { createClerkClient } = require('@clerk/backend');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function setFirstUserAsAdmin() {
  try {
    console.log('Fetching users from Clerk...');
    const users = await clerkClient.users.getUserList({ limit: 10 });
    
    if (users.data.length === 0) {
      console.log('No users found in Clerk. Please sign up on the frontend first.');
      return;
    }

    const firstUser = users.data[0];
    const userId = firstUser.id;
    const email = firstUser.emailAddresses[0]?.emailAddress || 'No Email';
    
    console.log(`Found user: ${userId} (${email})`);
    console.log('Setting role: admin...');

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'admin'
      }
    });

    console.log('✅ Successfully set admin role for this user!');
    console.log('You can now log in and access the /admin page on the frontend.');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setFirstUserAsAdmin();
