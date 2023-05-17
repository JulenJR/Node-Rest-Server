/* eslint-disable prettier/prettier */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable object-shorthand */
/* eslint-disable prettier/prettier */
import App from "./App";

try {
	void new App().start();
} catch (e) {
	process.exit(1);
}

process.on("uncaughtException", () => {
	process.exit(1);
});