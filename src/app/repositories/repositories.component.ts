import { Component, OnInit, Input } from '@angular/core';
import { DatabaseService } from '../database.service';

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
}
