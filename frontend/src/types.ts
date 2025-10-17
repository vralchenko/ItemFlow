export interface Category {
    id: string;
    name: string;
}

export interface Item {
    id: string;
    name: string;
    image: string | null;
    category: string | null;
}