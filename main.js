const { program } = require('commander');
const fs = require('fs');

program
  .name("weather-app")
  .description("Програма для обробки JSON даних з файлу погоди")
  .version("1.0.0");

program
  .requiredOption('-i, --input <string>', 'шлях до JSON з даними (наприклад weather-2.json)')
  .option('-o, --output <string>', 'шлях до файлу, у який записати результат')
  .option('-d, --display', 'вивести результат у консоль')
  .option('-h, --humidity', 'Відображати вологість вдень (Humidity3pm)')
  .option('-r, --rainfall <number>', 'Відображати лише записи з опадами більше за вказане значення');

program.parse(process.argv);
const options = program.opts();
if (!fs.existsSync(options.input)) {
  console.error("Cannot find input file");
  process.exit(1);
}
let rawData = fs.readFileSync(options.input, 'utf8');
let data;
try {
  data = JSON.parse(rawData);
} catch (exeption) {
  console.error("Invalid JSON format");
  process.exit(1);
}
let result = data;
if (options.rainfall) {
  const threshold = parseFloat(options.rainfall);
  result = result.filter(item => (item.Rainfall || 0) > threshold);
}
result = result.map(item => {
  const rain = item.Rainfall ?? 'N/A';
  const pressure = item.Pressure3pm ?? 'N/A';
  const humidity = options.humidity ? (item.Humidity3pm ?? 'N/A') : '';
  return `${rain} ${pressure}${humidity ? ' ' + humidity : ''}`;
});
if (!options.output && !options.display) {
  process.exit(0);
}
if (options.display) {
  console.log("Результат:");
   console.log(result.join('\n'));
}
if (options.output) {
  fs.writeFileSync(options.output, JSON.stringify(result, null, 2), 'utf8');
  console.log(`Результат збережено у файл: ${options.output}`);
} 