
export interface MemosItem {
  error: any;
  status:      boolean;
  _id:         string;
  name:        string;
  description: string;
  __v:         number;
}

export interface IdeasItem {
  _id: string;
  isDefault: boolean;
  name: string;
  group: string;
  text: string
  createdAt: string
  updatedAt: string
  __v: number
}
