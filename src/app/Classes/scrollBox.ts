import extendDefaults from "../extendDefaults";
import {Injectable} from "@angular/core";

@Injectable()
export default class ScrollBox {
    private defaults = {
        anchor: false,
        input: false,
        listMax: 5,
        cssActive: 'active',
    }
    private options: any;
    private anchor: any;
    private liHeight: number = 0;
    private listItems: any = 0;
    private selectedItem: number = 0;

    constructor() {
      console.log('Content v0.0.0.0');
    }

    bootstrap(options:any){
      this.options = extendDefaults(this.defaults, arguments[0]);
      if(!this.options.anchor){
        console.log("No base element defined");
        return;
      }
      this.anchor = this.options.anchor;
      console.log('Content ' , this.options);

    }
    clear(){
        this.anchor.innerHTML=''
    }
    next(){
        if(this.selectedItem+1 < this.listItems.length){
            this.selectedItem++;
        } else {
            this.selectedItem = 0;
        }
        this.setActive(this.selectedItem);
        if(!this.visibleInParentViewPort(this.listItems[this.selectedItem])){
            this.anchor.scrollTop = this.listItems[this.selectedItem].offsetTop - (this.liHeight * (this.options.listMax - 1));
        }
    }
    previous(){
        if(this.selectedItem-1 >=0){
            this.selectedItem--;
        } else {
            this.selectedItem = this.listItems.length-1;
        }
        this.setActive(this.selectedItem);
        if(!this.visibleInParentViewPort(this.listItems[this.selectedItem])){
            this.anchor.scrollTop = this.listItems[this.selectedItem].offsetTop;
        }
    }
    setActive(li:number){
        this.listItems.forEach((li:HTMLLIElement)=>{
            li.classList.remove(this.options.cssActive);
        });
        this.listItems[li].classList.add(this.options.cssActive);
        this.selectedItem = li;
    }
    load(html:any){
        this.anchor.classList.remove('show');
        this.anchor.classList.add('loading');
        this.anchor.innerHTML = html;
        this.listItems = this.anchor.querySelectorAll('li');
        this.liHeight = Math.round(parseFloat(ScrollBox.getElComputedStyle(this.listItems[0], 'height')));
        // console.log('LI: ' , this.liHeight );
        this.anchor.style.maxHeight = (this.liHeight) * this.options.listMax  + 'px';
        this.listItems[0].classList.add(this.options.cssActive);
        this.selectedItem = 0;
        this.anchor.classList.remove('loading');
        this.anchor.classList.add('show');
    }
    visibleInParentViewPort(liElement:any) {
        this.liHeight = Math.round(parseFloat(ScrollBox.getElComputedStyle(this.listItems[0], 'height')));
        let result = false;
        if (liElement.offsetTop - this.anchor.scrollTop >= 0) {
            result = (liElement.offsetTop) - this.anchor.scrollTop <= this.anchor.clientHeight - this.liHeight;
            return result;
        }
        return result;
    }
    static getElComputedStyle(elem:any, prop:any): any {
        let cs = window.getComputedStyle(elem, null);
        if (prop) {
            return cs.getPropertyValue(prop);
        }
    }

}
