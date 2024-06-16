import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { ReportService } from 'src/app/Core/Service/report.service';

@Component({
  selector: 'app-report-year',
  templateUrl: './report-year.component.html',
  styleUrls: ['./report-year.component.css']
})
export class ReportYearComponent implements OnInit {
  shopid: string | null = "";
  revenueData: any;
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'pie';
  public barChartLegend = true;
  public barChartData: any[] = [
    { data: [], label: 'Revenue' }
  ];
  selectedYear: number = 2024;


  years: number[] = [2022, 2023, 2024, 2025];

  constructor(private reportService: ReportService) {
    
   }

  ngOnInit(): void {
    this.shopid = localStorage.getItem('userId');
    this.fetchRevenueData();
  }
  fetchRevenueData(): void {
    this.reportService.getRevenueByYear(this.shopid,this.selectedYear).subscribe(res => {
      console.log("12",res)
      this.revenueData = res;
      this.updateChartData();
    })
  }

  updateChartData(): void {

    this.barChartLabels = [];
    const revenueDataArray = [];

    for (const data of this.revenueData) {
      this.barChartLabels.push(data.month);
      revenueDataArray.push(data.totalRevenue);
    }
    this.barChartData = [{ data: revenueDataArray, label: 'Revenue' }];
  }
  
  

  onDateChange(): void {
    this.fetchRevenueData();
  }
}
