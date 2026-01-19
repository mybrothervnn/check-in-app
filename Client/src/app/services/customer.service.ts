
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

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

  /*Lưu thông tin vào LocalStorage
  */
  updateLocalStorage() {
    const customer = this.currentCustomer();
    if (customer) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customer));      
    }
  }
  
  /*Lưu thông tin vào DB
  */
  private saveCustomer(): Observable<any> {
    const customer = this.currentCustomer();
    //1. save to localstorage
    if (customer) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customer));
    }
    console.log('saveCustomer() - Customer saved:', customer);
    //2. save to DB
    return this.saveCustomerToDB();
       
  }

  private checkInToDB(): Observable<any> {
    const customer = this.currentCustomer();
    return this.http.post(`http://localhost:3000/api/customers/:{phone}/checkin`, customer);
  }

  private saveCustomerToDB(): Observable<any> {
    const customer = this.currentCustomer();
    return this.http.post(`http://localhost:3000/api/customers`, customer);
  }

  /*Đăng ký khách hàng mới với tên và số điện thoại (6 số cuối).
  */
  registerCustomer(name: string, phone: string): Observable<any> {
    const customer: Customer = {
      name,
      phone: phone, // Lấy 6 số cuối
      visits: 1,
      createdAt: new Date()
    };
    this.currentCustomer.set(customer);
    // this.visitCount.set(1);
    return this.saveCustomer();
  }

  /* Thực hiện check-in cho khách hàng hiện tại, tăng số lần ghé thăm lên 1 và lưu lại (Storage và DB).
  */
  checkIn(): Observable<any> {
    const customer = this.currentCustomer();
    if (!customer) {
      throw new Error('No current customer to check in.');
    } else {
      customer.visits++;
      this.visitCount.set(customer.visits);
    } 

    //1. save to localstorage
    if (customer) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customer));
    }
    
    console.log('saveCustomer() - Customer saved:', customer);
    //2. save to DB
    return this.checkInToDB();
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
