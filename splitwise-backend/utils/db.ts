import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function upsertUser(id: string, email: string, name: string) {
  // Check if user already exists by email or id
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { id }],
    },
  });

  if (existingUser) {
    console.log('User already exists:', existingUser.email);
    return existingUser;
  }

  // User doesn’t exist, create them
  const newUser = await prisma.user.create({
    data: {
      id,
      email,
      name,
    },
  });

  
  await seedForNewUser(newUser);

  return {...newUser,isNewUser: true};
}

// Seed function tailored for a single new user using existing dummy users
async function seedForNewUser(newUser: { id: string; email: string; name: string }) {
  // Predefined dummy user IDs from seed.ts (assumed to exist)
  const friendIds = [
    'friend1-id', // Alice
    'friend2-id', // Bob
    'friend3-id', // Charlie
    'friend4-id', // Diana
    'friend5-id', // Eve
    'friend6-id', // Frank
    'friend7-id', // Grace
    'friend8-id', // Hank
  ];

  // Seed Friendships (new user becomes friends with all dummy users)
  await prisma.friend.createMany({
    data: friendIds.map(friendId => {
      const [userId1, userId2] = [newUser.id, friendId].sort(); // Ensure consistent ordering
      return { userId1, userId2 };
    }),
    skipDuplicates: true, // Skip if friendships already exist
  });

  // Seed Transactions (20 transactions, 3 pre-split)
  await prisma.transaction.createMany({
    data: [
      // Pre-split transactions
      { id: `${newUser.id}-tx1`, description: 'Group Dinner', amount: 250.0, date: new Date('2025-03-15'), userId: newUser.id, isSplit: true },
      { id: `${newUser.id}-tx2`, description: 'Coffee Run', amount: 22.5, date: new Date('2025-03-13'), userId: newUser.id, isSplit: true },
      { id: `${newUser.id}-tx3`, description: 'Concert Tickets', amount: 300.0, date: new Date('2025-03-08'), userId: newUser.id, isSplit: true },
      // Unsplit transactions
      { description: 'Movie Night', amount: 45.0, date: new Date('2025-03-14'), userId: newUser.id, isSplit: false },
      { description: 'Groceries', amount: 95.75, date: new Date('2025-03-12'), userId: newUser.id, isSplit: false },
      { description: 'Team Lunch', amount: 180.0, date: new Date('2025-03-11'), userId: newUser.id, isSplit: false },
      { description: 'Road Trip Gas', amount: 60.2, date: new Date('2025-03-10'), userId: newUser.id, isSplit: false },
      { description: 'Book Purchase', amount: 30.99, date: new Date('2025-03-09'), userId: newUser.id, isSplit: false },
      { description: 'Pizza Party', amount: 50.0, date: new Date('2025-03-07'), userId: newUser.id, isSplit: false },
      { description: 'Gym Fee', amount: 70.0, date: new Date('2025-03-06'), userId: newUser.id, isSplit: false },
      { description: 'Brunch Meetup', amount: 85.5, date: new Date('2025-03-05'), userId: newUser.id, isSplit: false },
      { description: 'Taxi Ride', amount: 25.3, date: new Date('2025-03-04'), userId: newUser.id, isSplit: false },
      { description: 'Group Gift', amount: 110.0, date: new Date('2025-03-03'), userId: newUser.id, isSplit: false },
      { description: 'Parking Fee', amount: 15.0, date: new Date('2025-03-02'), userId: newUser.id, isSplit: false },
      { description: 'BBQ Party', amount: 150.0, date: new Date('2025-03-01'), userId: newUser.id, isSplit: false },
      { description: 'Streaming Subscription', amount: 19.99, date: new Date('2025-02-28'), userId: newUser.id, isSplit: false },
      { description: 'Bowling Night', amount: 75.0, date: new Date('2025-02-27'), userId: newUser.id, isSplit: false },
      { description: 'Client Lunch', amount: 55.75, date: new Date('2025-02-26'), userId: newUser.id, isSplit: false },
      { description: 'Picnic Supplies', amount: 80.2, date: new Date('2025-02-25'), userId: newUser.id, isSplit: false },
      { description: 'Bus Tickets', amount: 12.5, date: new Date('2025-02-24'), userId: newUser.id, isSplit: false },
    ],
  });

  // Seed Splits for the 3 pre-split transactions
  const splitTxs = [
    { id: `${newUser.id}-tx1`, amount: 250.0 },
    { id: `${newUser.id}-tx2`, amount: 22.5 },
    { id: `${newUser.id}-tx3`, amount: 300.0 },
  ];

  function getRandomFriends(arr: string[], count: number): string[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const splitsData = [];
  for (const tx of splitTxs) {
    let selectedFriendIds: string[];
    let splitAmount: number;

    if (tx.id === `${newUser.id}-tx1`) {
      selectedFriendIds = friendIds; // All 8 friends
      splitAmount = tx.amount / 8;
    } else if (tx.id === `${newUser.id}-tx2`) {
      selectedFriendIds = getRandomFriends(friendIds, 3); // Random 3 friends
      splitAmount = tx.amount / 3;
    } else if (tx.id === `${newUser.id}-tx3`) {
      selectedFriendIds = getRandomFriends(friendIds, 4); // Random 4 friends
      splitAmount = tx.amount / 4;
    } else {
      continue;
    }

    splitsData.push(
      ...selectedFriendIds.map(friendId => ({
        transactionId: tx.id,
        userId: friendId,
        amountOwed: splitAmount,
      }))
    );
  }

  await prisma.split.createMany({
    data: splitsData,
    skipDuplicates: true,
  });

  console.log(`Seed data (friendships and transactions) created for new user: ${newUser.email}`);
}

export default prisma;