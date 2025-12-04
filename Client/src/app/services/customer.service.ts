import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Customer {
  name: string;
  phone: string; // 6 chữ số cuối
  visits: number;
  createdAt: Date;
}

export interface Reward {
  visitMilestone: number;
  discount: number; // Phần trăm
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly STORAGE_KEY = 'check_in_app_customer';
  private readonly REWARDS_MILESTONES = [5, 10, 15, 20];
  
  currentCustomer = signal<Customer | null>(null);
  visitCount = signal(0);

  constructor(private http: HttpClient) {
    this.loadCustomer();
  }
  /*Load dữ liệu khách hàng từ localStorage nếu có. 
  */
  private loadCustomer(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const customer = JSON.parse(stored);
        customer.createdAt = new Date(customer.createdAt);
        this.currentCustomer.set(customer);
        this.visitCount.set(customer.visits);
        console.log('Customer loaded from storage:', customer);
      } catch (e) {
        console.error('Error loading customer:', e);
      }
    }
  }

  /*Lưu thông tin vào LocalStorage và DB
  */
  private saveCustomer(): void {
    const customer = this.currentCustomer();
    if (customer) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customer));
    }
    console.log('saveCustomer() - Customer saved:', customer);
    this.saveCustomerToDB();
       
  }
  
  private saveCustomerToDB(): void {
    // Giả sử chúng ta có một API endpoint để lưu khách hàng
    const customer = this.currentCustomer();
    if (customer) {
      // Thực hiện gọi API ở đây (ví dụ sử dụng HttpClient)
      console.log('saveCustomerToDB() - Simulating saving to DB:', customer);
      //Gọi đến post('/:phone/checkin' ở url localhosst:3000/api/customers

      this.http.get(`https://literate-potato-jjvgp7jjv5rfpwpx-3000.app.github.dev/health`).subscribe(
        (response) => console.log('Test API:', response),
        (error) => console.error('Error when connect to DB:', error)
      );


      // this.http.post(`https://literate-potato-jjvgp7jjv5rfpwpx-3000.app.github.dev/api/customers/${customer.phone}/checkin`, customer).subscribe(
      //   (response) => console.log('Customer saved to DB:', response),
      //   (error) => console.error('Error saving to DB:', error)
      // );

      // Ví dụ:
      // this.http.post('/api/customers', customer).subscribe(...);
    }
  }

  /*Đăng ký khách hàng mới với tên và số điện thoại (6 số cuối).
  */

  registerCustomer(name: string, phone: string): void {
    const customer: Customer = {
      name,
      phone: phone.slice(-6), // Lấy 6 số cuối
      visits: 0,
      createdAt: new Date()
    };
    this.currentCustomer.set(customer);
    this.visitCount.set(0);
    this.saveCustomer();
  }
  /* Thực hiện check-in cho khách hàng hiện tại, tăng số lần ghé thăm lên 1 và lưu lại (Storage và DB).
  */
  checkIn(): void {
    const customer = this.currentCustomer();
    if (customer) {
      customer.visits++;
      this.visitCount.set(customer.visits);
      this.saveCustomer();
    }
  }

  getNextMilestone(): number | null {
    const visits = this.visitCount();
    const nextMilestone = this.REWARDS_MILESTONES.find(m => m > visits);
    return nextMilestone || null;
  }

  getVisitsUntilNextMilestone(): number {
    const nextMilestone = this.getNextMilestone();
    if (!nextMilestone) return 0;
    return nextMilestone - this.visitCount();
  }

  getMilestoneReward(milestone: number): Reward | null {
    const rewards: { [key: number]: Reward } = {
      5: { visitMilestone: 5, discount: 10, description: 'Giảm 10% cho hóa đơn này' },
      10: { visitMilestone: 10, discount: 15, description: 'Giảm 15% cho hóa đơn này' },
      15: { visitMilestone: 15, discount: 20, description: 'Giảm 20% cho hóa đơn này' },
      20: { visitMilestone: 20, discount: 25, description: 'Giảm 25% cho hóa đơn này' }
    };
    return rewards[milestone] || null;
  }

  checkIfMilestoneReached(): Reward | null {
    const visits = this.visitCount();
    const reachedMilestone = this.REWARDS_MILESTONES.find(m => m === visits);
    if (reachedMilestone) {
      return this.getMilestoneReward(reachedMilestone);
    }
    return null;
  }

  clearCustomer(): void {
    this.currentCustomer.set(null);
    this.visitCount.set(0);
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
