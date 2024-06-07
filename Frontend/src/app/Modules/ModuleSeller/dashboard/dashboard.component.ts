import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { ProductService } from 'src/app/Core/Service/product.service';
import { ReportService } from 'src/app/Core/Service/report.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  shopid: string | null = "";
  revenueData: any[] = [];
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [
    { data: [], label: 'Revenue' }
  ];

  selectedYear: number = 2024;
  years: number[] = [2022, 2023, 2024, 2025];

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {
    this.shopid = localStorage.getItem('userId');
    this.fetchRevenueData();
  }

  fetchRevenueData(): void {
    if (this.shopid) {
      this.reportService.profitByYear(this.shopid, this.selectedYear).subscribe(res => {
        this.revenueData = res.result;
        this.updateChartData();
      });
    }
  }

  updateChartData(): void {
    this.barChartLabels = [];
    const revenueDataArray = [];

    for (const data of this.revenueData) {
      this.barChartLabels.push(data.month);
      revenueDataArray.push(data.profit);
    }
    this.barChartData = [{ data: revenueDataArray, label: 'Revenue' }];
  }

  onDateChange(): void {
    this.fetchRevenueData();
  }
}
