import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit{

  cart: Cart = { items: [{
      product: 'https://via.placeholder.com/150',
      name: 'snickers',
      price: 20,
      quantity: 2,
      id: 5432,
    }
  ]};
  dataSource: Array<CartItem> = [];

  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ]

  constructor(private cartService: CartService , private http: HttpClient) { }
  
  
  ngOnInit(): void {
     
     this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
     })
   }

   getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
   }


   onClearCart(): void {
    this.cartService.clearCart()
   }

   onRemoveFromCart(item: CartItem):void {
    this.cartService.removeFromCart(item);
   }

   onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
   }

   onRemoveQuantity(item: CartItem): void{
    this.cartService.removeQuantity(item);
   }

   onCheckout(): void {
      this.http.post('http://localhost:4242/checkout',{
        items: this.cart.items
      }).subscribe(async(res: any) => {
        let stripe = await loadStripe('pk_test_51MbinlSHtWG2x5YG09Vx1k1u6yAe05YK7ebtChTvBb9nfweWrH8HwIijt6A0nq2ZgJ6NDpD39w7tmagR2dPigGwp00mfmgIrSA');
        stripe?.redirectToCheckout({
          sessionId: res.id
        })
      })
   }

}
