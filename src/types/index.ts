export interface Dashboard {
  id: string;
  template_id: string;
  status: 'Draft' | 'Saved' | 'Active' | 'Published';
  type: string;
  template_name: string;
  created_at: string | Date;
  updated_at: string | Date;
  meta: any;
  user_id: string;
}