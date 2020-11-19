import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TrafficService } from '../traffic.service';
import { Traffic } from '../traffic'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.css']
})
export class TrafficComponent implements OnInit {
  @Input() reponame: string;

  totalViews = 0;
  totalUniques = 0;
  showChart = false;
  refreshIcon = '&#8635;';

  constructor(private trafficService: TrafficService) {}

  ngOnInit(): void {
    this.startupCheck()
  }

  async startupCheck() {
    const lastFetched = localStorage.getItem('dataFetchedWhen').slice(0,10)
    const dateToday = new Date().toISOString().slice(0,10)
    if (lastFetched != dateToday) {
      this.getTraffic(this.reponame)
    } else {
      const cache = JSON.parse(
        localStorage.getItem(`cachedRepoTraffic_${this.reponame}`)
      )
      if (cache) {
        this.populateDataContainers(cache)
      }
    }
  }

  /**
   * TODO: fill in docstring
   * @param traffic - GitHub REST API Traffic view counts
   */
  populateDataContainers(traffic: Traffic): void {
    try {
      this.totalViews = traffic.count
      this.totalUniques = traffic.uniques
      this.showChart = traffic.count ? true : false

      this.lineChartLabels = []
      this.lineChartData[0].data = []
      this.lineChartData[1].data = []

      traffic.views.forEach(element => {
        this.lineChartLabels.push(
          new Date(element.timestamp).toLocaleDateString()
        );
        this.lineChartData[0].data.push(element.count)
        this.lineChartData[1].data.push(element.uniques)
      });
    } catch (error) {
      console.log(`Error fetching ${this.reponame}: ` ,error)
    }
  }

  async getTraffic(reponame: string): Promise<void> {
    const data = await this.trafficService.getTraffic(reponame)
    this.populateDataContainers(data)
  }

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total' },
    { data: [], label: 'Uniques' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      xAxes: [
        {
          id: 'x-axis-0',
          position: 'left',
          gridLines: {
            color: 'transparent',
          },      
        }
      ],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          gridLines: {
            color: 'transparent',
          },
          ticks: {
            stepSize: 1,
          }
        },
      ]
    },
    annotation: {},
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'bar';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }

}
