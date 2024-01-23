// https://brain.js.org/#/getting-started
// https://medium.com/@neversaynever0502/%E7%94%A8js%E5%81%9A%E6%A9%9F%E5%99%A8%E5%AD%B8%E7%BF%92-brain-js%E5%A5%97%E4%BB%B6%E6%95%99%E5%AD%B8-4e8d3b919c68
// https://guixu.games/index.php/2023/03/28/brain-js%E4%BF%9D%E5%AD%98%E5%B7%B2%E7%BB%8F%E8%AE%AD%E7%BB%83%E5%A5%BD%E7%9A%84%E6%A8%A1%E5%9E%8B/
// https://www.npmjs.com/package/gpu.js/v/2.4.0#installation

// https://stackoverflow.com/questions/77251296/distutils-not-found-when-running-npm-install
import brain from 'brain.js';
// console.log(brain);

const config = {
  binaryThresh: 0.5,
  hiddenLayers: [3], // array of ints for the sizes of the hidden layers in the network
  activation: 'sigmoid' // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh']
};

const net = new brain.NeuralNetwork(config);

net.train([
  { input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 } },
  { input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 } },
  { input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 } }
]);

const output = net.run({ r: 1, g: 0.4, b: 0 });
console.log(output);
