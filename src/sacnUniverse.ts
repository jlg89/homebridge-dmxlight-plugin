import { Client, IPacket } from 'e131';
import { Logger } from 'homebridge';

export class SacnUniverse {
    sacnClient: Client;
    sacnSlotsData: Array<number>;
    sacnPacket: IPacket;
    universe: number;
    channelStart: number;
    channelCount: number;
    colorOrder: string;
    transitionEffect: string;
    transitionEffectDuration: number;

    constructor(ipAddress: string, universe: number, channelStart: number, channelCount: number, colorOrder: string,
      transitionEffect: string, transitionEffectDuration: number, log: Logger) {
      // Configure Streaming ACN
      if (ipAddress !== '') {
        this.sacnClient = new Client(ipAddress);
      } else {
        this.sacnClient = new Client('localhost');
      }

      // Create packets. The buffer size should match the number of pixels needed (8 * 3 = 24) so use the channel count.
      // If the pixel is white only, then the buffer size should equal 1 for each light.
      this.sacnPacket = this.sacnClient.createPacket(channelCount);
      this.sacnPacket.setSourceName('DMXLightPlugin');
      this.sacnPacket.setUniverse(universe);
      this.sacnSlotsData = this.sacnPacket.getSlotsData();

      this.universe = universe;
      this.channelStart = channelStart;
      this.channelCount = channelCount;
      this.colorOrder = colorOrder.toLocaleLowerCase();
      this.transitionEffect = transitionEffect.toLocaleLowerCase();
      this.transitionEffectDuration = transitionEffectDuration;

      log.info('Initialized new SACN Universe #' + universe + ' with ' + channelCount + ' channel(s)');
    }
}
