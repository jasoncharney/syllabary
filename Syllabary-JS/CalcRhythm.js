var rhythmCalc = [0., 0.114766, 0.073457, 0.057293, 0.048493, 0.036639, 0.031251, 0.024426, 0.022989, 0.019756, 0.021911, 0.022989, 0.025863, 0.042925, 0.053162, 0.061963, 0.061604]
var total = 0;
var ioi = new Array(rhythmCalc.length);

for (i = 0; i < rhythmCalc.length - 1; i++) {
    total += rhythmCalc[i];
    ioi[i] = total;
}
console.log(ioi);