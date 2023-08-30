/* eslint-disable @typescript-eslint/naming-convention */
import { IAuthService } from "./auth.service";
import { IModuleService } from "./module.service";
import { ISubjectService } from "./subject.service";

export class Sdk {
  public static auth = new IAuthService();
  public static subject = new ISubjectService();
  public static module = new IModuleService();
}
