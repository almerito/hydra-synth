import Hydra from '../src/hydra-synth.js';
import { fugitiveGeometry, exampleVideo, exampleResize, nonGlobalCanvas } from './examples.js';

function init() {
    window.hydra = new Hydra({ detectAudio: false, makeGlobal: true });

    // Basic test - oscillator output
    osc().out();

    // Uncomment to test other examples:
    // exampleVideo();
    // exampleResize();
    // nonGlobalCanvas();

    // Test texture source (uncomment to test):
    // s0.initVideo("https://media.giphy.com/media/26ufplp8yheSKUE00/giphy.mp4", {});
    // src(s0).repeat().out();
}

window.onload = init;

