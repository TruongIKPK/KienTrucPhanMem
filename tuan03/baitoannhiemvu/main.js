const Task = require("./Task");
const TeamMember = require("./TeamMember");

const task = new Task("Làm API");

const a = new TeamMember("Trường");
const b = new TeamMember("An");
const c = new TeamMember("Bình");

// đăng ký theo dõi
task.subscribe(a);
task.subscribe(b);
task.subscribe(c);

// thay đổi trạng thái
task.setStatus("In Progress");
task.setStatus("Done");