export interface User {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  user_type: 'customer' | 'admin' | 'vastrakar';
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  vastrakar_id: string | null;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  delivery_date: string | null;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  customization_details: any;
  created_at: string;
  updated_at: string;
}

export interface VastrakarProfile {
  id: string;
  specialization: string;
  experience_years: number | null;
  rating: number | null;
  price_tier: 'low' | 'medium' | 'high';
  availability: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  vastrakar_id: string;
  order_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}