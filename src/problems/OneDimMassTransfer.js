// Lab 1
const defaultProps = {
  l: 500,
  h: 20,
  k: 1.4,
  h1: 1.5 + 0.1 * Math.sin(11),
  h2: 0.5 + 0.1 * Math.cos(11),
  d: 0.1 * 11,
  gamma:  0.0065,
  sigma: 0.2,
  c0: (x) => 11 + Math.cos(11 * x) * Math.cos(11 * x),
  c1: (t) => 12 * Math.exp(-t),
  c2: (t) => 0.5 * t + 0.1 * t + 11 * t + Math.cos(11 * 500 * t) * Math.cos(11 * 500 * t),
  t: 3000,
  tau: 30,
  cg: 100,
};

class OneDimMassTransfer {
  constructor(props) {
    this.props = { ...defaultProps, ...props };

    const {
      l,
      h,
      k,
      h1,
      h2,
      d,
      gamma,
      sigma,
      tau,
      t,
    } = this.props;

    // Визначаю коефіцієнти та інші змінні, що використовуються при пошуку альф і бет
    this.steps = parseInt(l / h);
    this.tSteps = parseInt(t/ tau);
    this.v = k * (h1 - h2) / l;
    this.r = - this.v / d;
    this.rPlus = 0;
    this.rMinus = this.r;
    this.mu = 1 / (1 + 0.5 * h * Math.abs(this.r));
    this.a = this.mu / Math.pow(h,2) - this.rMinus / h;
    this.b = this.mu / Math.pow(h,2) + this.rPlus / h;
    this.c = this.a + this.b + gamma / d + sigma / (d * tau);
    this.alpha = this.calculateAlpha();
    this.data = [[]];
  }

  calculateAlpha() {
    const array = [0];

    for (let i = 1; i < this.steps; i += 1) {
      array[i] = this.b / (this.c - array[i-1] * this.a);
    }

    return array;
  }

  calculateBeta(t) {
    const array =  [this.props.c1(t * this.props.tau)];

    for (let i = 1; i < this.steps; i += 1) {
      array[i] = (this.a * array[i-1] + this.f(t, i)) / (this.c - this.a * this.alpha[i-1]);
    }

    return array;
  }

  f(t, i) {
    const {
      gamma,
      d,
      sigma,
      tau,
      cg,
    } = this.props;

    return (gamma / d) * cg + (sigma / (d * tau)) * this.data[t-1][i-1];
  }

  solve() {
    const {
      c0,
      c1,
      c2,
      h,
      tau,
    } = this.props;

    this.data = [];

    // Задаю граничні умови справа та зліва
    for (let t = 0; t <= this.tSteps; t += 1) {
      this.data.push([]);
      this.data[t][0] = c1(t * tau);
      this.data[t][this.steps-1] = c2(t * tau);
    }

    // Задаю граничні умови в початковий момент часу
    for (let i = 1; i < this.steps - 1; i += 1) {
      this.data[0][i] = c0(i * h);
    }

    //Методом прогонки знаходжу розв'язок
    for (let t = 1; t <= this.tSteps; t += 1) {
      const beta = this.calculateBeta(t);

      for (let i = this.steps - 2; i > 0; i -= 1) {
        this.data[t][i] = this.alpha[i+1] * this.data[t][i+1] + beta[i+1];
      }
    }

    return this.data;
  }

  getXAxis() {
    const array = [];

    for (let i = 0; i < this.steps; i += 1) {
      array.push(i * this.props.h);
    }

    return array;
  }
}

export default OneDimMassTransfer;
