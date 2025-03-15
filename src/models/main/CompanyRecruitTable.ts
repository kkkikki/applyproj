import { ModelABC } from "@qillie/wheel-micro-service";
import { Table, AllowNull, Column, DataType } from "sequelize-typescript";

@Table({
  freezeTableName: true,
  tableName: "company_recruit_table",
})
export default class CompanyRecruitTable extends ModelABC {
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "제목",
  })
  company_name!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: "경력",
  })
  experience!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: "학력",
  })
  education!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: "근무형태",
  })
  employment_type!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: "급여",
  })
  salary!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: "직급/직책",
  })
  position!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: "근무지역",
  })
  location!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    comment: "근무일시",
  })
  working_days!: string;

  // 이미 스크랩한지 여부를 체크하는 컬럼
  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "링크",
  })
  job_post_link!: string;

  @AllowNull(true)
  @Column({
    type: DataType.BOOLEAN,
    comment: "지원 여부",
    defaultValue: false,
  })
  applied!: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.BOOLEAN,
    comment: "스크랩 여부",
    defaultValue: false,
  })
  is_scraped!: boolean;
}
