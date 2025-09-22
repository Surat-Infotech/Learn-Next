import { Api } from '..';
import { IWishlistResponse, IWishlistAddRequest, IWishlistAddResponse } from './types';

class Wishlist extends Api {
  readonly baseUrl: string = 'v1/wishlist';

  /**
   * Method to add product/diamond to wishlist
   */
  readonly addWishlist = (payload: IWishlistAddRequest) =>
    this.http.post<IWishlistAddResponse>(this.route(''), payload);


  /**
   * Method to get wishlist
   */
  readonly getWishlist = () => this.http.get<IWishlistResponse>(this.route(``));

  /**
   * Method to remove a wishlist
   */
  readonly removeWishlist = (payload: { wishlists: string[] }) =>
    this.http.delete<IWishlistResponse>(this.route(''), { data: payload });
}

export const wishlistApi = new Wishlist();
