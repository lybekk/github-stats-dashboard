import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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

  setDataFetchedWhen(newDate: boolean = false) {
    if (newDate) {
      localStorage.setItem('dataFetchedWhen', new Date().toISOString())
    }
    this.dataFetchedWhen = new Date(localStorage.getItem('dataFetchedWhen')).toLocaleString() || ''
  }

  constructor() {}

  ngOnInit() {
    let apiTokenSaved = localStorage.getItem('apiToken') || ''
    this.myGroup = new FormGroup({
      'apiToken': new FormControl(apiTokenSaved),
    });
    this.setDataFetchedWhen()
  }

  async fetchData() {
    const token = this.myGroup.value.apiToken;
    try {
      localStorage.setItem('apiToken', token)
    
      const responseGraphQL = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `
          {
            viewer {
              login
              repositories(first: 100) {
                nodes {
                  name
                  releases(first: 10) {
                    nodes {
                      releaseAssets(first: 100) {
                        nodes {
                          downloadCount
                          name
                        }
                      }
                    }
                  }
                  owner {
                    login
                  }
                }
                totalDiskUsage
                totalCount
              }
            }
          }        
        ` }),
      })
      if (responseGraphQL.ok) {
        const data = await responseGraphQL.json();
        localStorage.setItem('cachedRepositories', JSON.stringify(data))
        localStorage.setItem('owner', data.data.viewer.login)
        this.setDataFetchedWhen(true)
      } else {
        this.errorMessage = responseGraphQL.statusText
      }
    } catch (error) {
      console.log('Error when fetching repositories: ' ,error)
      this.errorMessage = error
    }
  }
}

