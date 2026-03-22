class Task {
  constructor(name) {
    this.name = name;
    this.status = "Pending";
    this.observers = [];
  }

  // đăng ký nhận thông báo
  subscribe(observer) {
    this.observers.push(observer);
  }

  // hủy đăng ký
  unsubscribe(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  // thông báo cho tất cả
  notify() {
    this.observers.forEach(o => o.update(this));
  }

  // thay đổi trạng thái task
  setStatus(newStatus) {
    console.log(`\nTask "${this.name}" đổi trạng thái: ${this.status} -> ${newStatus}`);
    this.status = newStatus;
    this.notify();
  }
}

module.exports = Task;