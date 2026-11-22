const API_BASE = import.meta.env.VITE_API_URL ?? '/tsg/api/v1';

export type ManagementCompanyLink = { title: string; url: string };

export type HouseInfo = {
  title: string;
  address: string;
  description: string;
  year_built: number;
  management_company: string;
  management_links: ManagementCompanyLink[];
  phone: string;
  email: string;
};

export type GalleryItem = {
  id: number;
  url: string;
  caption: string;
  sort_order: number;
};

export type NewsPreview = {
  slug: string;
  title: string;
  summary: string;
  published_at: string;
  cover_url: string | null;
};

export type NewsArticle = NewsPreview & { body_html: string };

export type DonationCreateResponse = {
  order_id: string;
  payment_url: string;
  amount_rub: number;
};

export type DonationStatus = {
  order_id: string;
  status: 'pending' | 'paid' | 'failed';
  amount_rub: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getHouse: () => request<HouseInfo>('/house'),
  getGallery: () => request<GalleryItem[]>('/gallery'),
  getNews: () => request<NewsPreview[]>('/news'),
  getNewsArticle: (slug: string) => request<NewsArticle>(`/news/${slug}`),
  createDonation: (amount_rub: number, comment?: string) =>
    request<DonationCreateResponse>('/donations/create', {
      method: 'POST',
      body: JSON.stringify({ amount_rub, comment }),
    }),
  getDonationStatus: (orderId: string) =>
    request<DonationStatus>(`/donations/${orderId}`),
  mockCompletePayment: (orderId: string, success: boolean) =>
    request<DonationStatus>('/donations/mock/complete', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, success }),
    }),
};