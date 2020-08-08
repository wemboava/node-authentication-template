import IMailTemplateProvider from "../models/IMailTemplateProvider";

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return "Mail content fake";
  }
}
export default FakeMailTemplateProvider;
