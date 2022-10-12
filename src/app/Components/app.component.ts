import {AfterViewInit, Component} from '@angular/core';
import {SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent{
  public title:string = 'EasyList';
  selected: boolean = false;
  public row: SafeHtml

  constructor() {
    this.row=JSON.stringify({}, undefined, 2);
  }

  renderCustomTemplate(item:any, i:any) : string {
    return `<li class="customItem">
        <table>
          <tbody>
          <tr>
            <td rowspan="2">
              <img src="${item.flag}" alt="" class="iFlag">
            </td>
            <td>
             ${item.uiLabel}
           </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <strong>Capital&nbsp;</strong>${item.capital}
            </td>
            <td>
              <strong>Code&nbsp;</strong>${item.code}
            </td>
          </tr>
          </tbody>
        </table>
      </li>`
  }

  showSelected(selected:any) {
    if(selected){
      this.row=JSON.stringify(selected, undefined, 2);
    } else {
      this.selected = false;
    }
  }
}
