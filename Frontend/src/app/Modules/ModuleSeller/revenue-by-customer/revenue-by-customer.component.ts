import { Component, OnInit } from '@angular/core';
import { ChartType } from 'chart.js';
import { ReportService } from 'src/app/Core/Service/report.service';

@Component({
  selector: 'app-revenue-by-customer',
  templateUrl: './revenue-by-customer.component.html',
  styleUrls: ['./revenue-by-customer.component.css']
})
export class RevenueByCustomerComponent implements OnInit {
  shopid: string | null = "";
  dataReport:any[] = [];
  selectedYear!: number;
  selectedMonth!: number;
  years: number[] = [2023, 2024, 2025];
  months: { value: number, name: string }[] = [
    { value: 1, name: 'Tháng 1' },
    { value: 2, name: 'Tháng 2' },
    { value: 3, name: 'Tháng 3' },
    { value: 4, name: 'Tháng 4' },
    { value: 5, name: 'Tháng 5' },
    { value: 6, name: 'Tháng 6' },
    { value: 7, name: 'Tháng 7' },
    { value: 8, name: 'Tháng 8' },
    { value: 9, name: 'Tháng 9' },
    { value: 10, name: 'Tháng 10' },
    { value: 11, name: 'Tháng 11' },
    { value: 12, name: 'Tháng 12' },
  ];

  barChartOptions: any = {
    responsive: true,
  };
  barChartLabels: any[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartData: any[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.shopid = localStorage.getItem('userId');
    const currentDate = new Date();
    this.selectedYear = currentDate.getFullYear();
    this.selectedMonth = currentDate.getMonth() ;
    this.getdata();
  }

  getdata() {
    this.reportService.revenueByCustomer(this.shopid, this.selectedMonth, this.selectedYear).subscribe(res => {
      this.updateChart(res);
      console.log("111",res)
    });
  }

  updateChart(data: any) {
    const labels = data.map((d: any) => d.userName);
    const revenues = data.map((d: any) => d.totalRevenue);

    this.barChartLabels = labels;
    this.barChartData = [
      { data: revenues, label: `Doanh thu ${this.selectedMonth}/${this.selectedYear}` }
    ];
  }
}
