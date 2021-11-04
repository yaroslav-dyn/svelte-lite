
export interface MemosItem {
error: any;
  status:      boolean;
  _id:         string;
  name:        string;
  description: string;
  __v:         number;
}

export enum TemplateType {
  list = "list",
  apps = "apps"
}
