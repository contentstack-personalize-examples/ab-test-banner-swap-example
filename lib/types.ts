export interface PublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface File {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[];
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  publish_details: PublishDetails;
  $: any;
}

export interface Block {
  _version?: number;
  _metadata: any;
  $: any;
  title?: string;
  copy?: string;
  image?: File | null;
  layout?: ("image_left" | "image_right") | null;
}

export interface Blocks {
  block: Block;
}

export interface NavLink {
  title: string;
  href: string;
  $?: any;
}

export interface Navigation {
  nav_link: NavLink[];
  $?: any;
}

export interface Header {
  _content_type_uid: string;
  uid: string;
  brand_name: string;
  navigation: Navigation;
  title: string;
  $?: any;
}

export interface Banner {
  banner_image: File;
  banner_text: string;
  cta_text: string;
  $?: any;
}

export interface Product {
  _content_type_uid: string;
  uid: string;
  _version: number;
  locale: string;
  ACL: any;
  _in_progress: boolean;
  created_at: string;
  created_by: string;
  image: File;
  price: number;
  tags: string[];
  title: string;
  updated_at: string;
  updated_by: string;
  publish_details: PublishDetails;
  $?: any;
}

export interface BestSellers {
  best_selling_products: Product[];
  section_heading: string;
  $?: any;
}

export interface ProductsSection {
  section_heading: string;
  products: Product[];
  _metadata: {
    uid: string;
  };
  $?: any;
}

export interface Section {
  products_section?: ProductsSection;
  $?: any;
}

export interface GenericPage {
  uid: string;
  locale: string;
  _version: number;
  title: string;
  url: string;
  header?: Header[];
  sections: Section[];
  tags: string[];
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  publish_details: PublishDetails;
  $?: any;
}

export interface Page {
  uid: string;
  $: any;
  _version?: number;
  title: string;
  url?: string;
  description?: string;
  image?: File | null;
  rich_text?: string;
  blocks?: Blocks[];
  header?: Header[];
  banner?: Banner;
  best_sellers?: BestSellers;
}
