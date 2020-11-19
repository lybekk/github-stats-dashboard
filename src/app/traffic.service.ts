import { Injectable } from '@angular/core';
import { Traffic } from './traffic'

@Injectable({
  providedIn: 'root'
})
export class TrafficService {

  constructor() { }

  async getTraffic(reponame: string): Promise<Traffic> {
    try {
      const owner = localStorage.getItem('owner'),
            token = localStorage.getItem('apiToken'),
            url = `https://api.github.com/repos/${owner}/${reponame}/traffic/views`;
            console.log(url)
      const response = await fetch(url, {
        method: `GET`,
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: "application/vnd.github.v3+json"
        },
      })
      const data = await response.json();
      localStorage.setItem(`cachedRepoTraffic_${reponame}`, JSON.stringify(data))
      return data
    } catch (error) {
      // TODO: Error handler
      console.log(error)
    }
  }
}
