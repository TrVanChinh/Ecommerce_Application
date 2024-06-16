import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { ReportService } from 'src/app/Core/Service/report.service';

@Component({
  selector: 'app-statistical-buyer',
  templateUrl: './statistical-buyer.component.html',
  styleUrls: ['./statistical-buyer.component.css']
})
export class StatisticalBuyerComponent implements OnInit {
  userId:string| null = '';
  data:any[] = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: any[] = [
    { data: [], label: 'Total Amount' }
  ];
  constructor(private reportSerice:ReportService) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
    this.reportSerice.getOrderCompletedByYear(this.userId,2024).subscribe(res => {
      console.log(res)
      this.data = res.data
      for (const month in this.data) {
        if (this.data[month].length > 0) {
          const totalAmount = this.data[month][0].totalByShop;
          const monthName = month.substring(0, month.indexOf("Data"));
          this.barChartLabels.push(monthName);
          this.barChartData[0].data.push(totalAmount);
        }
      }
    })
  }

}
