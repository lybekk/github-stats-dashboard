import { Component, OnInit, Input } from '@angular/core';
import { Repository } from '../repository'

@Component({
  selector: 'app-repositories',
  templateUrl: './repositories.component.html',
  styleUrls: ['./repositories.component.css']
})
export class RepositoriesComponent implements OnInit {
  @Input() datafetchedwhen: string;

  title = 'Repositories';
  repositories: Repository[] = []
  cachedData = false

  constructor() {}

  ngOnInit(): void {
    const cachedRepositories = JSON.parse(localStorage.getItem('cachedRepositories'))
    const data = cachedRepositories?.data
    if (data) {
      this.repositories = cachedRepositories.data.viewer.repositories.nodes
      this.cachedData = true
    }
  }
}
