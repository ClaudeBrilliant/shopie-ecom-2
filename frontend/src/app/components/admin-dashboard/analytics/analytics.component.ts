import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../../services/analytics/analytics.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsers, faBoxOpen, faShoppingCart, faTags } from '@fortawesome/free-solid-svg-icons';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, NgxChartsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnalyticsComponent implements OnInit {
  userCount: number = 0;
  productCount: number = 0;
  orderCount: number = 0;
  categoryCount: number = 0;

  faUsers = faUsers;
  faBoxOpen = faBoxOpen;
  faShoppingCart = faShoppingCart;
  faTags = faTags;

  barChartData = [
    {
      "name": "Mon",
      "value": 50
    },
    {
      "name": "Tue",
      "value": 60
    },
    {
      "name": "Wed",
      "value": 70
    },
    {
      "name": "Thu",
      "value": 40
    },
    {
      "name": "Fri",
      "value": 80
    },
    {
      "name": "Sat",
      "value": 50
    },
    {
      "name": "Sun",
      "value": 90
    }
  ];

  pieChartData = [
    {
      "name": "Users",
      "value": 0
    },
    {
      "name": "Products",
      "value": 0
    },
    {
      "name": "Orders",
      "value": 0
    },
    {
      "name": "Categories",
      "value": 0
    }
  ];

  gaugeChartData = [
    {
      "name": "Sales Target",
      "value": 75
    }
  ];

  colorScheme: Color = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.analyticsService.getAllUsers().subscribe(users => {
      this.userCount = users.length;
      this.updateChartData('Users', users.length);
    });

    this.analyticsService.getAllProducts().subscribe(products => {
      this.productCount = products.length;
      this.updateChartData('Products', products.length);
    });

    this.analyticsService.getAllOrders().subscribe(orders => {
      this.orderCount = orders.length;
      this.updateChartData('Orders', orders.length);
    });

    this.analyticsService.getAllCategories().subscribe(categories => {
      this.categoryCount = categories.length;
      this.updateChartData('Categories', categories.length);
    });

    
    this.updateChartData('Sales Target', 75);
  }

  updateChartData(name: string, value: number) {
    const index = this.pieChartData.findIndex(data => data.name === name);
    if (index !== -1) {
      this.pieChartData[index].value = value;
      this.pieChartData = [...this.pieChartData];
    }

    if (name === 'Sales Target') {
      this.gaugeChartData[0].value = value;
      this.gaugeChartData = [...this.gaugeChartData];
    }
  }
}