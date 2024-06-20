const { execSync } = require("child_process");
const fs = require("fs");
const csv = require("fast-csv");

let adoptionEventVolunteerResult = execSync(
  'sf data query -q "SELECT Id from Adoption_Event_Volunteer__c" --json',
  { encoding: "utf8" }
);
let parsedAdoptionEventVolunteerResult = JSON.parse(
  adoptionEventVolunteerResult
).result.records;
console.log(
  `> ${parsedAdoptionEventVolunteerResult.length} adoption volunteer events records fetched`
);
// for each adoption event, retrieve 20-50 contact records and write results to a csv file containing a Contact__c and Adoption_Event__c header

let csvStream = csv.format({ headers: true });
csvStream
  .on("end", () => {
    console.log("> CSV file successfully written");
    execSync(
      "sf data delete bulk -f data/recordsToDelete.csv -w 5 -s Adoption_Event_Volunteer__c",
      { encoding: "utf8" }
    );
  })
  .pipe(fs.createWriteStream("data/recordsToDelete.csv"));

csvStream.end();
