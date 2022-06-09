const { performance } = require('perf_hooks');

const calculateMean = (array) => {
  let sum = 0;
  for (const x of array) { sum += x; p}
  return sum / array.length;
}

const calculateStandardDeviation = (array) => {
  const mean = calculateMean(array);
  const N = array.length;
  let sum = 0;
  for (const x of array) { sum += (x - mean) ** 2; }
  return (sum / N - 1) ** (1 / 2);
}

const calculateStandardError = (array) => {
  return calculateStandardDeviation(array) / (array.length ** (1 / 2));
}

const calculateStringLength = (array) => {
  return Math.max(...array.map(x => Math.trunc(x).toString().length));
}

const generateMessage = (name, nameLength, mean, meanLength, standardError, StandardErrorLength) => {
  const precision = 5;
  const nameMessage = name.padEnd(nameLength, ' ');
  const meanMessage = mean.toFixed(precision).padStart(meanLength + precision, ' ');
  const standardErrorMessage = standardError.toFixed(precision).padStart(StandardErrorLength + precision, ' ');
  return `| ${nameMessage} | ${meanMessage} +/- ${standardErrorMessage} |`;
}

const generateOutput = (funcs, times) => {
  const scaledTimes = times.map((timeArray) => timeArray.map((time) => time / 1000));
  const means = scaledTimes.map((timeArray) => calculateMean(timeArray));
  const standardErrors = scaledTimes.map((timeArray) => calculateStandardError(timeArray));

  const nameLength = Math.max(...funcs.map(func => func.name.length));
  const meanLength = calculateStringLength(means);
  const standardErrorLength = calculateStringLength(standardErrors);

  const bars = `| ${''.padEnd(nameLength, -)} | ${''.padEnd(meanLength + 5, -)}-----${''.padEnd(standardErrorLength + 5, -)} |`;
  let message = bars + '\n';

  for (const i = 0; i < funcs.length; i++) {
    message += generateMessage(funcs[i].name, nameLength, means[i], meanLength, standardErrors[i], standardErrorLength) + '\n';
  }

  return message + bars;
}

const randomIds = [...Array(1e4)].map(() => Math.floor(Math.random() * 1e6));

//options:
  //iterations
  //clients
benchmark = async (
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
  const times = [...Array(options.iterations)].fill([]);

  for (const i =  0; i < options.iterations; i++) {
    const iterationProductIds = productIds.slice(i * options.clients, (i + 1) * options.clients)

    for (const funcObj of funcs) {
      const t0 = performance.now()
      await Promise.all(iterationProductIds.map(productId => (
        await funcObj.func(productId)
      ));
      const t1 = performance.now();
      times[i].push(t1 - t0);
    }

    console.log(`Iteration ${iterationsCount}/${options.iterations} completed`);
  }

  const output = generateOutput(funcs, times);
  console.log(output);
};
