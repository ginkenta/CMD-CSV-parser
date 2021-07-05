import { parser } from "./parser";
import { Command } from "commander";

const program = new Command();

// Example url
// const url =
//   "https://pics.ebaystatic.com/aw/pics/catchanges/US_NewStructure(Oct2019).csv";

program
  .option("-d, --download <url>", "link to download csv file")
  .option("-t, --transform <name>", "transform specific file to json")
  .option("-l, --list", "list of all downloaded files")
  .configureOutput({
    // Visibly override write routines as example!
    writeOut: (str: string) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str: string) => process.stdout.write(`[ERR] ${str}`),
    // Highlight errors in color.
    outputError: (str: string, write) => write(`\x1b[31m${str}\x1b[0m`),
  })
  .parse(process.argv);

const options = program.opts();

if (options.list) {
  parser.listDownloadedFiles();
}

if (options.download) {
  const url = options.download;
  parser.downloadFile(url);
}
if (options.transform) {
  const fileName = options.transform;
  parser.convertToJson(fileName);
}
