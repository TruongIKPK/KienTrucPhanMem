export interface IProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface ICart {
  userId: string;
  items: Record<string, number>;
}

export interface IStock {
  productId: string;
  stock: number;
}

export interface IOrder {
  orderId: string;
  userId: string;
  items: Record<string, number>;
  total: number;
  createdAt: string;
}

export interface IAddCartReq {
  userId: string;
  productId: string;
  quantity: number;
}

export interface IRemoveCartReq {
  userId: string;
  productId: string;
  quantity: number;
}
