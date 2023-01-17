import { Injectable } from '@angular/core';

export interface ToastInfo {
  body: string;
  classname: string
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  show(classname: string, body: string, delay: number) {
    this.toasts.push({ body, classname, delay });
  }

  showSuccess(body: string, delay: number = 2000) {
    this.show('bg-success text-light', body, delay)
  }

  showDanger(body: string, delay: number = 3000) {
    this.show('bg-danger text-light', body, delay)
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
