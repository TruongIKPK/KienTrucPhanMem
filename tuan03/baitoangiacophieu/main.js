const Stock = require("./Stock");
const Investor = require("./Investor");

const readline = require("readline");

const apple = new Stock("AAPL", 150);

const a = new Investor("Alice");
const b = new Investor("Bob");
const c = new Investor("Charlie");

apple.subscribe(a);
apple.subscribe(b);
apple.subscribe(c);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log(`Current price for ${apple.name}: ${apple.price}`);

const askPrice = () => {
	rl.question("Nhập giá mới (Enter để thoát): ", answer => {
		if (answer.trim() === "") {
			rl.close();
			return;
		}

		const value = Number(answer);
		if (Number.isNaN(value)) {
			console.log("Giá không hợp lệ, nhập lại.");
			askPrice();
			return;
		}

		apple.setPrice(value);
		askPrice();
	});
};

askPrice();