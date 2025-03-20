import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  // Clear existing data
  await prisma.split.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.friend.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users (your user + 8 friends)
  const myUser = await prisma.user.create({
    data: {
      id: "8dcdfcb5-d155-4923-8f23-77af9bf6ccbe",
      email: "shanmukhaaditya9@gmail.com",
      name: "Aditya",
    },
  });

  const friends = await prisma.user.createMany({
    data: [
      { id: "friend1-id", email: "alice@example.com", name: "Alice" },
      { id: "friend2-id", email: "bob@example.com", name: "Bob" },
      { id: "friend3-id", email: "charlie@example.com", name: "Charlie" },
      { id: "friend4-id", email: "diana@example.com", name: "Diana" },
      { id: "friend5-id", email: "eve@example.com", name: "Eve" },
      { id: "friend6-id", email: "frank@example.com", name: "Frank" },
      { id: "friend7-id", email: "grace@example.com", name: "Grace" },
      { id: "friend8-id", email: "hank@example.com", name: "Hank" },
    ],
  });

  const allUsers = await prisma.user.findMany(); // Fetch all users for friendship creation

  // Helper function to create friendships with userId1 as lower ID
  async function createFriendship(userIdA: string, userIdB: string) {
    const [userId1, userId2] = [userIdA, userIdB].sort(); // Ensure userId1 < userId2
    const existing = await prisma.friend.findUnique({
      where: { userId1_userId2: { userId1, userId2 } },
    });
    if (!existing) {
      await prisma.friend.create({
        data: { userId1, userId2 },
      });
    }
  }

  // Seed Friendships (Aditya is friends with everyone, plus some inter-friend connections)
  for (const friend of allUsers) {
    if (friend.id !== myUser.id) {
      await createFriendship(myUser.id, friend.id); // Aditya ↔ Each friend
    }
  }
  await createFriendship("friend1-id", "friend2-id"); // Alice ↔ Bob
  await createFriendship("friend3-id", "friend4-id"); // Charlie ↔ Diana
  await createFriendship("friend5-id", "friend6-id"); // Eve ↔ Frank
  await createFriendship("friend7-id", "friend8-id"); // Grace ↔ Hank

  // Seed Transactions (20 transactions, only 3 pre-split)
  await prisma.transaction.createMany({
    data: [
      // Pre-split transactions (3)
      {
        id: "tx1",
        description: "Group Dinner",
        amount: 250.0,
        date: new Date("2025-03-15"),
        userId: myUser.id,
        isSplit: true,
      },
      {
        id: "tx2",
        description: "Coffee Run",
        amount: 22.5,
        date: new Date("2025-03-13"),
        userId: myUser.id,
        isSplit: true,
      },
      {
        id: "tx3",
        description: "Concert Tickets",
        amount: 300.0,
        date: new Date("2025-03-08"),
        userId: myUser.id,
        isSplit: true,
      },
      // Unsplit transactions (17)
      {
        description: "Movie Night",
        amount: 45.0,
        date: new Date("2025-03-14"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Groceries",
        amount: 95.75,
        date: new Date("2025-03-12"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Team Lunch",
        amount: 180.0,
        date: new Date("2025-03-11"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Road Trip Gas",
        amount: 60.2,
        date: new Date("2025-03-10"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Book Purchase",
        amount: 30.99,
        date: new Date("2025-03-09"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Pizza Party",
        amount: 50.0,
        date: new Date("2025-03-07"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Gym Fee",
        amount: 70.0,
        date: new Date("2025-03-06"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Brunch Meetup",
        amount: 85.5,
        date: new Date("2025-03-05"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Taxi Ride",
        amount: 25.3,
        date: new Date("2025-03-04"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Group Gift",
        amount: 110.0,
        date: new Date("2025-03-03"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Parking Fee",
        amount: 15.0,
        date: new Date("2025-03-02"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "BBQ Party",
        amount: 150.0,
        date: new Date("2025-03-01"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Streaming Subscription",
        amount: 19.99,
        date: new Date("2025-02-28"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Bowling Night",
        amount: 75.0,
        date: new Date("2025-02-27"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Client Lunch",
        amount: 55.75,
        date: new Date("2025-02-26"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Picnic Supplies",
        amount: 80.2,
        date: new Date("2025-02-25"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Bus Tickets",
        amount: 12.5,
        date: new Date("2025-02-24"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Game Night Snacks",
        amount: 35.0,
        date: new Date("2025-02-23"),
        userId: myUser.id,
        isSplit: false,
      },
      {
        description: "Museum Entry",
        amount: 25.0,
        date: new Date("2025-02-22"),
        userId: myUser.id,
        isSplit: false,
      },
    ],
  });

  // Seed Splits for the 3 split transactions
  const splitTxs = await prisma.transaction.findMany({
    where: { userId: myUser.id, isSplit: true },
  });

  const friendIds = [
    "friend1-id",
    "friend2-id",
    "friend3-id",
    "friend4-id",
    "friend5-id",
    "friend6-id",
    "friend7-id",
    "friend8-id",
  ];

  // Helper function to shuffle array and pick random elements
  function getRandomFriends(arr: string[], count: number): string[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  for (const tx of splitTxs) {
    let selectedFriendIds: string[];
    let splitAmount: number;

    if (tx.id === "tx1") {
      // "Group Dinner" - Split with all 8 friends
      selectedFriendIds = friendIds;
      splitAmount = tx.amount / 8;
    } else if (tx.id === "tx2") {
      // "Coffee Run" - Split with random 3 friends
      selectedFriendIds = getRandomFriends(friendIds, 3);
      splitAmount = tx.amount / 3;
    } else if (tx.id === "tx3") {
      // "Concert Tickets" - Split with random 4 friends
      selectedFriendIds = getRandomFriends(friendIds, 4);
      splitAmount = tx.amount / 4;
    } else {
      continue; // Shouldn’t happen, but safety check
    }

    await prisma.split.createMany({
      data: selectedFriendIds.map(friendId => ({
        transactionId: tx.id,
        userId: friendId,
        amountOwed: splitAmount,
      })),
    });
  }

  console.log("Seed data created successfully!");
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });