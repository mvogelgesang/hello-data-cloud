
# Retrieveing data kit

`sf project retrieve start -m DataSourceBundleDefinition -m DataStreamTemplate -m DataPackageKitDefinition -m DataPackageKitObject -m FieldSrcTrgtRelationship -m DataCalcInsightTemplate -m DataSourceObject -m DataSource -m DataSrcDataModelFieldMap -m CustomObject:Adoption_Event_c_00DDa000001Wc5U__dlm -m CustomObject:Adoption_Event_Volunteer_00DDa000001__dlm -o {YOUR DEV ORG} -r data-app/`


## deployment

Installation takes place in three parts, the first is the base app and the second is the Data Cloud extension. _If deploying to a newly provisioned scratch org, the Data Cloud deployment will block the force-app installation until it is complete._ No harm in entering the first command and letting it queue.

### 1 - Base App

`sf project deploy start --source-dir force-app`
`sf org assign permset -n Adoption_Event_Admin`

#### Seed data

`sf data import tree -p data/Contact-Adoption_Event__c-plan.json`

`npm run createAEVData`

#### Update Page Layouts

Setup > Object Manager > Contacts > Page Layouts > Contact Page Layout

Add Adoption Event Volunteer to the related lists section.

#### Data Cloud Prep

Update permissions for Data Cloud Salesforce Connector, this can be done manually or via a script. 

##### Manual

- Setup > Permission Sets > Data Cloud Salesforce Connector
- Object Settings > Adoption Events > Edit
  - Enable all Object permissions (read, create, edit, delete, view all, modify all)
  - Enable Read access for all fields
  - Save
- Object Settings > Adoption Event Volunteer
  - Enable all Object permissions (read, create, edit, delete, view all, modify all)
  - Enable Read access for all fields
  - Save

##### Scripted

`sf project retrieve start -m permissionSet:sfdc_c360a_sfdctrust_permSet --output-dir tmp`

Script will look at all objects in your force-app directory and add object and field level read permissions

`npm run updateDCConnectorPerms.js`

Deploy the update back to your org

`sf project deploy start --source-dir tmp/`

Remove the tmp/ folder to avoid any confusion

`rm -rf tmp/`

### 2 - Deploy Data Cloud Extension

`sf project deploy start --source-dir data-app -o {YOUR NEW ORG}`