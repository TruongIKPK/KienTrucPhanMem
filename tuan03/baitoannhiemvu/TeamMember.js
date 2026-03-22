class TeamMember {
  constructor(name) {
    this.name = name;
  }

  update(task) {
    console.log(`${this.name} nhận thông báo: Task "${task.name}" = ${task.status}`);
  }
}

module.exports = TeamMember;