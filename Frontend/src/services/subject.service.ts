/* eslint-disable @typescript-eslint/naming-convention */
import { apiPaths } from "@constants/apiPaths";
import { IChapter, ISubject } from "@MyTypes/subject.type";

import { IBaseService } from "./BaseService.service";

export class ISubjectService extends IBaseService {
  constructor() {
    super(apiPaths.subjects);
  }
  public getSubjects(): Promise<ISubject[]> {
    return super.get();
  }
  public getChaptersForSubject(id: number): Promise<IChapter[]> {
    return super.getOne(id);
  }

  updateChapterProgress(chapter_id: number) {
    return super._put(apiPaths.update_chapter_progress + `${chapter_id}/`, {});
  }
  updateSubjectProgress(subject_id: number) {
    return super._put(apiPaths.update_chapter_progress + `${subject_id}/`, {});
  }
}
