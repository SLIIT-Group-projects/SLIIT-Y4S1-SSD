class NotificationObserver {
  update(report) {
    throw new Error("This method should be implemented by a subclass");
  }
}

class DoctorObserver extends NotificationObserver {
  update(report) {
    console.log(`Doctor notified: Report ${report.reportID} was updated.`);
  }
}

class PatientObserver extends NotificationObserver {
  update(report) {
    console.log(`Patient notified: Your report ${report.reportID} was updated.`);
  }
}

class NotificationSubject {
  constructor() {
    this.observers = [];
  }

  // Attach new observers (Doctors, Patients, etc.)
  attach(observer) {
    this.observers.push(observer);
  }

  // Notify all observers about the update
  notify(report) {
    this.observers.forEach(observer => observer.update(report));
  }
}

module.exports = { DoctorObserver, PatientObserver, NotificationSubject };
