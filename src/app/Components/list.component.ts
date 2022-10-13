import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
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

  @Input() options: any;
  @ViewChild('dropDown') dropDown!: ElementRef;
  @ViewChild('dropToggle') dropToggle!: ElementRef;
  @ViewChild('needle') needle!: ElementRef;
  @ViewChild('status') status!: ElementRef;
  @Output() onSelection:EventEmitter<any> = new EventEmitter<any>();

  private render: any;
  public listedItems: any;
  public needleStatus: boolean;
  public showDropDownPanel: boolean;
  public dropDownPanelStatus: string;

  constructor(
    private store: StoreService,
    private scrollBox: ScrollBox,
    private highLight: HighlightPipe
  ) {
    this.listedItems = [];
    this.showDropDownPanel = false;
    this.needleStatus = true;
    this.dropDownPanelStatus = 'dropDownPanel';
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
    this.store.setEndPoint(this.options.endPoint, this.options.needle);
    let sheet = document.createElement('style');
    sheet.innerHTML = this.style();
    document.body.appendChild(sheet);

    this.store.test()
    // let dataBank = new DataBank();
    // this.store.getJsonCountry().then(((d:any)=>{
    //   dataBank.setNeedle('name');
    //   dataBank.loadData(d);
    //   dataBank.request('uni').then((r:any)=>{
    //     console.log('db ' , r);
    //   });
    // }));

  }
  setEventHandlers(){
    this.dropToggle.nativeElement.addEventListener('click',this.handleDropToggle.bind(this),false);
    this.status.nativeElement.addEventListener('click',($e:Event)=>{
      $e.preventDefault();
      this.needle.nativeElement.value='';
      this.listedItems = [];
      this.scrollBox.clear();
      this.dropToggle.nativeElement.classList.remove('isOpen');
      this.onSelection.emit({});
      this.needle.nativeElement.focus();
    },false);
    return;
  }
  handleDropToggle(e:Event){
    e.preventDefault();
    if(this.dropToggle.nativeElement.classList.contains('error')){
      this.needle.nativeElement.focus();
     return;
    }
    this.dropDown.nativeElement.classList.toggle('show');
    this.dropToggle.nativeElement.classList.toggle('isOpen');


    this.needle.nativeElement.focus();
  }
  keyboardHandler($event: KeyboardEvent) {
    switch ($event.key){
      case 'ArrowDown':
        this.scrollBox.next();
        break;
      case 'ArrowUp':
        this.scrollBox.previous();
        break;
      case 'Enter':
        this.updateSelection(this.listedItems[this.scrollBox.getActive()]);
        break;
      case 'Escape':
        this.close();
        // this.updateSelection(this.listedItems[this.scrollBox.getActive()]);
        break;
      case 'Delete':
      case 'Backspace':
        if(this.needle.nativeElement.value.length <= this.defaults.minChar){
          this.scrollBox.clear();
          this.listedItems = [];
         return;
        }
        this.loadEndPoint();
        break;
      default:
        if(this.needle.nativeElement.value.length > this.defaults.minChar){
          this.loadEndPoint();
        }
        break;
    }
  }
  updateSelection(selected:any){
    selected.uiLabel = this.highLight.transform(selected.name,selected.name)
    this.listedItems = [selected]
    this.buildList(this.listedItems);
    this.needle.nativeElement.value = this.listedItems[0][this.options.needle];
    this.onSelection.emit(this.listedItems[0]);
    this.close();
    return;
  }
  loadEndPoint(){
    const needle = this.needle.nativeElement.value
    this.store.getStoreData(needle).then((data:any)=>{
      if(data.length>0){
        data.forEach((c:any)=>{
          if(this.defaults.highlight){
            c.uiLabel = this.highLight.transform(c[this.defaults.needle],needle)
          }else{
            c.uiLabel = c[this.defaults.needle];
          }
        });
        this.needleStatus = true;
        this.listedItems = data;
        this.buildList(this.listedItems);
      }else{
        this.needleStatus = false;
      }
    });
    return;
  }
  buildList(data:any){
    let htmlTemplate = `<ul class="${this.defaults.listCSS}">`;
    data.forEach((item:any,i:number)=>{
      htmlTemplate += this.options.renderer(item,i)
    })
    htmlTemplate += `</ul>`;
    this.scrollBox.load(htmlTemplate);
    this.dropToggle.nativeElement.classList.toggle('isOpen');
    this.dropDown.nativeElement.querySelectorAll('li').forEach((li:any)=>{
      li.addEventListener('click', this.handleDropSelection.bind(this), false)
    })
    return;
  }
  handleDropSelection($e:Event){
    $e.preventDefault();
    const clicked = ListComponent.findParentNode(( $e.target as HTMLElement),'LI');
    this.updateSelection( this.listedItems[clicked.dataset.index]);
    return;
  }
  close() {
    this.dropDown.nativeElement.classList.remove('show');
    this.dropToggle.nativeElement.classList.remove('isOpen');
    return;
  }
  renderTemplate(item:any, i:any) : string {
    return `<li class="${this.options.liCSS}" data-index="${i}"><div class="ellipsis_" >${item.uiLabel}</div></li>`
  }
  static findParentNode(el:any, node:any) {
    while (el.parentNode) {
      el = el.parentNode;
      if (el.nodeName === node){
        return el;
      }
    }
    return null;
  }
  static findParentElement(el:any, eClass:any) {
    while (el.parentNode) {
      el = el.parentNode;
      if (el.className === eClass){
        return el;
      }
    }
    return null;
  }
  style(){
    return `.eList{list-style:none;margin:0;padding:0}.eList .eItem div{height:2rem;line-height:2rem;padding-left:.3rem}.eList .eItem.active{background-color:#006d6d;color:#f5f5f5;font-weight:bolder}.eList .eItem:hover{background-color:#585858;color:#f5f5f5;cursor:pointer}.high{color:#000;font-weight:700}`;
  }
}

