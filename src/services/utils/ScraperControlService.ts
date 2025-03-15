import moment from "moment";
import { ScraperServiceABC, sleep } from "@qillie/wheel-micro-service";
import _ from "lodash";
import sequelize from "sequelize";
import axios from "axios";
import puppeteer, { Page } from "puppeteer";
import CompanyRecruitTable from "../../models/main/CompanyRecruitTable";

/**
 * @name 테스트 컨트롤 서비스
 */
export default class ScraperControlService extends ScraperServiceABC {
  /**
   * @name  Open saramin
   */
  /**
   * @name 사람인 열기
   */
  public async openSaramin({}: {}) {
    const browser = await puppeteer.launch({
      headless: false, //true, // 브라우저 UI를 표시
      defaultViewport: null, // 전체 브라우저 창으로 열기
      args: [
        "--disable-web-security", // CORS 정책 비활성화
        "--disable-features=IsolateOrigins,site-per-process", // 사이트 간 프로세스 분리 비활성화
        "--allow-running-insecure-content", // 비보안 콘텐츠 허용
      ],
    });

    const page = await browser.newPage();

    let continueScraping = true;

    for (let i = 2; i <= 20; i++) {
      if (!continueScraping) {
        break;
      }

      await page.goto(
        `https://www.saramin.co.kr/zf_user/jobs/list/job-category?page=${i}&cat_mcls=2&loc_mcd=101000%2C102000&search_optional_item=n&search_done=y&panel_count=y&preview=y&isAjaxRequest=0&page_count=50&sort=RL&type=job-category&is_param=1&isSearchResultEmpty=1&isSectionHome=0&searchParamCount=2#searchTitle`
      );

      // 클래스명이 box_item 인 div 리스트 가져오기
      const boxItemElementList = await page.$$(".box_item");

      // 링크 데이터 담는 배열
      const linkList: string[] = [];

      // 엘리먼트 리스트를 순회하며, 각 엘리먼트의 데이터를 추출
      for (const boxItemElement of boxItemElementList) {
        // 기본 정보 추출
        const notificationInfoElement = await boxItemElement.$(
          ".notification_info"
        );

        if (notificationInfoElement !== null) {
          // 링크 엘리먼트 추출
          const linkElement = await notificationInfoElement.$("a");

          // 링크 엘리먼트의 링크 추출
          if (linkElement !== null) {
            const link = await page.evaluate(
              (element) => element.getAttribute("href"),
              linkElement
            );

            if (link !== null) {
              linkList.push(link);
            }
          }
        }
      }

      for (const link of linkList) {
        // Check if we should continue scraping
        const companyRecruitTable = await CompanyRecruitTable.findOne({
          where: {
            job_post_link: link,
          },
        });

        continueScraping = companyRecruitTable === null;

        // 각 링크로 이동
        if (!continueScraping) {
          break;
        }

        try {
          await page.goto(`https://www.saramin.co.kr${link}`);

          // 데이터 로드 시까지 대기
          await sleep(1000);

          // 각 페이지에서 데이터 추출
          // 회사명
          // 정보 표 엘리먼트 찾기
          const columnElementList = await page.$$(
            "#content > div.wrap_jview > section > div.wrap_jv_cont > div.jv_cont.jv_summary > div > div.col"
          );

          // 데이터 담기
          const data: { [key: string]: string } = {};

          const titleElement = await page.$(
            "#content > div.wrap_jview > section > div.wrap_jv_cont > div.wrap_jv_header > div > div.title_inner"
          );

          if (titleElement !== null) {
            const titleText = await page.evaluate(
              (element) => element.textContent,
              titleElement
            );

            if (titleText !== null) {
              data["제목"] = titleText;
            }
          }

          for (const columnElement of columnElementList) {
            // 정보 표 엘리먼트 리스트 찾기
            const contentElementList = await columnElement.$$("dl");

            // 정보 표 엘리먼트 리스트 순회하머 정보 추출
            for (const contentElement of contentElementList) {
              // 제목 엘리먼트
              const titleElement = await contentElement.$("dt");

              // 내용 엘리먼트
              const dataElement = await contentElement.$("dd");

              if (titleElement !== null && dataElement !== null) {
                // 제목 텍스트
                const titleText = await page.evaluate(
                  (element) => element.textContent,
                  titleElement
                );

                // 내용 텍스트
                const dataText = await page.evaluate(
                  (element) => element.textContent,
                  dataElement
                );

                if (titleText !== null && dataText !== null) {
                  data[titleText] = dataText;
                }
              }
            }
          }

          await CompanyRecruitTable.create({
            company_name: data["제목"],
            experience: data["경력"],
            education: data["학력"],
            employment_type: data["근무형태"],
            salary: data["급여"],
            position: data["직급/직책"],
            location: data["근무지역"],
            working_days: data["근무일시"] || "미기재",
            job_post_link: data["링크"],
            applied: data["지원 여부"],
            is_scraped: data["스크랩 여부"],
          });

          console.log(JSON.stringify(data, null, 4));
          await sleep(5000);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
} // 클래스 닫기
