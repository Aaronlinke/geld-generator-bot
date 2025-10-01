export type BotStatus = "active" | "paused" | "maintenance";

export interface Bot {
  id: string;
  name: string;
  description: string;
  earnings: string;
  dailyProfit: string;
  status: BotStatus;
  progress: number;
  icon: string;
}

export interface Withdrawal {
  id: string;
  amount: string;
  date: string;
  method: string;
  status: "completed" | "pending" | "failed";
  account: string;
}

export interface Activity {
  id: string;
  type: "bot_started" | "bot_paused" | "withdrawal" | "earning" | "alert";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}
