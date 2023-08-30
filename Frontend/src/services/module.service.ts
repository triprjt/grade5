/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiPaths } from "@constants/apiPaths";
import { IContent, IContentType } from "@MyTypes/content.type";
import { IModule } from "@MyTypes/module.type";

import { IBaseService } from "./BaseService.service";

export class IModuleContext extends IBaseService {
  constructor() {
    super(apiPaths.module_content);
  }
  getContents(id: number) {
    return super.getOne<IContent[]>(id);
  }
  updateModuleContent(module_id: number, type: IContentType) {
    return super._put(apiPaths.update_progress_of_content + `${module_id}/${type}/`, {});
  }
  updateModule(module_id: number) {
    return super._put(apiPaths.update_module_progress + `${module_id}/`, {});
  }
}

export class IUpdateProgress extends IBaseService {
  constructor() {
    super(apiPaths.update_progress_of_content);
  }
  updateModule(module_id: number, type: IContentType) {
    return super._put(`${module_id}/${type}/`, {});
  }
}

export class IModuleService extends IBaseService {
  constructor() {
    super(apiPaths.chapter_modules);
  }
  getModuleContent(id: number) {
    return super.getOne<IModule[]>(id);
  }
  get content() {
    return new IModuleContext();
  }
}
