const { performance } = require('perf_hooks');

const calculateMean = (array) => {
  let sum = 0;
  for (const x of array) { sum += x; }
  return sum / array.length;
};

const calculateStandardDeviation = (array) => {
  if (array.length === 1) { return 0; }

  const mean = calculateMean(array);
  let sum = 0;
  for (const x of array) { sum += (x - mean) ** 2; }
  return (sum / (array.length - 1)) ** (1 / 2);
};

const calculateStandardError = (array) => {
  return calculateStandardDeviation(array) / (array.length ** (1 / 2));
};

const calculateStringLength = (array) => {
  return Math.max(...array.map(x => Math.trunc(x).toString().length));
};

const generateMessage = (
  name,
  nameLength,
  mean,
  meanLength,
  standardError,
  standardErrorLength,
  precision,
) => {
  const nameMessage = name.padEnd(nameLength, ' ');
  const meanMessage = mean.toFixed(precision).padStart(meanLength + precision, ' ');
  const standardErrorMessage = standardError.toFixed(precision).padStart(standardErrorLength + precision, ' ');
  return `| ${nameMessage} | ${meanMessage}s +/- ${standardErrorMessage} |`;
};

const generateOutput = (funcs, times, iterations, clients) => {
  const scaledTimes = times.map((timeArray) => timeArray.map((time) => time / 1000));
  const means = scaledTimes.map((timeArray) => calculateMean(timeArray));
  const standardErrors = scaledTimes.map((timeArray) => calculateStandardError(timeArray));

  const nameLength = Math.max(...funcs.map(func => func.name.length));
  const meanLength = calculateStringLength(means);
  const standardErrorLength = calculateStringLength(standardErrors);

  const precision = 5;
  const bars = `| ${''.padEnd(nameLength, '-')} | ${''.padEnd(meanLength + precision, '-')}--------${''.padEnd(standardErrorLength + precision, '-')} |`;
  let message = bars + '\n';

  for (let i = 0; i < funcs.length; i++) {
    message += generateMessage(funcs[i].name, nameLength, means[i], meanLength, standardErrors[i], standardErrorLength, precision) + '\n';
  }

  return message + bars + `\niterations: ${iterations}   clients: ${clients}`;
};

const randomIds = [...Array(1e4)].map(() => Math.floor(Math.random() * 1e6));

//options:
  //iterations
  //clients
module.exports = async (
  funcs = [
    {
      name: 'Empty func',
      func: () => {},
    }
  ], 
  options = {
    iterations: 1,
    clients: 1
}) => {
  const productIds = randomIds.slice(options.iterations * options.clients);
  const times = Array.from(Array(funcs.length), () => []);

  for (let i =  0; i < options.iterations; i++) {
    const iterationProductIds = productIds.slice(i * options.clients, (i + 1) * options.clients)

    for (let j = 0; j < funcs.length; j++) {
      const t0 = performance.now();
      await Promise.all(iterationProductIds.map(async (productId) => (
        await funcs[j].func(productId)
      )));
      const t1 = performance.now();
      times[j].push(t1 - t0);
    }
    console.log(`Iteration ${i + 1}/${options.iterations} completed`);
  }
  const output = generateOutput(funcs, times, options.iterations, options.clients);
  console.log(output);
};
