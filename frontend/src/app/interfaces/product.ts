export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    stockQuantity: number;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;

    oldPrice?: number;
    discount?: number;
}
