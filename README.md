
# Retrieveing data kit

`sf project retrieve start -x data-app/main/default/package.xml -r mdapi`

convert it to new format

`sf project convert mdapi -r output -d data-app`


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

Update permissions for Data Cloud Salesforce Connector

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

`sf project retrieve start -m permissionSet:sfdc_c360a_sfdctrust_permSet`

Script will look at all objects in your force-app directory and add object and field level read permissions

`node updateDCConnectorPerms.js`

Deploy the update back to your org

`sf project deploy start -m permissionSet:sfdc_c360a_sfdctrust_permSet`

### 2 - Deploy Data Cloud Extension

`sf project deploy start --source-dir data-app`