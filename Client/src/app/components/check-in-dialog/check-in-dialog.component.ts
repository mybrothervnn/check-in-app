import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-check-in-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './check-in-dialog.component.html',
  styleUrl: './check-in-dialog.component.css'
})
export class CheckInDialogComponent {
  isOpen = signal(false);
  isNewCustomer = signal(true);
  customerName = signal('');
  customerPhone = signal('');
  showRewardMessage = signal(false);
  rewardMessage = signal('');
  milestoneReached: any = null;

  constructor(public customerService: CustomerService) {}

  open(): void {
    this.isOpen.set(true);
    this.isNewCustomer.set(true);
    this.customerName.set('');
    this.customerPhone.set('');
    this.showRewardMessage.set(false);
    this.rewardMessage.set('');
  }

  close(): void {
    this.isOpen.set(false);
  }

  onRegis(): void {
    if (!this.customerPhone()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }
    this.customerService.registerCustomer(
      this.customerName(),
      this.customerPhone()
    ).subscribe( //res.status(201).json({ customer: customer, isNew: !customer });
      (result) => {
      console.log('CheckInDialogComponent - onRegis() - registered customer:', result.customer);
      //Thực hiện cập nhật lại thông tin khách hàng trong service
      this.customerService.currentCustomer.set(result.customer);

      // Nếu visits > 1 => KHÁCH ĐÃ CHECK-IN
      if (result.isNew === false) {
        //Cập nhật lại thông tin hiển thị
        this.customerService.visitCount.set(result.customer.visits);
      }      

      this.isNewCustomer.set(result.isNew);
      
      // Đóng dialog 
      this.close();
    });
    // setTimeout(() => this.close(), 1500);    
  }

  onCheckIn(): void {
    if (this.isNewCustomer()) {
      // Nếu là khách mới
      if (!this.customerName() || !this.customerPhone()) {
        alert('Vui lòng nhập tên và số điện thoại');
        return;
      }
      this.customerService.registerCustomer(
        this.customerName(),
        this.customerPhone()
      );
    } else { // KHÁCH CŨ
      // Thực hiện check-in và cập nhật
      this.customerService.checkIn();

      // Kiểm tra xem có đạt mốc không
      this.milestoneReached = this.customerService.checkIfMilestoneReached();
      if (this.milestoneReached) {
        this.rewardMessage.set(
          `🎉 Chúc mừng bạn! Bạn vừa đạt mốc ${this.milestoneReached.visitMilestone} lần ghé thăm và nhận được Voucher ${this.milestoneReached.description}. Nhấn để sử dụng.`
        );
        this.showRewardMessage.set(true);
      }
    
    
    
    }
    this.close();
    // Đóng dialog sau 2 giây nếu không có reward
    // setTimeout(() => this.close(), 1500);
    
  }

  closeRewardMessage(): void {
    this.showRewardMessage.set(false);
    this.close();
  }
}
