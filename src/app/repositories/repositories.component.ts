import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Repository } from '../repository';

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {
  @Input() datafetchedwhen: string;

  title = 'Repositories';
  totalWatchers = 0;
  totalStars = 0;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit(): void {
    this.totalWatchers = this.databaseService.repositories.reduce(
      (accumulator, repo) => accumulator + repo.watchers.totalCount, 0);

      this.totalStars = this.databaseService.repositories.reduce(
        (accumulator, repo) => accumulator + repo.stargazerCount, 0);
  }

  get repositories() {
    try {
      return this.databaseService.repositories
    } catch (error) {
      return []
    }
  }

  get repositoriesWithTraffic() {
    try {
      return this.databaseService.repositories.filter(repo => repo.traffic.count)
    } catch (error) {
      return []
    }
  }

  get repositoriesNoTraffic() {
    try {
      return this.databaseService.repositories.filter(repo => repo.traffic.count === 0)
    } catch (error) {
      return []
    }
  }

  get totalRepository() {
    try {
      const totalRepo = {
        id: 0,
        name: "All repositories",
        owner: {
          login: ""
        },
        traffic: {
          count: 0,
          uniques: 0,
          views: []
        },
        stargazerCount: 0,
        watchers: {
          totalCount: 0
        }
      } 
      this.databaseService.repositories.filter(repo => repo.traffic.count).forEach(repo => {
        totalRepo.stargazerCount += repo.stargazerCount
        totalRepo.watchers.totalCount += repo.watchers.totalCount
        totalRepo.traffic.count += repo.traffic.count
        totalRepo.traffic.uniques += repo.traffic.uniques
        repo.traffic.views.forEach(view => {
          let index = totalRepo.traffic.views.findIndex(element => element.timestamp === view.timestamp)
          if (index < 0) {
            index = totalRepo.traffic.views.push({timestamp: view.timestamp, count: 0, uniques: 0}) - 1
          }
          totalRepo.traffic.views[index].count += view.count;
          totalRepo.traffic.views[index].uniques += view.uniques;
        })
      })
      totalRepo.traffic.views.sort((a, b) => <any>new Date(a.timestamp) - <any>new Date(b.timestamp))
      return totalRepo
    } catch (error) {
      return 
    }
  }

}
