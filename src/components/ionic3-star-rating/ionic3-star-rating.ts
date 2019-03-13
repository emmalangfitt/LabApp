/*
  Adapted from but highly similar to melwin007's ionic3-star-rating
  found here https://github.com/melwinVincent/ionic3-star-rating
*/
import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular'

/*
  HTML to display five star icons in a row, changing color and
  empty/half/full setting based on the user's rating.
*/
const HTML_TEMPLATE =
`<div class="ionic3-star-rating">
  <button *ngFor="let index of [0,1,2,3,4]" id="{{index}}" type="button" ion-button icon-only (click)="changeRating($event)">
    <ion-icon
      [ngStyle]="{'color': setColor(rating, index)}"
      [name]="setStar(rating, index)">
    </ion-icon>
  </button>
</div>`

/*
  Css styling to size icons properly
*/
const CSS_STYLE = `
    .ionic3-star-rating .button {
        height: 28px;
        background: none;
        box-shadow: none;
        -webkit-box-shadow: none;
        width: 28px;
    }
    .ionic3-star-rating .button ion-icon {
        font-size: 32px;
    }
`

@Component({
  selector: 'ionic3-star-rating',
  template: HTML_TEMPLATE,
  styles: [CSS_STYLE]
})

export class Ionic3StarRatingComponent {
  @Input()
  rating: number = 3;
  @Input()
  readonly: string = "false"; // if rating can be changed or not
  @Input()
  activeColor : string = '#88A0A8'; // color of active stars
  @Input()
  defaultColor : string = '#f4f4f4'; // color of inactive stars
  @Input()
  activeIcon : string = 'ios-star'; // icon of full star
  @Input()
  defaultIcon : string = 'ios-star-outline'; // icon of inactive star
  @Input()
  halfIcon : string = 'ios-half-star'; // icon of half star

  Math: any;
  parseFloat : any;

  constructor(private events : Events) {
    this.Math = Math;
    this.parseFloat = parseFloat;
  }

  changeRating(event){
    if(this.readonly && this.readonly === "true") return;
    // event is different for firefox and chrome
    this.rating = event.target.id ? parseInt(event.target.id) + 1 : parseInt(event.target.parentElement.id) + 1;
    // subscribe this event to get the changed value in ypour parent compoanent
    this.events.publish('star-rating:changed', this.rating);
  }

  /*
    Logic to decide if star is empty, half-filled, or full.
    Based on the tenths value of the user's rating:
      0 - 2: empty
      3 - 7: half
      8 - 0: full
  */
  setStar(rating: number, index: number): string {
    if (((rating-index) >= .3) && ((rating-index) <= .7)) {
      return "ios-star-half";
    } else if ((rating-index) > .7) {
      return "ios-star";
    } else {
      return "ios-star-outline";
    }
  }

  /*
    Logic to decide if star is actively colored. If star
    is half or fully filled, it is actively colored. Based
    on the tenths value of the user's rating:
      0 - 2: inactive
      3 - 0: active
  */
  setColor(rating: number, index: number): string {
    if ((rating-index) >= .3) {
      return '#2E3138';
    } else {
      return '#f4f4f4';
    }
  }

}
