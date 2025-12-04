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
    }

    // Thực hiện check-in
    this.customerService.checkIn();

    // Kiểm tra xem có đạt mốc không
    this.milestoneReached = this.customerService.checkIfMilestoneReached();
    if (this.milestoneReached) {
      this.rewardMessage.set(
        `🎉 Chúc mừng bạn! Bạn vừa đạt mốc ${this.milestoneReached.visitMilestone} lần ghé thăm và nhận được Voucher ${this.milestoneReached.description}. Nhấn để sử dụng.`
      );
      this.showRewardMessage.set(true);
    }

    // Đóng dialog sau 2 giây nếu không có reward
    if (!this.milestoneReached) {
      setTimeout(() => this.close(), 1500);
    }
  }

  closeRewardMessage(): void {
    this.showRewardMessage.set(false);
    this.close();
  }
}
