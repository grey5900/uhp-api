/**
 * Created by isaac on 16/3/4.
 */
import ioncreator from 'lib/io.sound';
let sharedAudioService = null;

export default
class Audio {
  constructor() {
    sharedAudioService = this;
    if (typeof window !== 'undefined') {
      ioncreator(window, navigator);
      window.ion.sound({
        sounds: [
          {
            name: 'qrcode_found',
            path: '/audio/',
            volume: 1
          },
          {
            name: 'beep',
            path: '/audio/',
            volume: 1
          }
        ],
        preload: true
      });
      this.ion = window.ion;
    }
  }
  play(name) {
    this.ion.sound.play(name);
  }
  static init = () => {
    if (!sharedAudioService) {
      sharedAudioService = new Audio();
    }
  };
  static play = (name) => {
    sharedAudioService.play(name);
  };
}
