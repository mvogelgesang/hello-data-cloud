const { execSync } = require("child_process");
const fs = require("fs");
const csv = require("fast-csv");

// Execute the command
let contactResult = execSync(
  'sf data query -q "SELECT Id, FirstName, LastName from Contact" --json',
  { encoding: "utf8" }
);
let parsedContactResult = JSON.parse(contactResult).result.records;
console.log(`> ${parsedContactResult.length} contacts fetched`);
let adoptionEventResult = execSync(
  'sf data query -q "SELECT Id, Name from Adoption_Event__c" --json',
  { encoding: "utf8" }
);
let parsedAdoptionEventResult = JSON.parse(adoptionEventResult).result.records;
console.log(`> ${parsedAdoptionEventResult.length} adoption events fetched`);
// for each adoption event, retrieve 20-50 contact records and write results to a csv file containing a Contact__c and Adoption_Event__c header

let csvStream = csv.format({ headers: true });
csvStream
  .on("end", () => {
    console.log("> CSV file successfully written");
    execSync(
      "sf data upsert bulk -f data/output.csv -w 5 -s Adoption_Event_Volunteer__c -i Id",
      { encoding: "utf8" }
    );
  })
  .pipe(fs.createWriteStream("data/output.csv"));

parsedAdoptionEventResult.forEach((event) => {
  // shuffles the array and retrieves 20-50 contacts for insertion into the csv file
  let contacts = parsedContactResult
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 31) + 20);
  contacts.forEach((contact) => {
    csvStream.write({
      Contact__c: contact.Id,
      Adoption_Event__c: event.Id,
      Name: `${event.Name} - ${contact.FirstName} ${contact.LastName}`
    });
  });
});

csvStream.end();

