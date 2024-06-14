const fs = require("fs");
const xml2js = require("xml2js");

const permissionSetPath =
  "force-app/main/default/permissionsets/sfdc_c360a_sfdctrust_permSet.permissionset-meta.xml";

const updatePerms = (objectApiNameArray) => {
  // Read the XML file
  fs.readFile(permissionSetPath, "utf-8", (err, data) => {
    if (err) throw err;

    // Parse the XML data into a JavaScript object
    xml2js.parseString(data, (err, result) => {
      if (err) throw err;
      for (sObject in objectApiNameArray) {
        // Create a new objectPermissions object
        const newObjectPermissions = {
          allowCreate: ["false"],
          allowDelete: ["false"],
          allowEdit: ["false"],
          allowRead: ["true"],
          modifyAllRecords: ["false"],
          object: [sObject],
          viewAllRecords: ["true"]
        };
        // Push the new objectPermissions object into the PermissionSet.objectPermissions array
        result.PermissionSet.objectPermissions.push(newObjectPermissions);
        // create field level permissions
        // read in all field files for the given object
        // find all child files of the force-app/main/default/objects/{sobjectapiname}/fields folder

        const fieldFolder = `force-app/main/default/objects/${objectApiNameArray[sObject]}/fields`;
        const fieldFiles = fs.readdirSync(fieldFolder);
        for (fieldFile of fieldFiles) {
          const fieldApiName = fieldFile.replace(/\.field-meta\.xml$/, "");

          const newFieldPermission = {
            editable: ["false"],
            field: [`${objectApiNameArray[sObject]}.${fieldApiName}`],
            readable: ["true"]
          };
          // check if this entry exists, if so, replace it
          const fieldPermissionIndex =
            result.PermissionSet.fieldPermissions.findIndex(
              (fieldPermission) =>
                fieldPermission.field[0] === `${objectApiNameArray[sObject]}.`
            );

          if (fieldPermissionIndex > -1) {
            result.PermissionSet.fieldPermissions.splice(
              fieldPermissionIndex,
              1
            );
          }
          result.PermissionSet.fieldPermissions.push(newFieldPermission);
        }
      }

      // Convert the JavaScript object back into XML
      const builder = new xml2js.Builder();
      const xml = builder.buildObject(result);

      // Write the XML data back to the file
      fs.writeFile(permissionSetPath, xml, (err) => {
        if (err) throw err;
      });
    });
  });
};

const getObjectApiNames = () => {
  // Define the directory path
  const dirPath = "force-app/main/default/objects";

  // Read the directory
  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    // Filter for directories and map to their names
    const sObjectApiNameArray = files
      .filter((file) => file.isDirectory())
      .map((file) => file.name);

    console.log(sObjectApiNameArray);
    return sObjectApiNameArray;
  });
};

const sObjectApiNameArray = getObjectApiNames();
updatePerms(sObjectApiNameArray);
