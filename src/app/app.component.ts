import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GitHub Traffic Viewer';
  myGroup: FormGroup;
  dataFetchedWhen = null
  errorMessage = null
  fetchClickToActionIcon = '&#129299;';

  setDataFetchedWhen() {
    this.dataFetchedWhen = new Date(localStorage.getItem('dataFetchedWhen')).toLocaleString() || ''
  }

  get fetchBtnDisabled() {
    return this.myGroup.value.apiToken.length < 4
  }

  get busyIndicator() {
    return this.databaseService.busyIndicator
  }

  constructor(private databaseService: DatabaseService) {}
  
  ngOnInit() {
    let apiTokenSaved = localStorage.getItem('apiToken') || ''
    this.myGroup = new FormGroup({
      'apiToken': new FormControl(apiTokenSaved),
    });
    this.setDataFetchedWhen()
  }

  async fetchData() {
    const token = this.myGroup.value.apiToken;
    localStorage.setItem('apiToken', token)
    const result = await this.databaseService.fetchRepositories()
    this.setDataFetchedWhen()
    this.errorMessage = result
  }
}

