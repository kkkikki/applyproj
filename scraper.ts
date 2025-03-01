import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function scrapeJobDetails() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // 파일 경로 설정
  const filePath =
    "file://" + path.resolve("/home/kkkikki/다운로드/saramin.html");
  await page.goto(filePath, { waitUntil: "domcontentloaded" });

  // 채용 정보 추출
  const jobData = await page.evaluate(() => {
    const getText = (selector: string) =>
      document.querySelector(selector)?.textContent?.trim() || "";

    // 특정 dt에 해당하는 dd 값을 찾는 함수
    const getDlValue = (term: string) => {
      const dtElements = Array.from(document.querySelectorAll("dl dt"));
      const targetDt = dtElements.find((el) =>
        el.textContent?.trim().includes(term)
      );
      return targetDt
        ? targetDt.nextElementSibling?.textContent?.trim() || ""
        : "";
    };

    return {
      id:
        document.querySelector('[name="rec_idx"]')?.getAttribute("content") ||
        "",
      title: getText("h1.jv_title"),
      experience: getDlValue("경력"),
      education_background: getDlValue("학력"),
      employment_type: getDlValue("근무형태"),
      salary: getDlValue("급여"),
      work_location: getDlValue("근무지역"),
      application_deadline: getText("span.dday"),
      apply_site:
        document.querySelector(".btn_apply a")?.getAttribute("href") || "",
      apply_manager: "", // HTML에서 확인 필요
      contact_number: "", // HTML에서 확인 필요
      position: getText(".position"), // 선택자 확인 필요
      jd_content: getText(".jv_cont.jv_summary"), // 상세 업무 내용
      jd_benefits: getText(".welfare_list"), // 복지 혜택
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  // JSON 파일 저장 경로 설정
  const outputPath = path.resolve("/home/kkkikki/다운로드/job_details.json");
  fs.writeFileSync(outputPath, JSON.stringify(jobData, null, 2));

  console.log(`Job details saved: ${outputPath}`);
  await browser.close();
}

scrapeJobDetails();
