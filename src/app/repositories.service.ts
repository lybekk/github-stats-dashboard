import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  constructor() { }

  async fetchRepositories() {
    try {
      const token = localStorage.getItem('apiToken') || ''
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
        localStorage.setItem('dataFetchedWhen', new Date().toISOString())
      } else {
        throw new Error(responseGraphQL.statusText);
      }
    } catch (error) {
      console.log('Error when fetching repositories: ' ,error)
      return error
    }
  }
}
