
export interface Prize {
  id: string;
  label: string;
  value: string;
  color: string;
  icon: string;
}

export interface WinRecord {
  id: string;
  prize: Prize;
  timestamp: number;
}
