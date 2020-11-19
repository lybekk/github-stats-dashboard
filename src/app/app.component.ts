import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RepositoriesService } from './repositories.service';

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

  setDataFetchedWhen() {
    this.dataFetchedWhen = new Date(localStorage.getItem('dataFetchedWhen')).toLocaleString() || ''
  }

  constructor(private repositoriesService: RepositoriesService) {}

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
    const result = await this.repositoriesService.fetchRepositories()
    this.setDataFetchedWhen()
    this.errorMessage = result
  }
}

