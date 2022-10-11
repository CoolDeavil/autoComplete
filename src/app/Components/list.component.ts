import {AfterViewInit, Component, ElementRef, Input, ViewChild} from "@angular/core";
import {StoreService} from "../Services/store.service";
import ScrollBox from "../Classes/scrollBox";
import {HighlightPipe} from "../Pipes/highlight.pipe";
import extendDefaults from "../extendDefaults";


@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent  implements AfterViewInit{
  @Input() options: any;
  private defaults:any = {
    listMax: 5,
    minChar: 2,
    highlight: false,
    endPoint: ``,
    needle: '',
    listCSS: 'eList',
    liCSS: 'eItem',
    cssActive: 'active',
    renderer: this.renderTemplate.bind(this)
  };

  @ViewChild('dropDown') dropDown!: ElementRef;
  @ViewChild('dropToggle') dropToggle!: ElementRef;
  @ViewChild('needle') needle!: ElementRef;

  private render: any;
  constructor(
    private store: StoreService,
    private scrollBox: ScrollBox,
    private highLight: HighlightPipe
  ) {
    // this.render = this.defaults.renderer;
    // console.log('List Component Constructor ' , this.options );
  }
  ngAfterViewInit(): void {
    this.setEventHandlers();
    this.options = extendDefaults(this.defaults, this.options);
    this.scrollBox.bootstrap({
      anchor: this.dropDown.nativeElement,
      listMax: this.options.listMax,
      cssActive: this.options.cssActive
    });
    this.render = this.options.renderer;
    this.store.setEndPoint(this.options.endPoint);
    console.log('List Component ngAfterViewInit ' , this.options );
  }
  setEventHandlers(){
    this.dropToggle.nativeElement.addEventListener('click',this.handleDropToggle.bind(this),false);
  }
  handleDropToggle(e:Event){
    e.preventDefault();
    this.dropDown.nativeElement.classList.toggle('show');
  }
  keyboardHandler($event: KeyboardEvent) {
    switch ($event.key){
      case 'ArrowDown':
        this.scrollBox.next();
        break;
      case 'ArrowUp':
        this.scrollBox.previous();
        break;
      default:
        if(this.needle.nativeElement.value.length> this.defaults.minChar){
          // console.log('Start Searching: ', this.needle.nativeElement.value);
          this.loadEndPoint();
        }
        break;
    }
  }
  loadEndPoint(){
    const needle = this.needle.nativeElement.value
    this.store.getCountry(needle).then((world:any)=>{
      world.forEach((c:any)=>{
        if(this.defaults.highlight){
          c.uiLabel = this.highLight.transform(c[this.defaults.needle],needle)
        }else{
          c.uiLabel = c[this.defaults.needle];
        }
      });
      this.buildList(world);
    })
  }
  buildList(world:any){
    let htmlTemplate = `<ul class="${this.defaults.listCSS}">`;
    world.forEach((country:any,i:number)=>{
      htmlTemplate += this.options.renderer(country,i)
    })
    htmlTemplate += `</ul>`;
    this.scrollBox.load(htmlTemplate);
  }
  close() {
    this.dropDown.nativeElement.classList.remove('show');
  }
  renderTemplate(item:any, i:any) : string {
    return `<li class="${this.options.liCSS}" data-index="${i}"><div class="ellipsis_" >${item.uiLabel}</div></li>`
  }
}
