import * as fs from "fs";
import csv from "csv-parse";
import fetch from "node-fetch";
import { CategoriesTree } from "./interfaces/CategoriesTree";

// Example url
// const url =
//   "https://pics.ebaystatic.com/aw/pics/catchanges/US_NewStructure(Oct2019).csv";

class Parser {
  constructor(
    private readonly parser: any,
    private readonly downloadFolder: string = "categories/",
    private readonly downloadedFilesList: Set<string> = new Set()
  ) {}

  async downloadFile(url: string): Promise<void> {
    const parsedUrl = url?.split("/");
    const fileName = parsedUrl?.[parsedUrl.length - 1];

    this.downloadedFilesList.add(fileName);

    const readable = await fetch(url);
    const writable = fs.createWriteStream(this.downloadFolder + fileName);

    readable?.body?.pipe(writable);
  }

  async listDownloadedFiles(): Promise<void> {
    let existFiles = this.downloadedFilesList;

    if (!existFiles?.keys?.length) {
      const allFiles = fs.readdirSync("categories/");
      const downloadedFiles = allFiles?.filter((e) => !/\.json?/i.test(e));

      existFiles = new Set(downloadedFiles);
    }
    existFiles.forEach((n) => console.log(n) + "\n");
  }

  async convertToJson(fileName: string): Promise<void> {
    const output: Array<Array<string>> = [];
    const pathToFileRead = this.downloadFolder + fileName;
    const pathToFileWrite =
      this.downloadFolder + fileName.replace(/\.csv$/, ".json");

    if (!fs.existsSync(pathToFileRead)) throw new Error("File not exist");

    const readFileStream = fs.createReadStream(pathToFileRead);
    readFileStream
      .pipe(this.parser)
      .on("data", (data: Array<string>) => {
        const prettyData = data
          ?.filter((e) => e !== '"' && e !== "")
          ?.map((e) => e.replace(/\"/g, ""));
        output.push(prettyData);
      })
      .on("end", () => {
        output.splice(0, 3);
        const outputJsonArray: CategoriesTree[] = [];

        for (const arrOfElements of output) {
          const [name, value] = arrOfElements;
          const elToWrite = { name, value };
          const elementAlreadyExist = outputJsonArray?.find(
            (e) => e.name === name
          );

          if (!elementAlreadyExist) outputJsonArray.push(elToWrite);
          else {
            elementAlreadyExist.subSchemas = [];
            elementAlreadyExist?.subSchemas?.push(elToWrite);
          }
        }
        fs.writeFileSync(pathToFileWrite, JSON.stringify(outputJsonArray));
      });
  }
}

export const parser = new Parser(
  csv({
    quote: "'",
    ltrim: true,
    rtrim: true,
    relax_column_count: true,
    escape: '"',
    delimiter: '","',
    relax: true,
    skip_empty_lines: true,
  })
);
