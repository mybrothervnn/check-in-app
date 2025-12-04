import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../services/customer.service';
import { CheckInDialogComponent } from '../check-in-dialog/check-in-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CheckInDialogComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild(CheckInDialogComponent) checkInDialog!: CheckInDialogComponent;

  constructor(public customerService: CustomerService) {}

  openCheckInDialog(): void {

    //Kiểm tra nếu đã có khách hàng thì không cần nhập lại thông tin
    const currentCustomer = this.customerService.currentCustomer();
    if (currentCustomer) {
      this.checkInDialog.isNewCustomer.set(false);
      // Thực hiện check-in ngay lập tức
      this.customerService.checkIn();

      // Kiểm tra xem có đạt mốc không
      const milestoneReached = this.customerService.checkIfMilestoneReached();
      if (milestoneReached) {
        this.checkInDialog.rewardMessage.set(
          `🎉 Chúc mừng bạn! Bạn vừa đạt mốc ${milestoneReached.visitMilestone} lần ghé thăm và nhận được Voucher ${milestoneReached.description}. Nhấn để sử dụng.`
        );
        this.checkInDialog.showRewardMessage.set(true);
      }
      
    } else {
      this.checkInDialog.isNewCustomer.set(true);
    } 
    this.checkInDialog?.open();
  }

  ngOnInit(): void {
    if (this.customerService.currentCustomer()) {
      this.onCheckIn(
        this.customerService.currentCustomer()!.name,
        this.customerService.currentCustomer()!.phone
      );
    }
  }

  onCheckIn(customerName: string, customerPhone: string): void {
    // Nếu là khách mới
    // if (this.checkInDialog.isNewCustomer()) {
    //   if (!customerName || !customerPhone) {
    //     alert('Vui lòng nhập tên và số điện thoại');
    //     return;
    //   }
    //   this.customerService.registerCustomer(customerName, customerPhone);
    // }

    // Thực hiện check-in
    this.customerService.checkIn();
    
    // Kiểm tra xem có đạt mốc không
    const milestoneReached = this.customerService.checkIfMilestoneReached();
    // if (milestoneReached) {
    //   this.checkInDialog.rewardMessage.set(
    //     `🎉 Chúc mừng bạn! Bạn vừa đạt mốc ${milestoneReached.visitMilestone} lần ghé thăm và nhận được Voucher ${milestoneReached.description}. Nhấn để sử dụng.`
    //   );
    //   this.checkInDialog.showRewardMessage.set(true);
    // }
  }
}
