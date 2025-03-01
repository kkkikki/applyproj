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
  title!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "경력",
  })
  experience!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "학력",
  })
  education_background!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "근무형태",
  })
  employment_type!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "급여",
  })
  salary!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "직급/직책",
  })
  position!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "근무지역",
  })
  work_location!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    comment: "근무요일",
  })
  working_days!: string;
}
