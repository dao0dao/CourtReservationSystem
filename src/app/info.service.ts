export class InfoService {

  isInfo: boolean = false;
  infoText: string = '';
  confirm: boolean = false;

  showInfo(text: string, confirm: boolean = false) {
    this.isInfo = true;
    this.infoText = text;
    this.confirm = confirm;
    setTimeout(() => {
      this.hideInfo();
    }, 3000);
  }

  private hideInfo() {
    this.isInfo = false;
    this.infoText = '';
    this.confirm = false;
  }

  constructor() { }
}
