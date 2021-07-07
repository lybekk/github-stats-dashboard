import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Traffic } from '../traffic'
import { Repository } from '../repository'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.css']
})
export class TrafficComponent implements OnInit {
  @Input() repo: Repository;

  totalViews = 0;
  totalUniques = 0;
  showChart = false;
  owner = null;
  reponame = null;

  refreshIcon = '&#8635;';

  constructor() {}

  ngOnInit(): void {
   this.owner = this.repo.owner.login;
   this.reponame = this.repo.name;
   this.populateDataContainers(this.repo.traffic)
  }

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
      console.log(`Error fetching ${this.repo.name}: ` ,error)
    }
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
            autoSkip: true,
            autoSkipPadding: 50,
            beginAtZero: true,
            stepSize: 1
          }
        },
      ]
    },
    annotation: {},
  };
  public lineChartColors: Color[] = [
    { // SteelBlue
      backgroundColor: '#4682b4',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // Teal
      backgroundColor: '#2f4f4f',
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


  /**
   * TODO: For reference later
   * @param param0 
   */
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    return
  }

  public hideOne(): void {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }

}
