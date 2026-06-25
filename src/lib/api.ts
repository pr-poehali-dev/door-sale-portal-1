export const DOORS_API = 'https://functions.poehali.dev/06f1a02b-49be-4788-9e2e-337292012c03';

export interface Door {
  id: number;
  name: string;
  type: string;
  material: string;
  price: number;
  width: number;
  height: number;
  img: string;
}
