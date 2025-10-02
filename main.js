const { program } = require('commander');
const fs = require('fs');

program
  .name("nbu-app")
  .description("Програма для обробки JSON даних з НБУ")
  .version("1.0.0");

program
  .option('-i, --input <string>', 'шлях до json з даними серверу Національного банку України')
  .option('-o, --output <string>', 'шлях до файлу, у якому записуємо результат')
  .option('-d, --display <bool>', 'вивести результат у консоль')

program.parse(process.argv);
const options = program.opts();
if (!options.input) {
  console.error("Please, specify input file");
  process.exit(1);
}
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}
const rawData = fs.readFileSync(options.input, 'utf8');
const data = JSON.parse(rawData);
if (!options.output && !options.display) {
  process.exit(0);
}
if (options.display) {
  console.log("Результат:");
  console.log(data);
}
if (options.output) {
  fs.writeFileSync(options.output, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Результат збережено у файл: ${options.output}`);
}