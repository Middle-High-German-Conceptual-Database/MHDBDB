import {MhdbdbIdLabelEntity} from "app/shared/baseIndexComponent/baseindexcomponent.class";

export class Place extends MhdbdbIdLabelEntity {

  constructor(
    public id: string,
    public label: string,
  ) {
    super(id, label)
  }
}
