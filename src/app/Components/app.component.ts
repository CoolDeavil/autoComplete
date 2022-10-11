import {AfterViewInit, Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent{
  public title:string = 'davidShop';

  constructor() {}

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
}
