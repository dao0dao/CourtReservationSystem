export class InfoService {

  isInfo: boolean = false;
  infoText: string = '';

  showInfo(text: string) {
    this.isInfo = true;
    this.infoText = text;
    setTimeout(() => {
      this.hideInfo();
    }, 3000);
  }

  private hideInfo() {
    this.isInfo = false;
    this.infoText = '';
  }

  constructor() { }
}
