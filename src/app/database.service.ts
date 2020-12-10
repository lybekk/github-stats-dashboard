import { Injectable } from '@angular/core';
import { Traffic } from './traffic'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db = {
    login: null,
    repositories: {
      nodes: []
    }
  }

  busyIndicator = false;

  constructor() {
    this.loadCache()
  }

  get repositories() {
    return this.db.repositories.nodes
  }

  /**
   * Saves the current in-memory state to localStorage as cache for next app launch
   */
  save() {
    localStorage.setItem('cachedDatabase', JSON.stringify(this.db))
    this.loadCache()
  }

  loadCache() {
    try {      
      const data = localStorage.getItem('cachedDatabase')
      this.db = JSON.parse(data)
    } catch (error) {
      console.log(error)
    }
  }

  async fetchRepositories() {
    try {
      this.busyIndicator = true;
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
                  stargazerCount
                  watchers {
                    totalCount
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
        this.db = data.data.viewer
        await this.setTrafficAll()
        this.save()
        localStorage.setItem('dataFetchedWhen', new Date().toISOString())
      } else {
        throw new Error(responseGraphQL.statusText);
      }
    } catch (error) {
      console.log('Error when fetching repositories: ' ,error)
      return error
    } finally {
      this.busyIndicator = false;
    }
  }



  async getTraffic(owner: string, reponame: string): Promise<Traffic> {
    const lastFetched = localStorage.getItem('dataFetchedWhen').slice(0,10)
    const dateToday = new Date().toISOString().slice(0,10)
    if (lastFetched != dateToday) {
      await this.setTrafficAll()
    }
    const repo = this.db.repositories.nodes.find(repo => repo.owner.login === owner && repo.name === reponame);
    return repo.traffic || null
  }


  async setTraffic(owner: string, reponame: string): Promise<Traffic> {
    try {
      const token = localStorage.getItem('apiToken'),
            url = `https://api.github.com/repos/${owner}/${reponame}/traffic/views`;
      const response = await fetch(url, {
        method: `GET`,
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: "application/vnd.github.v3+json"
        },
      })
      const data = await response.json();
      const repos = this.db.repositories.nodes,
            index = repos.findIndex(repo => repo.owner.login === owner && repo.name === reponame)
      repos[index].traffic = data
      return data
    } catch (error) {
      // TODO: Error handler
      console.log(error)
    }
  }

  async setTrafficAll() {
    for await (const repo of this.repositories) {
      await this.setTraffic(repo.owner.login, repo.name)
    }
    this.save()
  }

}
