export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string;
  isSplit: boolean;
  user: { id: string; name: string };
  isPending?: boolean;
};
  export type Friend = {
    id: string;
    name: string;
    email?: string;
    createdAt?: string;
  };

  export type SplitDetail = {
    friendId: string;
    friendName: string;
    amountOwed: number;
  };